# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### Certbot <a name="Certbot" id="@renovosolutions/cdk-library-certbot.Certbot"></a>

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-certbot.Certbot.Initializer"></a>

```typescript
import { Certbot } from '@renovosolutions/cdk-library-certbot'

new Certbot(scope: Construct, id: string, props: CertbotProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-certbot.Certbot.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-certbot.Certbot.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-certbot.Certbot.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps">CertbotProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-certbot.Certbot.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-certbot.Certbot.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-certbot.Certbot.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-certbot.CertbotProps">CertbotProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-certbot.Certbot.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-certbot.Certbot.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-certbot.Certbot.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-certbot.Certbot.isConstruct"></a>

```typescript
import { Certbot } from '@renovosolutions/cdk-library-certbot'

Certbot.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-certbot.Certbot.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-certbot.Certbot.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-certbot.Certbot.property.handler">handler</a></code> | <code>aws-cdk-lib.aws_lambda.Function</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-certbot.Certbot.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `handler`<sup>Required</sup> <a name="handler" id="@renovosolutions/cdk-library-certbot.Certbot.property.handler"></a>

```typescript
public readonly handler: Function;
```

- *Type:* aws-cdk-lib.aws_lambda.Function

---


## Structs <a name="Structs" id="Structs"></a>

### CertbotProps <a name="CertbotProps" id="@renovosolutions/cdk-library-certbot.CertbotProps"></a>

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-certbot.CertbotProps.Initializer"></a>

