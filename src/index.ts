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

export interface ICertbotProps {
  /**
   * The comma delimited list of domains for which the Let's Encrypt certificate will be valid. Primary domain should be first.
   */
  letsencryptDomains: string;
  /**
   * The email to associate with the Let's Encrypt certificate request.
   */
  letsencryptEmail: string;
  /**
   * Any additional Lambda layers to use with the created function. For example Lambda Extensions
   */
  hostedZoneNames: string[];
  /**
   * Hosted zone names that will be required for DNS verification with certbot
   */
  layers?: lambda.ILayerVersion[];
  /**
   * The S3 bucket to place the resulting certificates in. If no bucket is given one will be created automatically.
   */
  bucket?: s3.Bucket;
  /**
   * The prefix to apply to the final S3 key name for the certificates. Default is no prefix.
   */
  objectPrefix?: string;
  /**
   * The numbers of days left until the prior cert expires before issuing a new one. Default is 30 days
   */
  reIssueDays?: number;
  /**
   * Set the preferred certificate chain. Default None.
   */
  preferredChain?: string;
  /**
   * The SNS topic to notify when a new cert is issued
   */
  snsTopic?: sns.Topic;
  /**
   * Whether or not to enable Lambda Insights
   */
  enableInsights?: boolean;
  /**
   * Insights layer ARN for your region. Defaults to US-EAST-1
   */
  insightsARN?: string;
  /**
   * The timeout duration for Lambda function
   */
  timeout?: cdk.Duration;
}

export class Certbot extends cdk.Construct {

  public readonly handler: lambda.Function

  constructor(scope: cdk.Construct, id: string, props: ICertbotProps) {
    super(scope, id);

    if (props.bucket === undefined) {
      props.bucket = new s3.Bucket(this, 'bucket', {
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
    }

    const functionDir = path.join(__dirname, '../function');

    if (props.snsTopic === undefined) {
      props.snsTopic = new sns.Topic(this, 'topic');
      props.snsTopic.addSubscription(new subscriptions.EmailSubscription(props.letsencryptEmail));
    }

    props.layers = (props.layers === undefined) ? [] : props.layers;
    props.timeout = (props.timeout === undefined) ? cdk.Duration.seconds(90) : props.timeout;
    props.enableInsights = (props.enableInsights === undefined) ? false : props.enableInsights;
    props.insightsARN = (props.insightsARN === undefined) ? 'arn:aws:lambda:' + cdk.Stack.of(this).region + ':580247275435:layer:LambdaInsightsExtension:14' : props.insightsARN;

    let managedPolicies = [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')];
    if (props.enableInsights) {
      managedPolicies.push(iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLambdaInsightsExecutionRolePolicy'));
      props.layers.push(lambda.LayerVersion.fromLayerVersionArn(this, 'insightsLayer', props.insightsARN));
    }

    const snsPolicy = new iam.ManagedPolicy(this, 'snsPolicy', {
      description: 'Allow the Certbot function to notify an SNS topic upon completion.',
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['sns:Publish'],
          resources: [props.snsTopic.topicArn],
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

    this.handler = new lambda.Function(this, 'handler', {
      runtime: lambda.Runtime.PYTHON_3_8,
      role,
      code: lambda.Code.fromAsset(functionDir + '/function.zip', {
        // Not working with github actions
        // bundling: {
        //   image: lambda.Runtime.PYTHON_3_8.bundlingImage,
        //   local: {
        //     tryBundle(outputDir: string) {
        //       try {
        //         execSync('pip3 --version | grep "python 3.8"');
        //       } catch {
        //         return false;
        //       }

        //       try {
        //         execSync(`pip install -r ${path.join(functionDir, 'requirements.txt')} -t ${path.join(outputDir)}`);
        //       } catch {
        //         return false;
        //       }

        //       try {
        //         execSync(`cp -au ${functionDir}/* ${path.join(outputDir)}`);
        //       } catch {
        //         return false;
        //       }

        //       return true;
        //     },
        //   },
        // },
      }),
      handler: 'index.handler',
      environment: {
        LETSENCRYPT_DOMAINS: props.letsencryptDomains,
        LETSENCRYPT_EMAIL: props.letsencryptEmail,
        CERTIFICATE_BUCKET: props.bucket.bucketArn,
        OBJECT_PREFIX: (props.objectPrefix === undefined) ? '' : props.objectPrefix,
        REISSUE_DAYS: (props.reIssueDays === undefined) ? '30' : String(props.reIssueDays),
        PREFERRED_CHAIN: (props.preferredChain === undefined) ? 'None' : props.preferredChain,
        NOTIFICATION_SNS_ARN: props.snsTopic.topicArn,
      },
      layers: props.layers,
      timeout: props.timeout,
    });

    new events.Rule(this, 'trigger', {
      schedule: events.Schedule.cron({ minute: '0', hour: '0', weekDay: '1' }),
      targets: [new targets.LambdaFunction(this.handler)],
    });
  }
}
