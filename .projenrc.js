const { AwsCdkConstructLibrary, ProjectType, NpmAccess, IgnoreFile } = require('projen');
const project = new AwsCdkConstructLibrary({
  author: 'Renovo Solutions',
  authorAddress: 'webmaster+cdk@renovo1.com',
  cdkVersion: '1.128.0',
  defaultReleaseBranch: 'master',
  name: '@renovosolutions/cdk-library-certbot',
  description: 'AWS CDK Construct Library to manage Lets Encrypt certificate renewals with Certbot',
  repositoryUrl: 'https://github.com/RenovoSolutions/cdk-library-certbot.git',
  cdkDependencies: [
    '@aws-cdk/core',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-s3',
    '@aws-cdk/aws-events',
    '@aws-cdk/aws-events-targets',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-sns',
    '@aws-cdk/aws-sns-subscriptions',
    '@aws-cdk/aws-route53',
  ],
  keywords: [
    'letsencrypt',
    'certbot',
    'cdk',
    'aws-cdk',
    'aws-cdk-construct',
    'projen',
  ],
  releaseToNpm: true,
  releaseWorkflow: true,
  npmAccess: NpmAccess.PUBLIC,
  cdkAssert: true,
  mergify: false,
  docgen: true,
  eslint: true,
  publishToPypi: {
    distName: 'renovosolutions.aws-cdk-certbot',
    module: 'certbot',
  },
  publishToNuget: {
    dotNetNamespace: 'renovosolutions',
    packageId: 'Renovo.AWSCDK.Certbot',
  },
});
const ignorePatterns = [
  '.functionbundle/*',
  '.venv/*',
];
ignorePatterns.forEach( (pattern) => {
  project.gitignore.addPatterns(pattern);
  project.npmignore.addPatterns(pattern);
});
project.synth();