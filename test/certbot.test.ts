import { jest } from '@jest/globals';
import {
  aws_s3 as s3,
  aws_kms as kms,
  App,
  Stack,
  aws_route53 as route53,
} from 'aws-cdk-lib';
import {
  Template,
  Match,
} from 'aws-cdk-lib/assertions';
import {
  Certbot,
  CertificateStorageType,
} from '../src/index';

jest.setSystemTime(new Date('2021-01-15'));

test('Snapshot', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const zone = new route53.HostedZone(stack, 'Zone', {
    zoneName: 'auth.test.local',
  });

  const kmsKey = new kms.Key(stack, 'KmsKey', {});
  const kmsKeyAlias = new kms.Alias(stack, 'KmsKeyAlias', {
    aliasName: 'alias/test',
    targetKey: kmsKey,
  });

  new Certbot(stack, 'Certbot', {
    letsencryptDomains: 'test.local, www.test.local',
    letsencryptEmail: 'test@test.local',
    hostedZoneNames: ['example.com'],
    hostedZones: [zone],
  });

  new Certbot(stack, 'Certbot2', {
    letsencryptDomains: 'test2.local, www.test2.local',
    letsencryptEmail: 'test@test2.local',
    hostedZoneNames: ['example.com'],
    hostedZones: [zone],
  });

  new Certbot(stack, 'Certbot3', {
    letsencryptDomains: 'test3.local, www.test3.local',
    letsencryptEmail: 'test@test3.local',
    hostedZoneNames: ['example.com'],
    hostedZones: [zone],
    certificateStorage: CertificateStorageType.SECRETS_MANAGER,
  });

  new Certbot(stack, 'Certbot4', {
    letsencryptDomains: 'test4.local, www.test4.local',
    letsencryptEmail: 'test@test4.local',
    hostedZoneNames: ['example.com'],
    hostedZones: [zone],
    certificateStorage: CertificateStorageType.SECRETS_MANAGER,
    kmsKeyAlias: kmsKeyAlias.aliasName,
  });

  new Certbot(stack, 'Certbot5', {
    letsencryptDomains: 'test5.local, www.test5.local',
    letsencryptEmail: 'test@test5.local',
    hostedZoneNames: ['example.com'],
    hostedZones: [zone],
    certificateStorage: CertificateStorageType.SSM_SECURE,
  });

  new Certbot(stack, 'Certbot6', {
    letsencryptDomains: 'test6.local, www.test6.local',
    letsencryptEmail: 'test@test6.local',
    hostedZoneNames: ['example.com'],
    hostedZones: [zone],
    certificateStorage: CertificateStorageType.SSM_SECURE,
    kmsKeyAlias: kmsKeyAlias.aliasName,
  });

  const template = Template.fromStack(stack);

  const s = template.findResources('AWS::Lambda::Function', {
    Properties: {
      Handler: 'index.handler',
    },
  });

  const keys = Object.keys(s);

  expect(keys.length).toBe(6);

  const json = template.toJSON();

  for (const key of keys) {
    json.Resources[key].Properties.Code.S3Key = 'REMOVED-BECAUSE-WE-ARE-NOT-INTERESTED-IN-LAMBDA-CODE-HASH-IN-THIS-TEST';
  }

  expect(json).toMatchSnapshot();
});

test('stack should contain specific number of expected resources when s3 is used', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const zone = new route53.HostedZone(stack, 'Zone', {
    zoneName: 'auth.test.local',
  });

  new Certbot(stack, 'Certbot', {
    letsencryptDomains: 'test.local,auth.test.local',
    letsencryptEmail: 'test@test.local',
    hostedZoneNames: ['test.local'],
    hostedZones: [zone],
    certificateStorage: CertificateStorageType.S3,
  });

  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::Lambda::Function', 1);
  template.resourceCountIs('AWS::Events::Rule', 2); // one for ongoing checks and one for immediate creation
  template.resourceCountIs('AWS::S3::Bucket', 1);
  template.resourceCountIs('AWS::IAM::ManagedPolicy', 3); // acm, sns, and r53
  template.resourceCountIs('AWS::IAM::Policy', 1); // 1 inline policy for granting bucket write
  template.resourceCountIs('AWS::IAM::Role', 1);
  template.resourceCountIs('AWS::SNS::Topic', 1);
  template.resourceCountIs('AWS::SNS::Subscription', 1);
  template.resourceCountIs('AWS::Route53::HostedZone', 1);
});

