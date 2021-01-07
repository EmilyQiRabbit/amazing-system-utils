import EventEmitter from 'eventemitter3';
declare type ReporterParams = {
    name: string;
    duration: number;
    longtaskCount: number;
    longtaskSum: number;
    originData: any;
};
declare type RepoterFunc = (params: ReporterParams) => void;
export default class LongTaskMonitor extends EventEmitter {
    private observer;
    private reporter;
    private eventName;
    private records;
    constructor(initParams?: {
        reporter: RepoterFunc;
    });
    private emitter;
    static isSupported: boolean;
    start: () => (params?: {
        noReport: boolean;
    }) => void;
    destroy: () => void;
}
export {};
