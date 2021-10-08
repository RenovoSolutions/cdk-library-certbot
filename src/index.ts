import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
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
  layers?: lambda.LayerVersion[];
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

    this.handler = new lambda.Function(this, 'handler', {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'main.handler',
      code: lambda.Code.fromAsset('lambda/'),
      environment: {
        LETSENCRYPT_DOMAINS: props.letsencryptDomains,
        LETSENCRYPT_EMAIL: props.letsencryptEmail,
        CERTIFICATE_BUCKET: props.bucket.bucketArn,
        OBJECT_PREFIX: (props.objectPrefix === undefined) ? '' : props.objectPrefix,
        REISSUE_DAYS: (props.reIssueDays === undefined) ? '30' : String(props.reIssueDays),
        PREFERRED_CHAIN: (props.preferredChain === undefined) ? 'None' : props.preferredChain,
      },
      layers: props.layers,
    });
  }
}
