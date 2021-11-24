import * as path from 'path';
import * as events from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as r53 from '@aws-cdk/aws-route53';
import * as s3 from '@aws-cdk/aws-s3';
import * as sns from '@aws-cdk/aws-sns';
import * as subscriptions from '@aws-cdk/aws-sns-subscriptions';
import * as cdk from '@aws-cdk/core';
import * as oneTimeEvents from '@renovosolutions/cdk-library-one-time-event';

export interface CertbotProps {
  /**
   * The comma delimited list of domains for which the Let's Encrypt certificate will be valid. Primary domain should be first.
   */
  readonly letsencryptDomains: string;
  /**
   * The email to associate with the Let's Encrypt certificate request.
   */
  readonly letsencryptEmail: string;
  /**
   * Any additional Lambda layers to use with the created function. For example Lambda Extensions
   */
  readonly layers?: lambda.ILayerVersion[];
  /**
   * Hosted zone names that will be required for DNS verification with certbot
   */
  readonly hostedZoneNames: string[];
  /**
   * The S3 bucket to place the resulting certificates in. If no bucket is given one will be created automatically.
   */
  readonly bucket?: s3.Bucket;
  /**
   * The prefix to apply to the final S3 key name for the certificates. Default is no prefix.
   */
  readonly objectPrefix?: string;
  /**
   * The numbers of days left until the prior cert expires before issuing a new one.
   *
   * @default 30
   */
  readonly reIssueDays?: number;
  /**
   * Set the preferred certificate chain.
   *
   * @default 'None'
   */
  readonly preferredChain?: string;
  /**
   * The SNS topic to notify when a new cert is issued. If no topic is given one will be created automatically.
   */
  readonly snsTopic?: sns.Topic;
  /**
   * Whether or not to enable Lambda Insights
   *
   * @default false
   */
  readonly enableInsights?: boolean;
  /**
   * Insights layer ARN for your region. Defaults to layer for US-EAST-1
   */
  readonly insightsARN?: string;
  /**
   * The timeout duration for Lambda function
   *
   * @default cdk.Duraction.seconds(180)
   */
  readonly timeout?: cdk.Duration;
  /**
   * The schedule for the certificate check trigger.
   *
   * @default events.Schedule.cron({ minute: '0', hour: '0', weekDay: '1' })
   */
  readonly schedule?: events.Schedule;
  /**
   * Whether or not to schedule a trigger to run the function after each deployment
   *
   * @default true
   */
  readonly runOnDeploy?: boolean;
  /**
   * How many minutes to wait before running the post deployment Lambda trigger
   *
   * @default 10
   */
  readonly runOnDeployWaitMinutes?: number;
  /**
   * The description for the resulting Lambda function.
   */
  readonly functionDescription?: string;
  /**
   * The name of the resulting Lambda function.
   */
  readonly functionName?: string;
}

export class Certbot extends cdk.Construct {

  public readonly handler: lambda.Function

  constructor(scope: cdk.Construct, id: string, props: CertbotProps) {
    super(scope, id);

    let bucket: s3.Bucket;

    // Create a bucket if one is not provided
    if (props.bucket === undefined) {
      bucket = new s3.Bucket(this, 'bucket', {
        objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        versioned: true,
        lifecycleRules: [{
          enabled: true,
          abortIncompleteMultipartUploadAfter: cdk.Duration.days(1),
        }],
        encryption: s3.BucketEncryption.S3_MANAGED,
        enforceSSL: true,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      });
    } else {
      bucket = props.bucket;
    }

    const functionDir = path.join(__dirname, '../function');

    // Create an SNS topic if one is not provided and add the defined email to it
    let snsTopic: sns.Topic = props.snsTopic ?? new sns.Topic(this, 'topic');
    if (props.snsTopic === undefined) {
      snsTopic.addSubscription(new subscriptions.EmailSubscription(props.letsencryptEmail));
    }

    // Set property defaults
    let layers: lambda.ILayerVersion[] = props.layers ?? [];
    let runOnDeploy: boolean = props.runOnDeploy ?? true;
    let functionDescription: string = props.functionDescription ?? 'Certbot Renewal Lambda for domain ' + props.letsencryptDomains.split(',')[0];
    let enableInsights: boolean = props.enableInsights ?? false;
    let insightsARN: string = props.insightsARN ?? 'arn:aws:lambda:' + cdk.Stack.of(this).region + ':580247275435:layer:LambdaInsightsExtension:14';

    // Set up role policies
    let managedPolicies = [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')];
    if (enableInsights) {
      managedPolicies.push(iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLambdaInsightsExecutionRolePolicy'));
      layers.push(lambda.LayerVersion.fromLayerVersionArn(this, 'insightsLayer', insightsARN));
    }

    const snsPolicy = new iam.ManagedPolicy(this, 'snsPolicy', {
      description: 'Allow the Certbot function to notify an SNS topic upon completion.',
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['sns:Publish'],
          resources: [snsTopic.topicArn],
        }),
      ],
    });