test('stack should contain specific number of expected resources when no storage type is specified', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const zone = new route53.HostedZone(stack, 'Zone', {
    zoneName: 'auth.test.local',
  });

  new Certbot(stack, 'Certbot', {
    letsencryptDomains: 'test.local,auth.test.local',
    letsencryptEmail: 'test@test.local',
    hostedZoneNames: ['test.local'],
    hostedZones: [zone],
    certificateStorage: CertificateStorageType.S3,
  });

  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::Lambda::Function', 1);
  template.resourceCountIs('AWS::Events::Rule', 2); // one for ongoing checks and one for immediate creation
  template.resourceCountIs('AWS::S3::Bucket', 1);
  template.resourceCountIs('AWS::IAM::ManagedPolicy', 3); // acm, sns, and r53
  template.resourceCountIs('AWS::IAM::Policy', 1); // 1 inline policy for granting bucket write
  template.resourceCountIs('AWS::IAM::Role', 1);
  template.resourceCountIs('AWS::SNS::Topic', 1);
  template.resourceCountIs('AWS::SNS::Subscription', 1);
  template.resourceCountIs('AWS::Route53::HostedZone', 1);
});

test('stack should contain no bucket when secrets manager is used and have appropriate policy', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const zone = new route53.HostedZone(stack, 'Zone', {
    zoneName: 'auth.test.local',
  });

  new Certbot(stack, 'Certbot', {
    letsencryptDomains: 'test.local,auth.test.local',
    letsencryptEmail: 'test@test.local',
    hostedZoneNames: ['test.local'],
    hostedZones: [zone],
    certificateStorage: CertificateStorageType.SECRETS_MANAGER,
  });

  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::Lambda::Function', 1);
  template.resourceCountIs('AWS::Events::Rule', 2); // one for ongoing checks and one for immediate creation
  template.resourceCountIs('AWS::S3::Bucket', 0);
  template.resourceCountIs('AWS::IAM::ManagedPolicy', 4); // acm, sns, and r53, secrets manager
  template.hasResourceProperties('AWS::IAM::ManagedPolicy', Match.objectLike({
    PolicyDocument: {
      Statement: Match.arrayWith([
        {
          Action: Match.arrayWith([
            'secretsmanager:CreateSecret',
            'secretsmanager:DeleteSecret',
            'secretsmanager:DescribeSecret',
            'secretsmanager:GetSecretValue',
            'secretsmanager:ListSecrets',
            'secretsmanager:PutSecretValue',
            'secretsmanager:UpdateSecret',
          ]),
          Effect: 'Allow',
          Resource: Match.stringLikeRegexp('arn:aws:secretsmanager:us-east-1:123456789012:secret:\/certbot\/certificates\/test.local\/.*'),
        },
        {
          Action: Match.arrayWith([
            'kms:Decrypt',
            'kms:Encrypt',
          ]),
          Effect: 'Allow',
          Resource: Match.anyValue(),
        },
      ]),
    },
  }));
  template.resourceCountIs('AWS::IAM::Policy', 0);
  template.resourceCountIs('AWS::IAM::Role', 1);
  template.resourceCountIs('AWS::SNS::Topic', 1);
  template.resourceCountIs('AWS::SNS::Subscription', 1);
  template.resourceCountIs('AWS::Route53::HostedZone', 1);
});

