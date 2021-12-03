import { expect as expectCDK, countResources, SynthUtils } from '@aws-cdk/assert';
import { aws_s3 as s3, App, Stack } from 'aws-cdk-lib';
import { Certbot } from '../src/index';

jest.setSystemTime(new Date('2020-01-01').getTime());

test('Snapshot', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  new Certbot(stack, 'Certbot', {
    letsencryptDomains: 'test.local, www.test.local',
    letsencryptEmail: 'test@test.local',
    hostedZoneNames: ['example.com'],
  });

  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});

test('Default', () => {
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
  });

  expectCDK(stack).to(countResources('AWS::Lambda::Function', 1));
  expectCDK(stack).to(countResources('AWS::Events::Rule', 2)); // one for ongoing checks and one for immediate creation
  expectCDK(stack).to(countResources('AWS::S3::Bucket', 1));
  expectCDK(stack).to(countResources('AWS::IAM::ManagedPolicy', 3)); // acm, sns, and r53
  expectCDK(stack).to(countResources('AWS::IAM::Policy', 1)); // 1 inline policy for granting bucket write
  expectCDK(stack).to(countResources('AWS::IAM::Role', 1));
  expectCDK(stack).to(countResources('AWS::SNS::Topic', 1));
  expectCDK(stack).to(countResources('AWS::SNS::Subscription', 1));
});

test('BucketPassedAsProp', () => {
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

  expectCDK(stack).to(countResources('AWS::Lambda::Function', 1));
  expectCDK(stack).to(countResources('AWS::Events::Rule', 2)); // one for ongoing checks and one for immediate creation
  expectCDK(stack).to(countResources('AWS::S3::Bucket', 1));
  expectCDK(stack).to(countResources('AWS::IAM::ManagedPolicy', 3)); // acm, sns, and r53
  expectCDK(stack).to(countResources('AWS::IAM::Policy', 1)); // 1 inline policy for granting bucket write
  expectCDK(stack).to(countResources('AWS::IAM::Role', 1));
  expectCDK(stack).to(countResources('AWS::SNS::Topic', 1));
  expectCDK(stack).to(countResources('AWS::SNS::Subscription', 1));
});

test('InsightsEnabled', () => {
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

  expectCDK(stack).to(countResources('AWS::Lambda::Function', 1));
  expectCDK(stack).to(countResources('AWS::Events::Rule', 2)); // one for ongoing checks and one for immediate creation
  expectCDK(stack).to(countResources('AWS::S3::Bucket', 1));
  expectCDK(stack).to(countResources('AWS::IAM::ManagedPolicy', 3)); // acm, sns, and r53
  expectCDK(stack).to(countResources('AWS::IAM::Policy', 1)); // 1 inline policy for granting bucket write
  expectCDK(stack).to(countResources('AWS::IAM::Role', 1));
  expectCDK(stack).to(countResources('AWS::SNS::Topic', 1));
  expectCDK(stack).to(countResources('AWS::SNS::Subscription', 1));
});

test('DoNotRunOnDeploy', () => {
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

  expectCDK(stack).to(countResources('AWS::Lambda::Function', 1));
  expectCDK(stack).to(countResources('AWS::Events::Rule', 1)); // one for ongoing checks and one for immediate creation
  expectCDK(stack).to(countResources('AWS::S3::Bucket', 1));
  expectCDK(stack).to(countResources('AWS::IAM::ManagedPolicy', 3)); // acm, sns, and r53
  expectCDK(stack).to(countResources('AWS::IAM::Policy', 1)); // 1 inline policy for granting bucket write
  expectCDK(stack).to(countResources('AWS::IAM::Role', 1));
  expectCDK(stack).to(countResources('AWS::SNS::Topic', 1));
  expectCDK(stack).to(countResources('AWS::SNS::Subscription', 1));
});
