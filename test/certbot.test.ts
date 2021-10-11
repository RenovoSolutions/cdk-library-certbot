import { expect as expectCDK, countResources } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Certbot } from '../src/index';

test('Default', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  new Certbot(stack, 'Certbot', {
    letsencryptDomains: 'test.local',
    letsencryptEmail: 'test@test.local',
  });

  expectCDK(stack).to(countResources('AWS::Lambda::Function', 1));
  expectCDK(stack).to(countResources('AWS::Events::Rule', 1));
  expectCDK(stack).to(countResources('AWS::S3::Bucket', 1));
});
