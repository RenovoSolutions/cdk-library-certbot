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

This construct utilizes a Route 53 hosted zone lookup so it will require that your stack has [environment variables set for account and region](See https://docs.aws.amazon.com/cdk/latest/guide/environments.html for more details.).

### Typescript

```typescript
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
      ]
    })
  }
}
```

### Typescript with zone creation in the same stack

```typescript
import * as cdk from '@aws-cdk/core';
import * as route53 from '@aws-cdk/aws_route53';
import { Certbot } from '@renovosolutions/cdk-library-certbot';
import { Architecture } from '@aws-cdk/aws-lambda';

export class CdkExampleCertsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hostedZone = new r53.HostedZone(this, 'authZone', {
      zoneName: 'auth.example.com',
    });

    let domains = [
      'example.com',
      'www.example.com',
      'auth.example.com'
    ]

    new Certbot(this, 'cert', {
      letsencryptDomains: domains.join(','),
      letsencryptEmail: 'webmaster+letsencrypt@example.com',
      hostedZoneNames: [
        'example.com'
      ],
      hostedZones: [
        hostedZone,
      ]
    })
  }
}
```

## Python

```python
from aws_cdk import (
    core as cdk
)
from certbot import Certbot

class CdkExampleCertsStack(cdk.Stack):

    def __init__(self, scope: cdk.Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        Certbot(self, "certbot",
            letsencrypt_email="webmaster+letsencrypt@example.com",
            letsencrypt_domains="example.com",
            hosted_zone_names=["example.com"]
        )
```
