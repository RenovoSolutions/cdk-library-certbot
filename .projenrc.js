const { AwsCdkConstructLibrary, ProjectType, NpmAccess } = require('projen');
const project = new AwsCdkConstructLibrary({
  author: 'Brandon Miller',
  authorAddress: 'brandon@digital-reboot.com',
  cdkVersion: '1.126.0',
  defaultReleaseBranch: 'master',
  name: '@renovosolutions/cdk-library-certbot',
  description: 'AWS CDK Construct Library to manage Lets Encrypt certificate renewals with Certbot',
  repositoryUrl: 'https://github.com/RenovoSolutions/cdk-library-certbot.git',
  cdkDependencies: [
    '@aws-cdk/core',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-s3',
  ],
  projectType: ProjectType.LIB,
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
project.synth();