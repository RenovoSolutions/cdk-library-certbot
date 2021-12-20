#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <cdk-major-version>"
  exit 1
fi

re='^[0-9]+$'
if ! [[ $1 =~ $re ]]; then
  echo "Error: CDK major version must be a number"
  exit 1
fi

release_version=$( curl -sL https://api.github.com/repos/aws/aws-cdk/releases | jq -r .[].tag_name | grep v$1 | sort -V -r | head -1 | sed 's/v//' )
local_version=$( cat .projenrc.js | grep cdkVersion | awk ' { print $2 } ' | sed -e "s/'//g" -e 's/,//' )

if [[  $release_version == $local_version ]]; then
  echo "No need to upgrade CDK version"
else
  echo "Upgrading CDK version from $local_version to $release_version"
  sed -i "s/cdkVersion: '$local_version'/cdkVersion: '$release_version'/g" .projenrc.js
  npx projen && jest test && yarn build
  if [[ $? -eq 0 ]]; then
    echo "CDK version upgraded built successfully"
    git config user.name "github-actions"
    git config user.email "github-actions@github.com"
    git commit -am "chore(deps): Upgrade CDK version from $local_version to $release_version"
    git push
  else
    echo "CDK version upgrade failed to build"
    exit 1
  fi
fi
