---
name: git-gitee
description: 提交项目到gitee仓库
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: git
---

## 功能
- 初始化git仓库（如果尚未初始化）
- 添加所有文件到暂存区
- 提交更改到本地仓库
- 推送到gitee远程仓库

## 使用方法
使用此技能将当前目录的项目提交到gitee仓库。需要提供gitee私人令牌和仓库地址。

## 参数
- `token`: gitee私人令牌
- `repo_url`: gitee仓库地址（例如：https://gitee.com/username/repo.git）
- `commit_message`: 提交信息（可选，默认为"Initial commit"）

## 步骤
1. 检查是否已初始化git仓库，如果没有则执行 `git init`
2. 配置git用户信息（如果未配置）
3. 添加所有文件：`git add .`
4. 提交更改：`git commit -m "提交信息"`
5. 添加远程仓库：`git remote add origin https://<token>@gitee.com/...`
6. 推送到远程仓库：`git push -u origin master`

## 注意事项
- 确保gitee私人令牌具有推送权限
- 如果远程仓库已有提交，可能需要先拉取更改
- 使用 `git pull --rebase origin master` 来合并远程更改