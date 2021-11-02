import { expect as expectCDK, countResources, SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Certbot } from '../src/index';

jest.setSystemTime(new Date('2020-01-01').getTime());

test('Snapshot', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack', {
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
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack', {
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