test('stack should have policy with specific resource path when path is given for secrets manager', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const zone = new route53.HostedZone(stack, 'Zone', {
    zoneName: 'auth.test.local',
  });

  new Certbot(stack, 'Certbot', {
    letsencryptDomains: 'test.local,auth.test.local',
    letsencryptEmail: 'test@test.local',
    hostedZoneNames: ['test.local'],
    hostedZones: [zone],
    certificateStorage: CertificateStorageType.SECRETS_MANAGER,
    secretsManagerPath: '/certbot/alternate/path/',
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::IAM::ManagedPolicy', Match.objectLike({
    PolicyDocument: {
      Statement: Match.arrayWith([
        {
          Action: Match.arrayWith([
            'secretsmanager:CreateSecret',
            'secretsmanager:DeleteSecret',
            'secretsmanager:DescribeSecret',
            'secretsmanager:GetSecretValue',
            'secretsmanager:ListSecrets',
            'secretsmanager:PutSecretValue',
            'secretsmanager:UpdateSecret',
          ]),
          Effect: 'Allow',
          Resource: Match.stringLikeRegexp('arn:aws:secretsmanager:us-east-1:123456789012:secret:\/certbot\/alternate\/path\/.*'),
        },
        {
          Action: Match.arrayWith([
            'kms:Decrypt',
            'kms:Encrypt',
          ]),
          Effect: 'Allow',
          Resource: Match.anyValue(),
        },
      ]),
    },
  }));
});

test('stack should contain no bucket when parameter store is used and have appropriate policy', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const zone = new route53.HostedZone(stack, 'Zone', {
    zoneName: 'auth.test.local',
  });

  new Certbot(stack, 'Certbot', {
    letsencryptDomains: 'test.local,auth.test.local',
    letsencryptEmail: 'test@test.local',
    hostedZoneNames: ['test.local'],
    hostedZones: [zone],
    certificateStorage: CertificateStorageType.SSM_SECURE,
  });

  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::Lambda::Function', 1);
  template.resourceCountIs('AWS::Events::Rule', 2); // one for ongoing checks and one for immediate creation
  template.resourceCountIs('AWS::S3::Bucket', 0);
  template.resourceCountIs('AWS::IAM::ManagedPolicy', 4); // acm, sns, and r53, parameter store
  // one of the policies should have a parameter store policy statement
  template.hasResourceProperties('AWS::IAM::ManagedPolicy', Match.objectLike({
    PolicyDocument: {
      Statement: Match.arrayWith([
        {
          Action: 'ssm:PutParameter',
          Effect: 'Allow',
          Resource: Match.stringLikeRegexp('arn:aws:ssm:us-east-1:123456789012:parameter\/certbot\/certificates\/test.local\/.*'),
        },
        {
          Action: Match.arrayWith([
            'kms:Decrypt',
            'kms:Encrypt',
          ]),
          Effect: 'Allow',
          Resource: Match.anyValue(),
        },
      ]),
    },
  }));
  template.resourceCountIs('AWS::IAM::Policy', 0);
  template.resourceCountIs('AWS::IAM::Role', 1);
  template.resourceCountIs('AWS::SNS::Topic', 1);
  template.resourceCountIs('AWS::SNS::Subscription', 1);
  template.resourceCountIs('AWS::Route53::HostedZone', 1);
});

test('stack should have policy with specific resource path when path is given for SSM', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const zone = new route53.HostedZone(stack, 'Zone', {
    zoneName: 'auth.test.local',
  });

  new Certbot(stack, 'Certbot', {
    letsencryptDomains: 'test.local,auth.test.local',
    letsencryptEmail: 'test@test.local',
    hostedZoneNames: ['test.local'],
    hostedZones: [zone],
    certificateStorage: CertificateStorageType.SSM_SECURE,
    ssmSecurePath: '/certbot/alternate/path/',
  });

  const template = Template.fromStack(stack);

  // one of the policies should have a parameter store policy statement
  template.hasResourceProperties('AWS::IAM::ManagedPolicy', Match.objectLike({
    PolicyDocument: {
      Statement: Match.arrayWith([
        {
          Action: 'ssm:PutParameter',
          Effect: 'Allow',
          Resource: Match.stringLikeRegexp('arn:aws:ssm:us-east-1:123456789012:parameter\/certbot\/alternate\/path\/.*'),
        },
        {
          Action: Match.arrayWith([
            'kms:Decrypt',
            'kms:Encrypt',
          ]),
          Effect: 'Allow',
          Resource: Match.anyValue(),
        },
      ]),
    },
  }));
});

