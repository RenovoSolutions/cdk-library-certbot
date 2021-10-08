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

##### `bucket`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.ICertbotProps.property.bucket"></a>

```typescript
public readonly bucket: Bucket;
```

- *Type:* [`@aws-cdk/aws-s3.Bucket`](#@aws-cdk/aws-s3.Bucket)

The S3 bucket to place the resulting certificates in.

If no bucket is given one will be created automatically.

---

##### `layers`<sup>Optional</sup> <a name="@renovosolutions/cdk-library-certbot.ICertbotProps.property.layers"></a>

```typescript
public readonly layers: LayerVersion[];
```

- *Type:* [`@aws-cdk/aws-lambda.LayerVersion`](#@aws-cdk/aws-lambda.LayerVersion)[]

Any additional Lambda layers to use with the created function.

For example Lambda Extensions

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

