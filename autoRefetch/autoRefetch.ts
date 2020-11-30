// 已废弃
// 获取数据失败时，在 requestIdleCallback 中自动重试
export function autoRefetchWrapper ({
    sendRequest,
    params,
    isSuccess = function (result) { return true }, // 用户不定义此项，则认为请求成功那么获取数据就成功了
    autoRefetch = true,
    timeout = 15000, // 如果不支持 requestIdleCallback，那么多少毫秒后自动重试
}: {
    sendRequest: (param: any) => Promise<any>,
    params?: any,
    isSuccess?: (result: any) => boolean,
    autoRefetch?: boolean,
    timeout?: number,
}): Promise<any> {
    function refetch() {
        const requestIdleCallback = (window as any).requestIdleCallback;
        if (requestIdleCallback) {
            const handle = (window as any).requestIdleCallback(function() {
                autoRefetchWrapper({
                    sendRequest,
                    params,
                    isSuccess
                });
                (window as any).cancelIdleCallback(handle);
            })
        } else {
            const id = window.setTimeout(function() {
                autoRefetchWrapper({
                    sendRequest,
                    params,
                    isSuccess
                });
                window.clearTimeout(id);
            }, timeout)
        }
    }
    return sendRequest(params).then(function(result){
        if (isSuccess(result)) {
            autoRefetch && refetch();
        }
        return Promise.resolve(result);
    }).catch(function(e) {
        autoRefetch && refetch();
        return Promise.reject(e);
    })
}
