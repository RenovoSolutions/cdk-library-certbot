import { awscdk, javascript } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Renovo Solutions',
  authorAddress: 'webmaster+cdk@renovo1.com',
  projenrcTs: true,
  cdkVersion: '2.106.1',
  defaultReleaseBranch: 'master',
  majorVersion: 2,
  name: '@renovosolutions/cdk-library-certbot',
  description: 'AWS CDK Construct Library to manage Lets Encrypt certificate renewals with Certbot',
  repositoryUrl: 'https://github.com/RenovoSolutions/cdk-library-certbot.git',
  deps: [
    '@renovosolutions/cdk-library-one-time-event@^2.1.125',
  ],
  bundledDeps: [
    '@jest/globals',
  ],
  keywords: [
    'letsencrypt',
    'certbot',
    'cdk',
    'aws-cdk',
    'aws-cdk-construct',
    'projen',
  ],
  depsUpgrade: true,
  depsUpgradeOptions: {
    workflow: false,
    exclude: ['projen'],
    workflowOptions: {
      schedule: javascript.UpgradeDependenciesSchedule.WEEKLY,
    },
  },
  githubOptions: {
    mergify: false,
    pullRequestLintOptions: {
      semanticTitle: false,
    },
  },
  stale: false,
  releaseToNpm: true,
  release: true,
  npmAccess: javascript.NpmAccess.PUBLIC,
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
  jestOptions: {
    jestConfig: {
      timers: 'fake',
    },
  },
});

new javascript.UpgradeDependencies(project, {
  include: ['projen'],
  taskName: 'upgrade-projen',
  workflow: true,
  workflowOptions: {
    schedule: javascript.UpgradeDependenciesSchedule.WEEKLY,
  },
});

const ignorePatterns = [
  '.functionbundle/*',
  '**/.venv/**',
  '**/__pycache__/**',
];
ignorePatterns.forEach( (pattern) => {
  project.gitignore.addPatterns(pattern);
  project.npmignore?.addPatterns(pattern);
});
project.synth();