```typescript
import { CertbotProps } from '@renovosolutions/cdk-library-certbot'

const certbotProps: CertbotProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.letsencryptDomains">letsencryptDomains</a></code> | <code>string</code> | The comma delimited list of domains for which the Let's Encrypt certificate will be valid. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.letsencryptEmail">letsencryptEmail</a></code> | <code>string</code> | The email to associate with the Let's Encrypt certificate request. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.architecture">architecture</a></code> | <code>aws-cdk-lib.aws_lambda.Architecture</code> | The architecture for the Lambda function. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.bucket">bucket</a></code> | <code>aws-cdk-lib.aws_s3.Bucket</code> | The S3 bucket to place the resulting certificates in. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.certificateStorage">certificateStorage</a></code> | <code><a href="#@renovosolutions/cdk-library-certbot.CertificateStorageType">CertificateStorageType</a></code> | The method of storage for the resulting certificates. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.efsAccessPoint">efsAccessPoint</a></code> | <code>aws-cdk-lib.aws_efs.AccessPoint</code> | The EFS access point to store the certificates. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.enableInsights">enableInsights</a></code> | <code>boolean</code> | Whether or not to enable Lambda Insights. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.enableObjectDeletion">enableObjectDeletion</a></code> | <code>boolean</code> | Whether or not to enable automatic object deletion if the provided bucket is deleted. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.functionDescription">functionDescription</a></code> | <code>string</code> | The description for the resulting Lambda function. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.functionName">functionName</a></code> | <code>string</code> | The name of the resulting Lambda function. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.hostedZoneNames">hostedZoneNames</a></code> | <code>string[]</code> | Hosted zone names that will be required for DNS verification with certbot. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.hostedZones">hostedZones</a></code> | <code>aws-cdk-lib.aws_route53.IHostedZone[]</code> | The hosted zones that will be required for DNS verification with certbot. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.insightsARN">insightsARN</a></code> | <code>string</code> | Insights layer ARN for your region. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.keyType">keyType</a></code> | <code>string</code> | Set the key type for the certificate. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.kmsKeyAlias">kmsKeyAlias</a></code> | <code>string</code> | The KMS key to use for encryption of the certificates in Secrets Manager or Systems Manager Parameter Store. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.layers">layers</a></code> | <code>aws-cdk-lib.aws_lambda.ILayerVersion[]</code> | Any additional Lambda layers to use with the created function. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.objectPrefix">objectPrefix</a></code> | <code>string</code> | The prefix to apply to the final S3 key name for the certificates. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.preferredChain">preferredChain</a></code> | <code>string</code> | Set the preferred certificate chain. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.reIssueDays">reIssueDays</a></code> | <code>number</code> | The numbers of days left until the prior cert expires before issuing a new one. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.removalPolicy">removalPolicy</a></code> | <code>aws-cdk-lib.RemovalPolicy</code> | The removal policy for the S3 bucket that is automatically created. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.runOnDeploy">runOnDeploy</a></code> | <code>boolean</code> | Whether or not to schedule a trigger to run the function after each deployment. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.runOnDeployWaitMinutes">runOnDeployWaitMinutes</a></code> | <code>number</code> | How many minutes to wait before running the post deployment Lambda trigger. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.schedule">schedule</a></code> | <code>aws-cdk-lib.aws_events.Schedule</code> | The schedule for the certificate check trigger. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.secretsManagerPath">secretsManagerPath</a></code> | <code>string</code> | The path to store the certificates in AWS Secrets Manager. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.snsTopic">snsTopic</a></code> | <code>aws-cdk-lib.aws_sns.Topic</code> | The SNS topic to notify when a new cert is issued. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.ssmSecurePath">ssmSecurePath</a></code> | <code>string</code> | The path to store the certificates in AWS Systems Manager Parameter Store. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.timeout">timeout</a></code> | <code>aws-cdk-lib.Duration</code> | The timeout duration for Lambda function. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertbotProps.property.vpc">vpc</a></code> | <code>aws-cdk-lib.aws_ec2.IVpc</code> | The VPC to run the Lambda function in. |

---

##### `letsencryptDomains`<sup>Required</sup> <a name="letsencryptDomains" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.letsencryptDomains"></a>

```typescript
public readonly letsencryptDomains: string;
```

- *Type:* string

The comma delimited list of domains for which the Let's Encrypt certificate will be valid.

Primary domain should be first.

---

##### `letsencryptEmail`<sup>Required</sup> <a name="letsencryptEmail" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.letsencryptEmail"></a>

```typescript
public readonly letsencryptEmail: string;
```

- *Type:* string

The email to associate with the Let's Encrypt certificate request.

---

##### `architecture`<sup>Optional</sup> <a name="architecture" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.architecture"></a>

```typescript
public readonly architecture: Architecture;
```

- *Type:* aws-cdk-lib.aws_lambda.Architecture
- *Default:* lambda.Architecture.X86_64

The architecture for the Lambda function.

This property allows you to specify the architecture type for your Lambda function.
Supported values are 'x86_64' for the standard architecture and 'arm64' for the
ARM architecture.

---

##### `bucket`<sup>Optional</sup> <a name="bucket" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.bucket"></a>

```typescript
public readonly bucket: Bucket;
```

- *Type:* aws-cdk-lib.aws_s3.Bucket

The S3 bucket to place the resulting certificates in.

If no bucket is given one will be created automatically.

---

##### `certificateStorage`<sup>Optional</sup> <a name="certificateStorage" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.certificateStorage"></a>

```typescript
public readonly certificateStorage: CertificateStorageType;
```

- *Type:* <a href="#@renovosolutions/cdk-library-certbot.CertificateStorageType">CertificateStorageType</a>
- *Default:* CertificateStorageType.S3

The method of storage for the resulting certificates.

---

##### `efsAccessPoint`<sup>Optional</sup> <a name="efsAccessPoint" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.efsAccessPoint"></a>

```typescript
public readonly efsAccessPoint: AccessPoint;
```

- *Type:* aws-cdk-lib.aws_efs.AccessPoint

The EFS access point to store the certificates.

---

##### `enableInsights`<sup>Optional</sup> <a name="enableInsights" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.enableInsights"></a>

```typescript
public readonly enableInsights: boolean;
```

- *Type:* boolean
- *Default:* false

Whether or not to enable Lambda Insights.

---

##### `enableObjectDeletion`<sup>Optional</sup> <a name="enableObjectDeletion" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.enableObjectDeletion"></a>

```typescript
public readonly enableObjectDeletion: boolean;
```

- *Type:* boolean
- *Default:* false

Whether or not to enable automatic object deletion if the provided bucket is deleted.

Has no effect if a bucket is given as a property

---

##### `functionDescription`<sup>Optional</sup> <a name="functionDescription" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.functionDescription"></a>

```typescript
public readonly functionDescription: string;
```

- *Type:* string

The description for the resulting Lambda function.

---

##### `functionName`<sup>Optional</sup> <a name="functionName" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.functionName"></a>

```typescript
public readonly functionName: string;
```

- *Type:* string

The name of the resulting Lambda function.

---

##### `hostedZoneNames`<sup>Optional</sup> <a name="hostedZoneNames" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.hostedZoneNames"></a>

```typescript
public readonly hostedZoneNames: string[];
```

- *Type:* string[]

Hosted zone names that will be required for DNS verification with certbot.

---

##### `hostedZones`<sup>Optional</sup> <a name="hostedZones" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.hostedZones"></a>

```typescript
public readonly hostedZones: IHostedZone[];
```

- *Type:* aws-cdk-lib.aws_route53.IHostedZone[]

The hosted zones that will be required for DNS verification with certbot.

---

##### `insightsARN`<sup>Optional</sup> <a name="insightsARN" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.insightsARN"></a>

```typescript
public readonly insightsARN: string;
```

- *Type:* string

Insights layer ARN for your region.

Defaults to layer for US-EAST-1

---

##### `keyType`<sup>Optional</sup> <a name="keyType" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.keyType"></a>

```typescript
public readonly keyType: string;
```

- *Type:* string
- *Default:* 'ecdsa'

Set the key type for the certificate.

---

##### `kmsKeyAlias`<sup>Optional</sup> <a name="kmsKeyAlias" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.kmsKeyAlias"></a>

```typescript
public readonly kmsKeyAlias: string;
```

- *Type:* string
- *Default:* AWS managed key

The KMS key to use for encryption of the certificates in Secrets Manager or Systems Manager Parameter Store.

---

##### `layers`<sup>Optional</sup> <a name="layers" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.layers"></a>

```typescript
public readonly layers: ILayerVersion[];
```

- *Type:* aws-cdk-lib.aws_lambda.ILayerVersion[]

Any additional Lambda layers to use with the created function.

For example Lambda Extensions

---

##### `objectPrefix`<sup>Optional</sup> <a name="objectPrefix" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.objectPrefix"></a>

```typescript
public readonly objectPrefix: string;
```

- *Type:* string

The prefix to apply to the final S3 key name for the certificates.

Default is no prefix.
Also used for EFS.

---

##### `preferredChain`<sup>Optional</sup> <a name="preferredChain" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.preferredChain"></a>

```typescript
public readonly preferredChain: string;
```

- *Type:* string
- *Default:* 'None'

Set the preferred certificate chain.

---

##### `reIssueDays`<sup>Optional</sup> <a name="reIssueDays" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.reIssueDays"></a>

```typescript
public readonly reIssueDays: number;
```

- *Type:* number
- *Default:* 30

The numbers of days left until the prior cert expires before issuing a new one.

---

##### `removalPolicy`<sup>Optional</sup> <a name="removalPolicy" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.removalPolicy"></a>

```typescript
public readonly removalPolicy: RemovalPolicy;
```

- *Type:* aws-cdk-lib.RemovalPolicy
- *Default:* RemovalPolicy.RETAIN

The removal policy for the S3 bucket that is automatically created.

Has no effect if a bucket is given as a property

---

##### `runOnDeploy`<sup>Optional</sup> <a name="runOnDeploy" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.runOnDeploy"></a>

```typescript
public readonly runOnDeploy: boolean;
```

- *Type:* boolean
- *Default:* true

Whether or not to schedule a trigger to run the function after each deployment.

---

##### `runOnDeployWaitMinutes`<sup>Optional</sup> <a name="runOnDeployWaitMinutes" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.runOnDeployWaitMinutes"></a>

```typescript
public readonly runOnDeployWaitMinutes: number;
```

- *Type:* number
- *Default:* 10

How many minutes to wait before running the post deployment Lambda trigger.

---

##### `schedule`<sup>Optional</sup> <a name="schedule" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.schedule"></a>

```typescript
public readonly schedule: Schedule;
```

- *Type:* aws-cdk-lib.aws_events.Schedule
- *Default:* events.Schedule.cron({ minute: '0', hour: '0', weekDay: '1' })

The schedule for the certificate check trigger.

---

##### `secretsManagerPath`<sup>Optional</sup> <a name="secretsManagerPath" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.secretsManagerPath"></a>

```typescript
public readonly secretsManagerPath: string;
```

- *Type:* string
- *Default:* `/certbot/certificates/${letsencryptDomains.split(',')[0]}/`

The path to store the certificates in AWS Secrets Manager.

---

##### `snsTopic`<sup>Optional</sup> <a name="snsTopic" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.snsTopic"></a>

```typescript
public readonly snsTopic: Topic;
```

- *Type:* aws-cdk-lib.aws_sns.Topic

The SNS topic to notify when a new cert is issued.

If no topic is given one will be created automatically.

---

##### `ssmSecurePath`<sup>Optional</sup> <a name="ssmSecurePath" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.ssmSecurePath"></a>

```typescript
public readonly ssmSecurePath: string;
```

- *Type:* string
- *Default:* `/certbot/certificates/${letsencryptDomains.split(',')[0]}/`

The path to store the certificates in AWS Systems Manager Parameter Store.

---

##### `timeout`<sup>Optional</sup> <a name="timeout" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.timeout"></a>

```typescript
public readonly timeout: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duraction.seconds(180)

