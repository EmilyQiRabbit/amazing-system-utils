import EventEmitter from 'eventemitter3';

type ReporterParams = {
    name: string;
    duration: number;
    longtaskCount: number;
    longtaskSum: number;
    originData: any;
}

type RepoterFunc = (params: ReporterParams) => void;

const defaultReporter = (params: ReporterParams) => {
    console.log('long task monitor log:', params);
}

export default class LongTaskMonitor extends EventEmitter {
    private observer: PerformanceObserver;
    private reporter: RepoterFunc;
    private eventName: string = 'longtask';
    private records: PerformanceEntryList = [];

    constructor(initParams: {reporter: RepoterFunc} = {reporter: defaultReporter}) {
        super();
        const { reporter } = initParams;
        this.reporter = reporter;
        this.observer = PerformanceObserver ? new PerformanceObserver(this.emitter) : null;
        this.observer.observe({entryTypes: ["longtask"]});
        return this;
    }

    private emitter: PerformanceObserverCallback = (list) => {
        const perfEntries = list.getEntries();
        // 广播长任务信息
        this.emit(this.eventName, perfEntries);
    }

    static isSupported = 'PerformanceObserver' in window
        && 'PerformanceLongTaskTiming' in window
        && 'TaskAttributionTiming' in window

    start = () => { // 业务封装
        this.records = [];
        const startTime = Date.now();
        const recordPerf = (perfEntries: PerformanceEntryList) => {
            this.records.push(...perfEntries);
        };
        this.on(this.eventName, recordPerf);
        const stop = (params?: {noReport: boolean}) => {
            this.removeListener(this.eventName, recordPerf);
            if (this.records.length && !params?.noReport) {
                let reportData = {
                    name: this.eventName,
                    duration: Date.now() - startTime,
                    longtaskCount: this.records.length,
                    originData: this.records,
                    longtaskSum: this.records.map(record => record.duration).reduce((acc, cur) => acc + cur)
                }
                this.reporter(reportData);
                this.records = [];
            }
        }
        return stop;
    }

    destroy = () => {
        this.observer && this.observer.disconnect();
        this.observer = null;
        this.records = [];
    }
}
