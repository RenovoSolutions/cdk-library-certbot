import * as path from 'path';

import * as oneTimeEvents from '@renovosolutions/cdk-library-one-time-event';
import {
  aws_ec2 as ec2,
  aws_efs as efs,
  aws_events as events,
  aws_events_targets as targets,
  aws_iam as iam,
  aws_lambda as lambda,
  aws_s3 as s3,
  aws_route53 as r53,
  aws_sns as sns,
  aws_sns_subscriptions as subscriptions,
  Duration,
  RemovalPolicy,
  Stack,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { assignRequiredPoliciesToRole } from './required-policies';
import {
  // configureBucketStorage,
  configureSecretsManagerStorage,
  configureSSMStorage,
} from './storage-helpers';

export enum CertificateStorageType {
  /**
   * Store the certificate in AWS Secrets Manager
   */
  SECRETS_MANAGER = 'secretsmanager',
  /**
   * Store the certificates in S3
   */
  S3 = 's3',
  /**
   * Store the certificates as a parameter in AWS Systems Manager Parameter Store  with encryption
   */
  SSM_SECURE = 'ssm_secure',
  /**
   * Store the certificates in EFS, mounted to the Lambda function
   */
  EFS = 'efs',
}

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
  readonly hostedZoneNames?: string[];
  /**
   * The hosted zones that will be required for DNS verification with certbot
   */
  readonly hostedZones?: r53.IHostedZone[];
  /**
   * The S3 bucket to place the resulting certificates in. If no bucket is given one will be created automatically.
   */
  readonly bucket?: s3.Bucket;
  /**
   * The prefix to apply to the final S3 key name for the certificates. Default is no prefix.
   * Also used for EFS.
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
   * Set the key type for the certificate.
   *
   * @default 'ecdsa'
   */
  readonly keyType?: string;
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
   * @default Duraction.seconds(180)
   */
  readonly timeout?: Duration;
  /**
   * The architecture for the Lambda function.
   *
   * This property allows you to specify the architecture type for your Lambda function.
   * Supported values are 'x86_64' for the standard architecture and 'arm64' for the
   * ARM architecture.
   *
   * @default lambda.Architecture.X86_64
   */
  readonly architecture?: lambda.Architecture;
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
  /**
   * The removal policy for the S3 bucket that is automatically created.
   *
   * Has no effect if a bucket is given as a property
   *
   * @default RemovalPolicy.RETAIN
   */
  readonly removalPolicy?: RemovalPolicy;
  /**
   * Whether or not to enable automatic object deletion if the provided bucket is deleted.
   *
   * Has no effect if a bucket is given as a property
   *
   * @default false
   */
  readonly enableObjectDeletion?: boolean;
  /**
   * The method of storage for the resulting certificates.
   *
   * @default CertificateStorageType.S3
   */
  readonly certificateStorage?: CertificateStorageType;
  /**
   * The path to store the certificates in AWS Secrets Manager
   *
   * @default `/certbot/certificates/${letsencryptDomains.split(',')[0]}/`
   */
  readonly secretsManagerPath?: string;
  /**
   * The path to store the certificates in AWS Systems Manager Parameter Store
   *
   * @default `/certbot/certificates/${letsencryptDomains.split(',')[0]}/`
   */
  readonly ssmSecurePath?: string;
  /**
   * The KMS key to use for encryption of the certificates in Secrets Manager
   * or Systems Manager Parameter Store
   *
   * @default AWS managed key
   */
  readonly kmsKeyAlias?: string;
  /**
   * The EFS access point to store the certificates
   */
  readonly efsAccessPoint?: efs.AccessPoint;
  /**
   * The VPC to run the Lambda function in.
   * This is needed if you are using EFS.
   * It should be the same VPC as the EFS filesystem
   *
   * @default none
   */
  readonly vpc?: ec2.IVpc;
}

export class Certbot extends Construct {

  public readonly handler: lambda.Function;

  constructor(scope: Construct, id: string, props: CertbotProps) {
    super(scope, id);

    // Set property defaults
    let layers: lambda.ILayerVersion[] = props.layers ?? [];
    let runOnDeploy: boolean = props.runOnDeploy ?? true;
    let functionDescription: string = props.functionDescription ?? 'Certbot Renewal Lambda for domain ' + props.letsencryptDomains.split(',')[0];
    let enableInsights: boolean = props.enableInsights ?? false;
    let insightsARN: string = props.insightsARN ?? 'arn:aws:lambda:' + Stack.of(this).region + ':580247275435:layer:LambdaInsightsExtension:14';

    if (props.hostedZoneNames === undefined && props.hostedZones === undefined) {
      throw new Error('You must provide either hostedZoneNames or hostedZones');
    }

    // Create an SNS topic if one is not provided and add the defined email to it
    let snsTopic: sns.Topic = props.snsTopic ?? new sns.Topic(this, 'topic');
    if (props.snsTopic === undefined) {
      snsTopic.addSubscription(new subscriptions.EmailSubscription(props.letsencryptEmail));
    }

    let hostedZones:string[] = [];
    if (props.hostedZoneNames != undefined) {
      props.hostedZoneNames.forEach( (domainName) => {
        hostedZones.push(r53.HostedZone.fromLookup(this, 'zone' + domainName, {
          domainName,
          privateZone: false,
        }).hostedZoneArn);
      });
    }

    if (props.hostedZones != undefined) {
      props.hostedZones.forEach( (hostedZone) => {
        hostedZones.push(hostedZone.hostedZoneArn);
      });
    }

    const role = new iam.Role(this, 'role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    assignRequiredPoliciesToRole(this, {
      role,
      snsTopic,
      hostedZones,
    });

