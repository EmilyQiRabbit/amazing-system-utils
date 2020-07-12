## .zshrc config

日常偷懒 😏

```sh
plugins=(
  git
  autojump
  zsh-syntax-highlighting
)

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

_gpushf() {
  br=`git branch | grep "*"`
  git push -f origin ${br/* /}
}

_fdesc() {
  echo "/**\n * "$1" \n * @desc \n * @auther liuyuqi \n * @date $(date +%Y-%m-%d)\n*/" >> "$1"
}

alias gpull=_gpull
alias gitc-b="git checkout -b"
alias gitc="git checkout"
alias gpush=_gpush # 自动推送到 origin 同名分支
alias gpush-f=_gpushf
alias gitcp="git cherry-pick"
alias gitb="git branch"
alias gits="git status"
alias glo="git log --graph --decorate --oneline"
alias gla=_gla
alias glm=_glm
alias fdesc=_fdesc
alias cc="code ."
alias dst="NODE_DEVTOOL= npm start"
alias nst="npm start"
alias ccn="code .;npm start"
alias npmi="npm install"
alias yi="yarn install"
alias gcommit="git add .;git commit -m"
alias gcommit-nv="git add .;git commit --no-verify -m"
alias getIndex="python ~/toc.py"
alias chrome="open -a 'Google Chrome'"
alias ip-addr="ifconfig | grep inet | grep -v inet6 | grep -v 127"
alias prew="prettier --write"
alias github-config="git config user.name EmilyQiRabbit;git config user.email LiuYQEmily@163.com"
# 删除除了 test 的所有分支
alias gitb-d-all="git branch | grep -v 'test' | xargs git branch -D"
alias gcl0="git clean -d -n"
alias gcl1="git clean -d -f"
```
