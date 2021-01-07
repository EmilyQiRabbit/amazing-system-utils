## 目前收集到的工具包括：

### Public

1. Hammerspoon：强大的 OS X 系统工具，详见 [hammerspoon/README](./hammerspoon/README.md)

2. gulp：自动化构建工具，一款工作流增强器
   
3. typedoc：自动生成 TypeScript 项目文档

4. git monkey
   1. [git 常用命令](https://github.com/EmilyQiRabbit/amazing-system-utils/blob/master/git-monkey/git.md)
   2. [git alias 配置](https://github.com/EmilyQiRabbit/amazing-system-utils/blob/master/git-monkey/git-alias.md)

5. [virustotal](https://developers.virustotal.com/v3.0/)：可用于检测安装包病毒，相见 [virustotal/README.md](./virustotal/README.md)

6. 自动化骨架屏 [page-skeleton-webpack-plugin](https://github.com/ElemeFE/page-skeleton-webpack-plugin) (Eleme 团队)

7. Web Worker：JavaScript 多线程方案

8. [window.performance 全揭秘](https://www.cnblogs.com/tugenhua0707/p/10982332.html)

9. 资源离线化方案：
   * [Hybrid App 离线包方案实践](https://juejin.cn/post/6844904031773523976)
   * [极致的 Hybrid：航旅离线包再加速！](https://www.open-open.com/news/view/1cee25c)

### Self

1. ~~[autoRefetch](https://github.com/EmilyQiRabbit/amazing-system-utils/blob/master/autoRefetch/autoRefetch.ts): 远端请求失败时，自动在 window.requestIdleCallback() 中重新拉取。~~ （疯了吧自己造轮子 🤪，有现成又好用的它不香吗？！参见 [p-retry](https://github.com/sindresorhus/p-retry)，呵呵）

2. 【MT内部项目】Longtask Monitor: 基于 [PerformanceObserver](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)、[Long Tasks API](https://developer.mozilla.org/en-US/docs/Web/API/Long_Tasks_API) 和 [eventemitter3](https://github.com/primus/eventemitter3) 的长任务监听工具。
