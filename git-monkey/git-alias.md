## git alias config

日常偷懒 😏

```sh
_glm() {
  git log --grep="$1"
}

_gla() {
  git log --author="$1"
}

_gpush() {
  br=`git branch | grep "*"`
  git push origin ${br/* /}
}

_gpull() {
  br=`git branch | grep "*"`
  git pull --rebase origin ${br/* /}
}

alias gpull=_gpull # 自动拉取 origin 同名分支
alias gpush=_gpush # 自动推送到 origin 同名分支
alias glo="git log --graph --decorate --oneline"
alias gla=_gla
alias glm=_glm
# 删除除了 release 的所有分支
alias gitb-d-all="git branch | grep -v 'release' | xargs git branch -D"
# 在打开 chrome 某网址，例如：chrome https://baidu.com
alias chrome="open -a 'Google Chrome'"

# 其他偷懒命令...
alias gitc-b="git checkout -b"
alias gitc="git checkout"
alias gpush-f="git push -f origin"
alias gitcp="git cherry-pick"
alias gitb="git branch"
alias gits="git status"
alias cc="code ."
alias nst="npm start"
alias yi="yarn install"
alias gcommit="git add .;git commit -m"
```
