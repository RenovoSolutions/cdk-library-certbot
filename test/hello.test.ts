import { expect as expectCDK, countResources } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { Certbot } from '../src/index';

test('Simple test', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  new Certbot(stack, 'Certbot', {
    letsencryptDomains: 'test.local',
    letsencryptEmail: 'test@test.local',
  });

  expectCDK(stack).to(countResources('AWS::Lambda::Function', 1));

});