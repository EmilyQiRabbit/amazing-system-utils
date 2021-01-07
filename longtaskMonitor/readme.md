# Long Task Monitor

基于 [PerformanceObserver](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)、[Long Tasks API](https://developer.mozilla.org/en-US/docs/Web/API/Long_Tasks_API) 和 [eventemitter3](https://github.com/primus/eventemitter3) 的长任务监听工具，可用于监测或记录大于 50 毫秒的任务信息，从而可以帮助定位卡顿等性能问题。

## 1. 安装

```shell
mnpm i @xm/longtask-monitor --save
```

## 2. API

### 2.1 `new LongTaskMonitor([options])`

* `options` \<Object> 可选参数，默认为 `{reporter: (params) => console.log(params)}`。
    * `reporter` \<Function> 长任务信息收集结束后会自动调用该函数汇报信息，该函数参数 `params` 包含该时段长任务信息：
        * `params.name`: 事件名，即 `'longtask'`
        * `params.duration`: 监听时长
        * `params.longtaskCount`: 该时段内长任务总个数
        * `params.originData`: 该时段内长任务详细信息
        * `params.longtaskSum`: 长任务耗费总时长

返回 `LongTaskMonitor` 的实例。

### 2.2 静态方法

#### 2.2.1 `LongTaskMonitor.isSupported`

返回当前浏览器是否支持长任务检测。

### 2.3 实例方法

#### 2.3.1 `monitor.on(eventName, listener)`

`LongTaskMonitor` 继承了 `EventEmitter`，实例方法 `on` 与 `EventEmitter` 实例相同。
* `eventName` \<string> 事件名
* `listener` \<Function> 回调函数

如果想要监听长任务事件，需指定 `eventName='longtask'`，此时 `listener` 的参数是包含长任务信息的数组，参数类型为 [`PerformanceEntry[]`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry)。

示例：

```js
const LongTaskMonitor = require('@xm/longtask-monitor');
const longtaskMonitor = new LongTaskMonitor();
const listener = (perfEntries) => {
    console.log(perfEntries);
}
longtaskMonitor.on('longtask', listener);
```

#### 2.3.2 `monitor.start()`

调用 `start` 开始收集一段时间内的长任务信息。

返回函数 `stop`，调用 `stop` 将会停止长任务信息的收集，并且如果该段时间内收集到了长任务信息，会自动调用实例化时配置的 `reporter` 函数反馈信息。

示例：

```js
const LongTaskMonitor = require('@xm/longtask-monitor');

const monitor = new LongTaskMonitor({
    reporter: (params) => {
        console.log(params);
    }
});

// 开始收集长任务信息
const stop = monitor.start();

doSomething()

stop() // 该时段有长任务信息记录，会自动回调 reporter
```

#### 2.3.3 `monitor.destroy()`

销毁实例，释放空间。
