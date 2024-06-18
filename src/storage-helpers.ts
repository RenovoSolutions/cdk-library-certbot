import {
  aws_iam as iam,
  aws_kms as kms,
  Stack,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

interface SecretsManagerStorageProps {
  /**
   * The role to attach the Secrets Manager policy to
   */
  readonly role: iam.Role;
  /**
   * The path to store the certificates in AWS Secrets Manager
   */
  readonly secretsManagerPath: string;
  /**
   * The KMS key alias to use for encryption of the certificates in Secrets Manager
   *
   * @default `alias/aws/secretsmanager`
   */
  readonly kmsKeyAlias?: string;
};

export function configureSecretsManagerStorage(scope: Construct, props: SecretsManagerStorageProps): void {
  const keyAlias = props.kmsKeyAlias || 'alias/aws/secretsmanager';
  const keyArn = kms.Alias.fromAliasName(scope, 'kmsKeyAlias', keyAlias).keyArn;
  props.role.addManagedPolicy(new iam.ManagedPolicy(scope, 'secretsManagerPolicy', {
    statements: [
      new iam.PolicyStatement({
        actions: [
          'secretsmanager:CreateSecret',
          'secretsmanager:DeleteSecret',
          'secretsmanager:DescribeSecret',
          'secretsmanager:GetSecretValue',
          'secretsmanager:ListSecrets',
          'secretsmanager:PutSecretValue',
          'secretsmanager:UpdateSecret',
        ],
        resources: [
          `arn:aws:secretsmanager:${Stack.of(scope).region}:${Stack.of(scope).account}:secret:${props.secretsManagerPath}*`,
        ],
      }),
      new iam.PolicyStatement({
        actions: [
          'kms:Decrypt',
          'kms:Encrypt',
        ],
        resources: [
          keyArn,
        ],
      }),
    ],
  }));
}

interface SsmStorageProps {
  /**
   * The role to attach the Secrets Manager policy to
   */
  readonly role: iam.Role;
  /**
   * The path to store the certificates in Parameter Store
   */
  readonly parameterStorePath: string;
  /**
   * The KMS key alias to use for encryption of the certificates in Secrets Manager
   *
   * @default `alias/aws/secretsmanager`
   */
  readonly kmsKeyAlias?: string;
};

export function configureSSMStorage(scope: Construct, props: SsmStorageProps): void {
  const keyAlias = props.kmsKeyAlias || 'alias/aws/ssm';
  const keyArn = kms.Alias.fromAliasName(scope, 'kmsKeyAlias', keyAlias).keyArn;
  props.role.addManagedPolicy(new iam.ManagedPolicy(scope, 'ssmPolicy', {
    statements: [
      new iam.PolicyStatement({
        actions: [
          'ssm:PutParameter',
        ],
        resources: [
          `arn:aws:ssm:${Stack.of(scope).region}:${Stack.of(scope).account}:parameter${props.parameterStorePath}*`,
        ],
      }),
      new iam.PolicyStatement({
        actions: [
          'kms:Decrypt',
          'kms:Encrypt',
        ],
        resources: [
          keyArn,
        ],
      }),
    ],
  }));
}