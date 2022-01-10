const { AwsCdkConstructLibrary, ProjectType, NpmAccess, IgnoreFile } = require('projen');
const project = new AwsCdkConstructLibrary({
  author: 'Renovo Solutions',
  authorAddress: 'webmaster+cdk@renovo1.com',
  cdkVersion: '1.138.2',
  defaultReleaseBranch: 'master',
  majorVersion: '2',
  releaseBranches: {
    v1: {
      majorVersion: '1',
    },
  },
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
  deps: [
    '@renovosolutions/cdk-library-one-time-event',
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
    workflowOptions: {
      labels: ['auto-approve', 'deps-upgrade'],
    },
  },
  githubOptions: {
    mergify: true,
    mergifyOptions: {
      rules: [
        {
          name: 'Automatically approve dependency upgrade PRs if they pass build',
          actions: {
            review: {
              type: 'APPROVE',
              message: 'Automatically approved dependency upgrade PR',
            },
          },
          conditions: [
            'label=auto-approve',
            'label=deps-upgrade',
            '-label~=(do-not-merge)',
            'status-success=build',
            'author=github-actions[bot]',
            'title="chore(deps): upgrade dependencies"',
          ],
        },
      ],
    },
    pullRequestLintOptions: {
      semanticTitle: true,
      semanticTitleOptions: {
        types: [
          'chore',
          'docs',
          'feat',
          'fix',
          'ci',
        ],
      },
    },
  },
  scripts: {
    'upgrade-cdk': 'bash -c "./upgrade_cdk_version.bash 1"',
  },
  releaseToNpm: true,
  releaseWorkflow: true,
  npmAccess: NpmAccess.PUBLIC,
  cdkAssert: true,
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
const ignorePatterns = [
  '.functionbundle/*',
  '.venv/*',
];
ignorePatterns.forEach( (pattern) => {
  project.gitignore.addPatterns(pattern);
  project.npmignore.addPatterns(pattern);
});
project.synth();