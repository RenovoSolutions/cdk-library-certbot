import { awscdk, javascript } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Renovo Solutions',
  authorAddress: 'webmaster+cdk@renovo1.com',
  projenrcTs: true,
  cdkVersion: '2.233.0',
  jsiiVersion: '^5.8.0',
  defaultReleaseBranch: 'master',
  majorVersion: 2,
  name: '@renovosolutions/cdk-library-certbot',
  description: 'AWS CDK Construct Library to manage Lets Encrypt certificate renewals with Certbot',
  repositoryUrl: 'https://github.com/RenovoSolutions/cdk-library-certbot.git',
  deps: [
    '@renovosolutions/cdk-library-one-time-event@^2.1.126',
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
  buildWorkflow: false,
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
    module: 'renovosolutions_certbot',
  },
  jestOptions: {
    jestConfig: {
      fakeTimers: {
        enableGlobally: true,
      },
    },
  },
  tsconfigDev: {
    compilerOptions: {
      isolatedModules: true,
    },
  },
});

new javascript.UpgradeDependencies(project, {
  include: ['projen'],
  taskName: 'upgrade-projen',
  workflow: false,
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

// Ignore the release workflow file so it's not committed to git
project.gitignore.exclude('!/.github/workflows/release.yml');
project.gitignore.addPatterns('.github/workflows/release.yml');

project.synth();
