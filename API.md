# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### Certbot <a name="@renovosolutions/cdk-library-certbot.Certbot"></a>

#### Initializers <a name="@renovosolutions/cdk-library-certbot.Certbot.Initializer"></a>

```typescript
import { Certbot } from '@renovosolutions/cdk-library-certbot'

new Certbot(scope: Construct, id: string, props: CertbotProps)
```

##### `scope`<sup>Required</sup> <a name="@renovosolutions/cdk-library-certbot.Certbot.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="@renovosolutions/cdk-library-certbot.Certbot.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="@renovosolutions/cdk-library-certbot.Certbot.parameter.props"></a>

- *Type:* [`@renovosolutions/cdk-library-certbot.CertbotProps`](#@renovosolutions/cdk-library-certbot.CertbotProps)

---



#### Properties <a name="Properties"></a>

##### `handler`<sup>Required</sup> <a name="@renovosolutions/cdk-library-certbot.Certbot.property.handler"></a>

```typescript
public readonly handler: Function;
```

- *Type:* [`aws-cdk-lib.aws_lambda.Function`](#aws-cdk-lib.aws_lambda.Function)

---


## Structs <a name="Structs"></a>

### CertbotProps <a name="@renovosolutions/cdk-library-certbot.CertbotProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { CertbotProps } from '@renovosolutions/cdk-library-certbot'

const certbotProps: CertbotProps = { ... }
```

##### `letsencryptDomains`<sup>Required</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.letsencryptDomains"></a>

```typescript
public readonly letsencryptDomains: string;
```

- *Type:* `string`

The comma delimited list of domains for which the Let's Encrypt certificate will be valid.

Primary domain should be first.

---

##### `letsencryptEmail`<sup>Required</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.letsencryptEmail"></a>

```typescript
public readonly letsencryptEmail: string;
```

- *Type:* `string`

The email to associate with the Let's Encrypt certificate request.

---

##### `bucket`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.bucket"></a>

```typescript
public readonly bucket: Bucket;
```

- *Type:* [`aws-cdk-lib.aws_s3.Bucket`](#aws-cdk-lib.aws_s3.Bucket)

The S3 bucket to place the resulting certificates in.

If no bucket is given one will be created automatically.

---

##### `certificateStorage`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.certificateStorage"></a>

```typescript
public readonly certificateStorage: CertificateStorageType;
```

- *Type:* [`@renovosolutions/cdk-library-certbot.CertificateStorageType`](#@renovosolutions/cdk-library-certbot.CertificateStorageType)
- *Default:* CertificateStorageType.S3

The method of storage for the resulting certificates.

---

##### `efsAccessPoint`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.efsAccessPoint"></a>

```typescript
public readonly efsAccessPoint: AccessPoint;
```

- *Type:* [`aws-cdk-lib.aws_efs.AccessPoint`](#aws-cdk-lib.aws_efs.AccessPoint)

The EFS access point to store the certificates.

---

##### `enableInsights`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.enableInsights"></a>

```typescript
public readonly enableInsights: boolean;
```

- *Type:* `boolean`
- *Default:* false

Whether or not to enable Lambda Insights.

---

##### `enableObjectDeletion`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.enableObjectDeletion"></a>

```typescript
public readonly enableObjectDeletion: boolean;
```

- *Type:* `boolean`
- *Default:* false

Whether or not to enable automatic object deletion if the provided bucket is deleted.

Has no effect if a bucket is given as a property

---

##### `functionDescription`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.functionDescription"></a>

```typescript
public readonly functionDescription: string;
```

- *Type:* `string`

The description for the resulting Lambda function.

---

##### `functionName`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.functionName"></a>

```typescript
public readonly functionName: string;
```

- *Type:* `string`

The name of the resulting Lambda function.

---

##### `hostedZoneNames`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.hostedZoneNames"></a>

```typescript
public readonly hostedZoneNames: string[];
```

- *Type:* `string`[]

Hosted zone names that will be required for DNS verification with certbot.

---

##### `hostedZones`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.hostedZones"></a>

```typescript
public readonly hostedZones: IHostedZone[];
```

- *Type:* [`aws-cdk-lib.aws_route53.IHostedZone`](#aws-cdk-lib.aws_route53.IHostedZone)[]

The hosted zones that will be required for DNS verification with certbot.

---

##### `insightsARN`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.insightsARN"></a>

```typescript
public readonly insightsARN: string;
```

- *Type:* `string`

Insights layer ARN for your region.

Defaults to layer for US-EAST-1

---

##### `keyType`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.keyType"></a>

```typescript
public readonly keyType: string;
```

- *Type:* `string`
- *Default:* 'ecdsa'

Set the key type for the certificate.

---

##### `kmsKeyAlias`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.kmsKeyAlias"></a>

```typescript
public readonly kmsKeyAlias: string;
```

- *Type:* `string`
- *Default:* AWS managed key

The KMS key to use for encryption of the certificates in Secrets Manager or Systems Manager Parameter Store.

---

##### `layers`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.layers"></a>

```typescript
public readonly layers: ILayerVersion[];
```

- *Type:* [`aws-cdk-lib.aws_lambda.ILayerVersion`](#aws-cdk-lib.aws_lambda.ILayerVersion)[]

Any additional Lambda layers to use with the created function.

For example Lambda Extensions

---

##### `objectPrefix`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.objectPrefix"></a>

```typescript
public readonly objectPrefix: string;
```

- *Type:* `string`

The prefix to apply to the final S3 key name for the certificates.

Default is no prefix.
Also used for EFS.

---

##### `preferredChain`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.preferredChain"></a>

```typescript
public readonly preferredChain: string;
```

- *Type:* `string`
- *Default:* 'None'

Set the preferred certificate chain.

---

##### `reIssueDays`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.reIssueDays"></a>

```typescript
public readonly reIssueDays: number;
```

- *Type:* `number`
- *Default:* 30

The numbers of days left until the prior cert expires before issuing a new one.

---

##### `removalPolicy`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.removalPolicy"></a>

```typescript
public readonly removalPolicy: RemovalPolicy;
```

- *Type:* [`aws-cdk-lib.RemovalPolicy`](#aws-cdk-lib.RemovalPolicy)
- *Default:* RemovalPolicy.RETAIN

The removal policy for the S3 bucket that is automatically created.

Has no effect if a bucket is given as a property

---

##### `runOnDeploy`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.runOnDeploy"></a>

```typescript
public readonly runOnDeploy: boolean;
```

- *Type:* `boolean`
- *Default:* true

Whether or not to schedule a trigger to run the function after each deployment.

---

##### `runOnDeployWaitMinutes`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.runOnDeployWaitMinutes"></a>

```typescript
public readonly runOnDeployWaitMinutes: number;
```

- *Type:* `number`
- *Default:* 10

How many minutes to wait before running the post deployment Lambda trigger.

---

##### `schedule`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.schedule"></a>

```typescript
public readonly schedule: Schedule;
```

- *Type:* [`aws-cdk-lib.aws_events.Schedule`](#aws-cdk-lib.aws_events.Schedule)
- *Default:* events.Schedule.cron({ minute: '0', hour: '0', weekDay: '1' })

The schedule for the certificate check trigger.

---

##### `secretsManagerPath`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.secretsManagerPath"></a>

```typescript
public readonly secretsManagerPath: string;
```

- *Type:* `string`
- *Default:* `/certbot/certificates/${letsencryptDomains.split(',')[0]}/`

The path to store the certificates in AWS Secrets Manager.

---

##### `snsTopic`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.snsTopic"></a>

```typescript
public readonly snsTopic: Topic;
```

- *Type:* [`aws-cdk-lib.aws_sns.Topic`](#aws-cdk-lib.aws_sns.Topic)

The SNS topic to notify when a new cert is issued.

If no topic is given one will be created automatically.

---

##### `ssmSecurePath`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.ssmSecurePath"></a>

```typescript
public readonly ssmSecurePath: string;
```

- *Type:* `string`
- *Default:* `/certbot/certificates/${letsencryptDomains.split(',')[0]}/`

The path to store the certificates in AWS Systems Manager Parameter Store.

---

##### `timeout`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.timeout"></a>

```typescript
public readonly timeout: Duration;
```

- *Type:* [`aws-cdk-lib.Duration`](#aws-cdk-lib.Duration)
- *Default:* Duraction.seconds(180)

The timeout duration for Lambda function.

---

##### `vpc`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* [`aws-cdk-lib.aws_ec2.IVpc`](#aws-cdk-lib.aws_ec2.IVpc)
- *Default:* none

The VPC to run the Lambda function in.

This is needed if you are using EFS.
It should be the same VPC as the EFS filesystem

---



## Enums <a name="Enums"></a>

### CertificateStorageType <a name="CertificateStorageType"></a>

#### `SECRETS_MANAGER` <a name="@renovosolutions/cdk-library-certbot.CertificateStorageType.SECRETS_MANAGER"></a>

Store the certificate in AWS Secrets Manager.

---


#### `S3` <a name="@renovosolutions/cdk-library-certbot.CertificateStorageType.S3"></a>

Store the certificates in S3.

---


#### `SSM_SECURE` <a name="@renovosolutions/cdk-library-certbot.CertificateStorageType.SSM_SECURE"></a>

Store the certificates as a parameter in AWS Systems Manager Parameter Store  with encryption.

---


#### `EFS` <a name="@renovosolutions/cdk-library-certbot.CertificateStorageType.EFS"></a>

Store the certificates in EFS, mounted to the Lambda function.

---

