#!/usr/bin/env sh

echo "Variables:"
echo 'GIT_REPO =' "$GIT_REPO"
echo "GIT_BRANCH = $GIT_BRANCH"
echo "TARGET_DIR = $TARGET_DIR"
echo "========================================="

apk update && \
apk add git

rm -rf ./*
echo "Cloning repository ..."
git clone -b "${GIT_BRANCH}" --single-branch --depth 1 "${GIT_REPO}" .
echo "Installing dependencies ..."
npm i
echo "Build project ..."
npm run build
echo "Move project ..."
mkdir -p $TARGET_DIR
rm -rf $TARGET_DIR/*
mv ./dist/* $TARGET_DIR/
echo "Done"
