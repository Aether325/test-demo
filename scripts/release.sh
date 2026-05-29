#!/usr/bin/env bash

set -e

package_name="`date +%Y%m%d%H%M`-test-demo"
version="`date +%Y-%m-%d\ %H:%M:%S`"
tmp_dir="/tmp/test-demo-release-$$"

echo "Start compile $version"

# 编译（BUILD_PATH=docs，产物输出到 ./docs）
export REACT_APP_PACKAGE_VERSION=$version
node scripts/build.js

echo "End compile $version"

# 把编译产物移到临时目录保存（docs/ 在 main 分支不被 git 追踪）
rm -rf "$tmp_dir"
cp -r docs "$tmp_dir"

# 切换到目标分支
git checkout release

# 移除之前的 docs，换成新的
rm -rf docs/
cp -r "$tmp_dir" docs

git add .
git commit -m "Deploy for $version"

echo "Start push $version"

git push

git checkout main
git push

echo "Complete $version"

# 清理临时目录
rm -rf "$tmp_dir"
