// 获取数据失败时，在 requestIdleCallback 中自动重试
export function autoRefetchOnfailed ({
    sendRequest,
    params,
    onSuccess,
    onFailed,
    onCatch, // 如果没有 onCatch 则请求失败时也会调用 onFailed
    requestSuccess = (result) => true, // 用户不定义此项，则认为请求成功那么获取数据就成功了
    autoRefetch = true
}: {
    sendRequest: (param: any) => Promise<any>,
    params?: any,
    onSuccess?: (result: any) => void,
    onFailed?: (result: any) => void,
    onCatch?: (error: any) => void,
    requestSuccess?: (result: any) => boolean, // 用户不定义此项，则认为请求成功那么获取数据就成功了
    autoRefetch?: boolean
}) {
    function refetch() {
        const handle = (window as any).requestIdleCallback(function() {
            this.autoRefetchOnfailed({
                sendRequest,
                params,
                onSuccess,
                onFailed,
                onCatch,
                requestSuccess
            });
            (window as any).cancelIdleCallback(handle);
        })
    }
    return sendRequest(params).then((result) => {
        if (requestSuccess(result)) {
            onSuccess && onSuccess(result);
        } else {
            onFailed && onFailed(result);
            autoRefetch && refetch();
        }
    }).catch((e) => {
        onCatch ? onCatch(e) : onFailed(e);
        autoRefetch && refetch();
    })
}
