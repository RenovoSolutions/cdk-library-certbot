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

##### `hostedZoneNames`<sup>Required</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.hostedZoneNames"></a>

```typescript
public readonly hostedZoneNames: string[];
```

- *Type:* `string`[]

Hosted zone names that will be required for DNS verification with certbot.

---

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

##### `enableInsights`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.enableInsights"></a>

```typescript
public readonly enableInsights: boolean;
```

- *Type:* `boolean`
- *Default:* false

Whether or not to enable Lambda Insights.

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

##### `insightsARN`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.insightsARN"></a>

```typescript
public readonly insightsARN: string;
```

- *Type:* `string`

Insights layer ARN for your region.

Defaults to layer for US-EAST-1

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

##### `snsTopic`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.snsTopic"></a>

```typescript
public readonly snsTopic: Topic;
```

- *Type:* [`aws-cdk-lib.aws_sns.Topic`](#aws-cdk-lib.aws_sns.Topic)

The SNS topic to notify when a new cert is issued.

If no topic is given one will be created automatically.

---

##### `timeout`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.CertbotProps.property.timeout"></a>

```typescript
public readonly timeout: Duration;
```

- *Type:* [`aws-cdk-lib.Duration`](#aws-cdk-lib.Duration)
- *Default:* Duraction.seconds(180)

The timeout duration for Lambda function.

---