    const functionDir = path.join(__dirname, '../function/src');

    const bundlingCmds = [
      'mkdir -p /asset-output',
      'pip install -r /asset-input/requirements.txt -t /asset-output',
      'cp index.py /asset-output/index.py',
    ];

    // Create the Lambda function
    this.handler = new lambda.Function(this, 'handler', {
      runtime: lambda.Runtime.PYTHON_3_13,
      role,
      architecture: props.architecture || lambda.Architecture.X86_64,
      code: lambda.Code.fromAsset(functionDir, {
        bundling: {
          image: lambda.Runtime.PYTHON_3_13.bundlingImage,
          command: [
            'bash', '-c', bundlingCmds.join(' && '),
          ],
        },
      }),
      handler: 'index.handler',
      functionName: props.functionName,
      description: functionDescription,
      environment: {
        LETSENCRYPT_DOMAINS: props.letsencryptDomains,
        LETSENCRYPT_EMAIL: props.letsencryptEmail,
        OBJECT_PREFIX: props.objectPrefix || '',
        REISSUE_DAYS: (props.reIssueDays === undefined) ? '30' : String(props.reIssueDays),
        PREFERRED_CHAIN: props.preferredChain || 'None',
        KEY_TYPE: props.keyType || 'ecdsa',
        NOTIFICATION_SNS_ARN: snsTopic.topicArn,
        DRY_RUN: 'False',
      },
      layers,
      timeout: props.timeout || Duration.seconds(180),
      filesystem: props.efsAccessPoint ? lambda.FileSystem.fromEfsAccessPoint(props.efsAccessPoint, '/mnt/efs') : undefined,
      vpc: props.vpc,
    });

    let bucket: s3.Bucket;

    if (props.bucket === undefined && (props.certificateStorage == CertificateStorageType.S3 || props.certificateStorage == undefined)) {
      bucket = new s3.Bucket(this, 'bucket', {
        objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
        removalPolicy: props.removalPolicy || RemovalPolicy.RETAIN,
        autoDeleteObjects: props.enableObjectDeletion ?? false,
        versioned: true,
        lifecycleRules: [{
          enabled: true,
          abortIncompleteMultipartUploadAfter: Duration.days(1),
        }],
        encryption: s3.BucketEncryption.S3_MANAGED,
        enforceSSL: true,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      });

      bucket.grantReadWrite(this.handler);
      this.handler.addEnvironment('CERTIFICATE_BUCKET', bucket.bucketName);
      this.handler.addEnvironment('CERTIFICATE_STORAGE', 's3');
    }

    if (props.bucket && (props.certificateStorage == CertificateStorageType.S3 || props.certificateStorage == undefined)) {
      bucket = props.bucket;
      bucket.grantReadWrite(this.handler);
      this.handler.addEnvironment('CERTIFICATE_BUCKET', bucket.bucketName);
      this.handler.addEnvironment('CERTIFICATE_STORAGE', 's3');
    }

    if (props.certificateStorage == CertificateStorageType.SECRETS_MANAGER) {
      this.handler.addEnvironment('CERTIFICATE_STORAGE', 'secretsmanager');
      this.handler.addEnvironment('CERTIFICATE_SECRET_PATH', props.secretsManagerPath || `/certbot/certificates/${props.letsencryptDomains.split(',')[0]}/`);
      if (props.kmsKeyAlias) {
        this.handler.addEnvironment('CUSTOM_KMS_KEY_ID', props.kmsKeyAlias);
      }
      configureSecretsManagerStorage(this, {
        role,
        secretsManagerPath: props.secretsManagerPath || `/certbot/certificates/${props.letsencryptDomains.split(',')[0]}/`,
        kmsKeyAlias: props.kmsKeyAlias,
      });
    };

    if (props.certificateStorage == CertificateStorageType.SSM_SECURE) {
      this.handler.addEnvironment('CERTIFICATE_STORAGE', 'ssm_secure');
      this.handler.addEnvironment('CERTIFICATE_PARAMETER_PATH', props.ssmSecurePath || `/certbot/certificates/${props.letsencryptDomains.split(',')[0]}/`);
      if (props.kmsKeyAlias) {
        this.handler.addEnvironment('CUSTOM_KMS_KEY_ID', props.kmsKeyAlias);
      }
      configureSSMStorage(this, {
        role,
        parameterStorePath: props.ssmSecurePath || `/certbot/certificates/${props.letsencryptDomains.split(',')[0]}/`,
        kmsKeyAlias: props.kmsKeyAlias,
      });
    }

    if (props.certificateStorage == CertificateStorageType.EFS) {
      if (!props.efsAccessPoint) {
        throw new Error('You must provide an EFS Access Point to use EFS storage');
      } else {
        this.handler.addEnvironment('CERTIFICATE_STORAGE', 'efs');
        this.handler.addEnvironment('EFS_PATH', '/mnt/efs');
      }
    }

    if (props.vpc) {
      role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole'));
    }

    if (enableInsights) {
      role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLambdaInsightsExecutionRolePolicy'));
      this.handler.addLayers(lambda.LayerVersion.fromLayerVersionArn(this, 'insightsLayer', insightsARN));
    }

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