The timeout duration for Lambda function.

---

##### `vpc`<sup>Optional</sup> <a name="vpc" id="@renovosolutions/cdk-library-certbot.CertbotProps.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* aws-cdk-lib.aws_ec2.IVpc
- *Default:* none

The VPC to run the Lambda function in.

This is needed if you are using EFS.
It should be the same VPC as the EFS filesystem

---



## Enums <a name="Enums" id="Enums"></a>

### CertificateStorageType <a name="CertificateStorageType" id="@renovosolutions/cdk-library-certbot.CertificateStorageType"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertificateStorageType.SECRETS_MANAGER">SECRETS_MANAGER</a></code> | Store the certificate in AWS Secrets Manager. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertificateStorageType.S3">S3</a></code> | Store the certificates in S3. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertificateStorageType.SSM_SECURE">SSM_SECURE</a></code> | Store the certificates as a parameter in AWS Systems Manager Parameter Store  with encryption. |
| <code><a href="#@renovosolutions/cdk-library-certbot.CertificateStorageType.EFS">EFS</a></code> | Store the certificates in EFS, mounted to the Lambda function. |

---

##### `SECRETS_MANAGER` <a name="SECRETS_MANAGER" id="@renovosolutions/cdk-library-certbot.CertificateStorageType.SECRETS_MANAGER"></a>

Store the certificate in AWS Secrets Manager.

---


##### `S3` <a name="S3" id="@renovosolutions/cdk-library-certbot.CertificateStorageType.S3"></a>

Store the certificates in S3.

---


##### `SSM_SECURE` <a name="SSM_SECURE" id="@renovosolutions/cdk-library-certbot.CertificateStorageType.SSM_SECURE"></a>

Store the certificates as a parameter in AWS Systems Manager Parameter Store  with encryption.

---


##### `EFS` <a name="EFS" id="@renovosolutions/cdk-library-certbot.CertificateStorageType.EFS"></a>

Store the certificates in EFS, mounted to the Lambda function.

---

