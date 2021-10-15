# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### Certbot <a name="@renovosolutions/cdk-library-certbot.Certbot"></a>

#### Initializers <a name="@renovosolutions/cdk-library-certbot.Certbot.Initializer"></a>

```typescript
import { Certbot } from '@renovosolutions/cdk-library-certbot'

new Certbot(scope: Construct, id: string, props: ICertbotProps)
```

##### `scope`<sup>Required</sup> <a name="@renovosolutions/cdk-library-certbot.Certbot.parameter.scope"></a>

- *Type:* [`@aws-cdk/core.Construct`](#@aws-cdk/core.Construct)

---

##### `id`<sup>Required</sup> <a name="@renovosolutions/cdk-library-certbot.Certbot.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="@renovosolutions/cdk-library-certbot.Certbot.parameter.props"></a>

- *Type:* [`@renovosolutions/cdk-library-certbot.ICertbotProps`](#@renovosolutions/cdk-library-certbot.ICertbotProps)

---



#### Properties <a name="Properties"></a>

##### `handler`<sup>Required</sup> <a name="@renovosolutions/cdk-library-certbot.Certbot.property.handler"></a>

```typescript
public readonly handler: Function;
```

- *Type:* [`@aws-cdk/aws-lambda.Function`](#@aws-cdk/aws-lambda.Function)

---




## Protocols <a name="Protocols"></a>

### ICertbotProps <a name="@renovosolutions/cdk-library-certbot.ICertbotProps"></a>

- *Implemented By:* [`@renovosolutions/cdk-library-certbot.ICertbotProps`](#@renovosolutions/cdk-library-certbot.ICertbotProps)


#### Properties <a name="Properties"></a>

##### `hostedZoneNames`<sup>Required</sup> <a name="@renovosolutions/cdk-library-certbot.ICertbotProps.property.hostedZoneNames"></a>

```typescript
public readonly hostedZoneNames: string[];
```

- *Type:* `string`[]

Any additional Lambda layers to use with the created function.

For example Lambda Extensions

---

##### `letsencryptDomains`<sup>Required</sup> <a name="@renovosolutions/cdk-library-certbot.ICertbotProps.property.letsencryptDomains"></a>

```typescript
public readonly letsencryptDomains: string;
```

- *Type:* `string`

The comma delimited list of domains for which the Let's Encrypt certificate will be valid.

Primary domain should be first.

---

##### `letsencryptEmail`<sup>Required</sup> <a name="@renovosolutions/cdk-library-certbot.ICertbotProps.property.letsencryptEmail"></a>

```typescript
public readonly letsencryptEmail: string;
```

- *Type:* `string`

The email to associate with the Let's Encrypt certificate request.

---

##### `architecture`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.ICertbotProps.property.architecture"></a>

```typescript
public readonly architecture: Architecture;
```

- *Type:* [`@aws-cdk/aws-lambda.Architecture`](#@aws-cdk/aws-lambda.Architecture)

The architecture that Lambda will run on.

---

##### `bucket`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.ICertbotProps.property.bucket"></a>

```typescript
public readonly bucket: Bucket;
```

- *Type:* [`@aws-cdk/aws-s3.Bucket`](#@aws-cdk/aws-s3.Bucket)

The S3 bucket to place the resulting certificates in.

If no bucket is given one will be created automatically.

---

##### `enableInsights`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.ICertbotProps.property.enableInsights"></a>

```typescript
public readonly enableInsights: boolean;
```

- *Type:* `boolean`

Whether or not to enable Lambda Insights.

---

##### `insightsARN`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.ICertbotProps.property.insightsARN"></a>

```typescript
public readonly insightsARN: string;
```

- *Type:* `string`

Insights layer ARN for your region.

Defaults to US-EAST-1

---

##### `layers`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.ICertbotProps.property.layers"></a>

```typescript
public readonly layers: ILayerVersion[];
```

- *Type:* [`@aws-cdk/aws-lambda.ILayerVersion`](#@aws-cdk/aws-lambda.ILayerVersion)[]

Hosted zone names that will be required for DNS verification with certbot.

---

##### `objectPrefix`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.ICertbotProps.property.objectPrefix"></a>

```typescript
public readonly objectPrefix: string;
```

- *Type:* `string`

The prefix to apply to the final S3 key name for the certificates.

Default is no prefix.

---

##### `preferredChain`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.ICertbotProps.property.preferredChain"></a>

```typescript
public readonly preferredChain: string;
```

- *Type:* `string`

Set the preferred certificate chain.

Default None.

---

##### `reIssueDays`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.ICertbotProps.property.reIssueDays"></a>

```typescript
public readonly reIssueDays: number;
```

- *Type:* `number`

The numbers of days left until the prior cert expires before issuing a new one.

Default is 30 days

---

##### `snsTopic`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.ICertbotProps.property.snsTopic"></a>

```typescript
public readonly snsTopic: Topic;
```

- *Type:* [`@aws-cdk/aws-sns.Topic`](#@aws-cdk/aws-sns.Topic)

The SNS topic to notify when a new cert is issued.

---

##### `timeout`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.ICertbotProps.property.timeout"></a>

```typescript
public readonly timeout: Duration;
```

- *Type:* [`@aws-cdk/core.Duration`](#@aws-cdk/core.Duration)

The timeout duration for Lambda function.

---

