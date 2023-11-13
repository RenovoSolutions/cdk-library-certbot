import {
  aws_iam as iam,
  aws_sns as sns,
  Stack,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

interface RequiredPoliciesProps {
  /**
   * The role to assign policies to
   */
  readonly role: iam.Role;
  /**
   * The SNS topic to send notifications to
   */
  readonly snsTopic: sns.Topic;
  /**
   * The hostedZones that will be required for DNS verification with certbot
   */
  readonly hostedZones: string[];
};

export function assignRequiredPoliciesToRole(scope: Construct, props: RequiredPoliciesProps): void {
  props.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));

  props.role.addManagedPolicy(new iam.ManagedPolicy(scope, 'snsPolicy', {
    description: 'Allow the Certbot function to notify an SNS topic upon completion.',
    statements: [
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['sns:Publish'],
        resources: [props.snsTopic.topicArn],
      }),
    ],
  }));

  props.role.addManagedPolicy(new iam.ManagedPolicy(scope, 'r53Policy', {
    description: 'Allow the Certbot function to perform DNS verification.',
    statements: [
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['route53:ListHostedZones'],
        resources: ['*'],
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'route53:GetChange',
          'route53:ChangeResourceRecordSets',
        ],
        resources: ['arn:aws:route53:::change/*'].concat(props.hostedZones),
      }),
    ],
  }));

  props.role.addManagedPolicy(new iam.ManagedPolicy(scope, 'acmPolicy', {
    description: 'Allow the Certbot function to import and list certificates.',
    statements: [
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'acm:ListCertificates',
          'acm:ImportCertificate',
        ],
        resources: ['*'],
      }),
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['acm:DescribeCertificate'],
        resources: ['arn:aws:acm:' + Stack.of(scope).region + ':' + Stack.of(scope).account + ':certificate/*'],
      }),
    ],
  }));
};