# cdk-library-certbot

[![build](https://github.com/RenovoSolutions/cdk-library-certbot/actions/workflows/build.yml/badge.svg)](https://github.com/RenovoSolutions/cdk-library-certbotactions/workflows/build.yml)

A CDK Construct Library to automate the creation and renewal of Let's Encrypt certificates.

## Features
- Creates a lambda function that utilizes Certbot to request a certificate from Let's Encrypt
- Uploads the resulting certificate data to S3 for later retrieval
- Imports the certificate to AWS Certificate Manager for tracking expiration
- Creates a trigger to re-run and re-new if the cert will expire in the next 30 days (customizable)

## API Doc
See [API](API.md)

## References
Original [gist](# Modified from original gist https://gist.github.com/arkadiyt/5d764c32baa43fc486ca16cb8488169a) that was modified for the Lambda code

## Examples
### Typescript
```
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

```
