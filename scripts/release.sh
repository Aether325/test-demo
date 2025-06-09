#!/usr/bin/env bash

package_name="`date +%Y%m%d%H%M`-test-demo"
version="`date +%Y-%m-%d\ %H:%M:%S`"


echo "Start compile $version"

# 编译
export REACT_APP_PACKAGE_VERSION=$version
node scripts/build.js

echo "End compile $version"

cp ../public/tonconnect-manifest.json ../docs

# 缓存编译结果
git stash -u

# 切换到目标分支
git checkout release

# 移除之前的 docs
rm -rf docs/
git add .
git commit -m'Delete old files'

# 取出新的编译结果
git stash pop

git add .
git commit -m "Deploy for $version"

echo "Start push $version"

# git push
# git checkout main

# git push
# echo "Complete $version"

# # clean
# rimraf docs
