import * as cdk from '@aws-cdk/core';
import { Certbot } from '@renovosolutions/cdk-library-certbot';
import { Architecture } from '@aws-cdk/aws-lambda';

export class CdkExampleCertsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    let domains = [
      'example.com',
      'www.example.com'
    ]

    new Certbot(this, 'cert', {
      letsencryptDomains: domains.join(','),
      letsencryptEmail: 'webmaster+letsencrypt@example.com',
      hostedZoneNames: [
        'example.com'
      ],
      architecture: Architecture.ARM_64
    })
  }
}
