# **git 基础和常用命令**

日常收集，比较零散...

## 1. 删除本地/远程分支：

```
git branch -d <branch name>
git branch -D <branch name>（强制删除）
git push origin --delete <branch name>
```

## 2. 拉取一个本地不存在的分支

```
方法1：git checkout origin/release -b release
方法2：git fetch -apt / git checkout xxx
```

## 3. git cherry-pick

比如，要 pick 的改动是 develop 分支的这个 commit: 3a6k54

```
git checkout release
git pull --rebase release
git cherry-pick 3a6k54
git push origin release
```

## 4. git fetch <远程主机名> <分支名>

```
git fetch origin <分支名>
```

## 5. git 强行推

```
git push -f <remote> <branch>
```

## 6. git set origin url

```
git remote set-url origin xxx
```

## 7. github 总是要求输密码

git config --global credential.helper store

    这一步会在用户目录下的.gitconfig文件最后添加 credential

再次 push 并输入密码

    这一步会在用户目录下生成文件.git-credential 记录用户名密码的信息

## 8. git 更新 fork 仓库的代码

```
￼git remote -v
￼git remote add upstream https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY.git
￼（git remote -v）
￼git fetch upstream
￼git checkout master
￼git merge upstream/master
```

## 9. git 版本回退：reset & revert

**git reset：**

```
git reset —hard 版本号
```
**另外一个方式是使用 git revert：**

假如 git commit 链是

A -> B -> C -> D 

如果想把 B，C，D 都给 revert，除了一个一个 revert 之外，还可以使用 range revert

```
git revert B^..D 
```
这样就把 B，C，D 都给 revert 了，变成：

A-> B ->C -> D -> D'-> C' -> B'

用法就是：

git revert OLDER_COMMIT^..NEWER_COMMIT

如果我们想把这三个revert不自动生成三个新的commit，而是用一个commit完成，可以这样：

```
git revert -n OLDER_COMMIT^..NEWER_COMMIT
git commit -m "revert OLDER_COMMIT to NEWER_COMMIT"
```

## 10. git 删除本地所有修改

```
git checkout . 
git clean -xdf
```
## 11. git log

1、log 筛选：

```
git log --author="yuqi" // 按作者筛选
git log --grep="<pattern>" // 按 commit 信息筛选
git log --graph --decorate --oneline
git log --oneline master..some-feature 
// 👆在 `some-feature` 分支而不在 `master` 分支的所有提交的概览
```
2、单行显示
```
git log --oneline
```
## 12. git 子模块

命令：git submodule

栗子：

```
git submodule init
git submodule update
```
配置：.gitmodules 文件
```
[submodule "rack"]
  path = rack
  url = git://github.com/chneukirchen/rack.git
```
> 经常有这样的事情，当你在一个项目上工作时，你需要在其中使用另外一个项目。也许它是一个第三方开发的库或者是你独立开发和并在多个父项目中使用的。这个场景下一个常见的问题产生了：你想将两个项目单独处理但是又需要在其中一个中使用另外一个。
> 这里有一个例子。假设你在开发一个网站，为之创建Atom源。你不想编写一个自己的Atom生成代码，而是决定使用一个库。你可能不得不像CPAN install或者Ruby gem一样包含来自共享库的代码，或者将代码拷贝到你的项目树中。如果采用包含库的办法，那么不管用什么办法都很难去定制这个库，部署它就更加困难了，因为你必须确保每个客户都拥有那个库。把代码包含到你自己的项目中带来的问题是，当上游被修改时，任何你进行的定制化的修改都很难归并。
> Git 通过子模块处理这个问题。子模块允许你将一个 Git 仓库当作另外一个Git仓库的子目录。这允许你克隆另外一个仓库到你的项目中并且保持你的提交相对独立。
> [详细请戳这里](https://git-scm.com/book/zh/v1/Git-工具-子模块)

## 13. git commit 规范

￼feat：新功能（feature）

￼fix：修补bug

￼docs：文档（documentation）

￼style： 格式（不影响代码运行的变动）

￼refactor：重构（即不是新增功能，也不是修改bug的代码变动）

￼test：增加测试

chore：构建过程或辅助工具的变动

**如果是 merge 了其他分支，应该使用：git commit --no-edit**

## 14. git config
```
查看：git config --list
配置用户名：git config --global user.name yuqi
配置用户名：git config user.name EmilyQiRabbit
配置用户名：git config user.email LiuYQEmily@163.com
```
## 15. 远端强制覆盖本地

```
git fetch --all 
git reset --hard origin/master 
```

## 16. 全面的 Git 飞行指南

[Git 飞行规则](https://github.com/k88hudson/git-flight-rules/blob/master/README_zh-CN.md)

## 17. 将一个分支合并成一个提交 (commit)
```
(master)$ git merge --squash my-branch
```
## 18. git rebase 后找回消失的 commit

在 git rebase 操作时，存在冲突时，使用 git rebase --abort 处理后，结果发现 commit 的修改和记录都没有了。(使用 git rebase --skip 处理，也有导致 commit 消失不见得情况)，就是使用 git log 看不到。

**并不是真的在 git 中完全消失了。**

可以使用 git reflog 命令列出 log 信息。 

这样会显示 commit 的 sha, version, message，找到你消失的 commit，然后可以使用这个‘消失的’ commit 重新建立一个 branch.

```
$git checkout -b branch-bak [commit-sha]
```
## 19. git add -A 后找回工作区的修改

```
1. git reset -q
2. git reset --mixed
```

## 20. git blame

```
git blame -L 66,66 src/components/Preview.tsx
git log -L 162,162:src/mindmap.tsx
```

## 21. git stash

```
git stash
git stash list
git stash pop (apply
```

## 22. git merge --squash

将多个提交合并为一次

## 23. 修改最后一次提交的 message

```
git commit --amend --only -m 'xxxxxxx'
```

## 24. git clean

```
git clean -xdf // 移除当前目录下未跟踪的文件/目录，以及 Git 一般忽略的文件。
```