test('construct should allow a bucket to be given as a prop', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const bucket = new s3.Bucket(stack, 'Bucket', {});

  new Certbot(stack, 'Certbot', {
    letsencryptDomains: 'test.local',
    letsencryptEmail: 'test@test.local',
    hostedZoneNames: ['example.com'],
    bucket,
  });

  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::Lambda::Function', 1);
  template.resourceCountIs('AWS::Events::Rule', 2); // one for ongoing checks and one for immediate creation
  template.resourceCountIs('AWS::S3::Bucket', 1);
  template.resourceCountIs('AWS::IAM::ManagedPolicy', 3); // acm, sns, and r53
  template.resourceCountIs('AWS::IAM::Policy', 1); // 1 inline policy for granting bucket write
  template.resourceCountIs('AWS::IAM::Role', 1);
  template.resourceCountIs('AWS::SNS::Topic', 1);
  template.resourceCountIs('AWS::SNS::Subscription', 1);
});

test('construct should allow insights to be enabled', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  new Certbot(stack, 'Certbot', {
    letsencryptDomains: 'test.local',
    letsencryptEmail: 'test@test.local',
    hostedZoneNames: ['example.com'],
    enableInsights: true,
  });

  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::Lambda::Function', 1);
  template.resourceCountIs('AWS::Events::Rule', 2); // one for ongoing checks and one for immediate creation
  template.resourceCountIs('AWS::S3::Bucket', 1);
  template.resourceCountIs('AWS::IAM::ManagedPolicy', 3); // acm, sns, and r53
  template.resourceCountIs('AWS::IAM::Policy', 1); // 1 inline policy for granting bucket write
  template.resourceCountIs('AWS::IAM::Role', 1);
  template.resourceCountIs('AWS::SNS::Topic', 1);
  template.resourceCountIs('AWS::SNS::Subscription', 1);
});

test('disabling run on deploy should reduce total event rule count to 1', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  new Certbot(stack, 'Certbot', {
    letsencryptDomains: 'test.local',
    letsencryptEmail: 'test@test.local',
    hostedZoneNames: ['example.com'],
    runOnDeploy: false,
  });

  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::Lambda::Function', 1);
  template.resourceCountIs('AWS::Events::Rule', 1); // one for ongoing checks, none for immediate creation
  template.resourceCountIs('AWS::S3::Bucket', 1);
  template.resourceCountIs('AWS::IAM::ManagedPolicy', 3); // acm, sns, and r53
  template.resourceCountIs('AWS::IAM::Policy', 1); // 1 inline policy for granting bucket write
  template.resourceCountIs('AWS::IAM::Role', 1);
  template.resourceCountIs('AWS::SNS::Topic', 1);
  template.resourceCountIs('AWS::SNS::Subscription', 1);
});

test('not providing zone names or zones should throw an error', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  expect(() => {
    new Certbot(stack, 'Certbot', {
      letsencryptDomains: 'test.local, www.test.local',
      letsencryptEmail: 'test@test.local',
    });
  }).toThrowError('You must provide either hostedZoneNames or hostedZones');
});

test('Multiple certs in one stack does not error', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const zone = new route53.HostedZone(stack, 'Zone', {
    zoneName: 'auth.test.local',
  });

  expect(() => {
    new Certbot(stack, 'Certbot', {
      letsencryptDomains: 'test.local, www.test.local',
      letsencryptEmail: 'test@test.local',
      hostedZoneNames: ['example.com'],
      hostedZones: [zone],
    });

    new Certbot(stack, 'Certbot2', {
      letsencryptDomains: 'test2.local, www.test2.local',
      letsencryptEmail: 'test@test2.local',
      hostedZoneNames: ['example.com'],
      hostedZones: [zone],
    });
  }).not.toThrowError();
});