    let hostedZones:string[] = [];
    props.hostedZoneNames.forEach( (domainName) => {
      hostedZones.push(r53.HostedZone.fromLookup(this, 'zone' + domainName, {
        domainName,
        privateZone: false,
      }).hostedZoneArn);
    });

    const r53Policy = new iam.ManagedPolicy(this, 'r53Policy', {
      description: 'Allow the Certbot function to perform DNS verification.',
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['route53:ListHostedZones'],
          resources: ['*'],
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'route53:GetChange',
            'route53:ChangeResourceRecordSets',
          ],
          resources: ['arn:aws:route53:::change/*'].concat(hostedZones),
        }),
      ],
    });

    const acmPolicy = new iam.ManagedPolicy(this, 'acmPolicy', {
      description: 'Allow the Certbot function to import and list certificates.',
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'acm:ListCertificates',
            'acm:ImportCertificate',
          ],
          resources: ['*'],
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['acm:DescribeCertificate'],
          resources: ['arn:aws:acm:' + cdk.Stack.of(this).region + ':' + cdk.Stack.of(this).account + ':certificate/*'],
        }),
      ],
    });

    managedPolicies.push(snsPolicy);
    managedPolicies.push(r53Policy);
    managedPolicies.push(acmPolicy);

    const role = new iam.Role(this, 'role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies,
    });

    bucket.grantWrite(role);

    // Create the Lambda function
    this.handler = new lambda.Function(this, 'handler', {
      runtime: lambda.Runtime.PYTHON_3_8,
      role,
      code: lambda.Code.fromAsset(functionDir + '/function.zip'),
      handler: 'index.handler',
      functionName: props.functionName,
      description: functionDescription,
      environment: {
        LETSENCRYPT_DOMAINS: props.letsencryptDomains,
        LETSENCRYPT_EMAIL: props.letsencryptEmail,
        CERTIFICATE_BUCKET: bucket.bucketName,
        OBJECT_PREFIX: props.objectPrefix || '',
        REISSUE_DAYS: (props.reIssueDays === undefined) ? '30' : String(props.reIssueDays),
        PREFERRED_CHAIN: props.preferredChain || 'None',
        NOTIFICATION_SNS_ARN: snsTopic.topicArn,
      },
      layers,
      timeout: props.timeout || cdk.Duration.seconds(180),
    });

    // Add function triggers
    new events.Rule(this, 'trigger', {
      schedule: props.schedule || events.Schedule.cron({ minute: '0', hour: '0', weekDay: '1' }),
      targets: [new targets.LambdaFunction(this.handler)],
    });

    if (runOnDeploy) {
      new events.Rule(this, 'triggerImmediate', {
        schedule: new oneTimeEvents.OnDeploy(this, 'schedule', {
          offsetMinutes: props.runOnDeployWaitMinutes || 10,
        }).schedule,
        targets: [new targets.LambdaFunction(this.handler)],
      });
    }
  }
}
