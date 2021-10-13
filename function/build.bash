#!/bin/bash

# You can use this for a pre-commit hook by doing
# ln -s -f $PWD/function/build.bash .git/hooks/pre-commit

if git diff --cached | grep 'diff --git a/function/index.py b/function/index.py' ||\
 git diff --cached | grep 'diff --git a/function/requirements.txt b/function/requirements.txt' ||\
 [[ "$1" == "refresh" ]]; then
  rm function/function.zip
  rm -rf .venv
  python3 -m venv .venv
  source .venv/bin/activate
  BUILD_DIR='.functionbundle/'
  mkdir -p $BUILD_DIR
  pip install -r function/requirements.txt -t $BUILD_DIR
  cp function/index.py $BUILD_DIR/index.py
  cd $BUILD_DIR
  zip -r ../function/function.zip .
  cd ..
  if ! [[ "$1" == "refresh" ]]; then
    git add function/function.zip
  fi
fi
