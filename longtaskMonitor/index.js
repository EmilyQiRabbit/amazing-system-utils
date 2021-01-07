var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import EventEmitter from 'eventemitter3';
var defaultReporter = function (params) {
    console.log('long task monitor log:', params);
};
var LongTaskMonitor = /** @class */ (function (_super) {
    __extends(LongTaskMonitor, _super);
    function LongTaskMonitor(initParams) {
        if (initParams === void 0) { initParams = { reporter: defaultReporter }; }
        var _this = _super.call(this) || this;
        _this.eventName = 'longtask';
        _this.records = [];
        _this.emitter = function (list) {
            var perfEntries = list.getEntries();
            // 广播长任务信息
            _this.emit(_this.eventName, perfEntries);
        };
        _this.start = function () {
            _this.records = [];
            var startTime = Date.now();
            var recordPerf = function (perfEntries) {
                var _a;
                (_a = _this.records).push.apply(_a, perfEntries);
            };
            _this.on(_this.eventName, recordPerf);
            var stop = function (params) {
                _this.removeListener(_this.eventName, recordPerf);
                if (_this.records.length && !(params === null || params === void 0 ? void 0 : params.noReport)) {
                    var reportData = {
                        name: _this.eventName,
                        duration: Date.now() - startTime,
                        longtaskCount: _this.records.length,
                        originData: _this.records,
                        longtaskSum: _this.records.map(function (record) { return record.duration; }).reduce(function (acc, cur) { return acc + cur; })
                    };
                    _this.reporter(reportData);
                    _this.records = [];
                }
            };
            return stop;
        };
        _this.destroy = function () {
            _this.observer && _this.observer.disconnect();
            _this.observer = null;
            _this.records = [];
        };
        var reporter = initParams.reporter;
        _this.reporter = reporter;
        _this.observer = PerformanceObserver ? new PerformanceObserver(_this.emitter) : null;
        _this.observer.observe({ entryTypes: ["longtask"] });
        return _this;
    }
    LongTaskMonitor.isSupported = 'PerformanceObserver' in window
        && 'PerformanceLongTaskTiming' in window
        && 'TaskAttributionTiming' in window;
    return LongTaskMonitor;
}(EventEmitter));
export default LongTaskMonitor;
