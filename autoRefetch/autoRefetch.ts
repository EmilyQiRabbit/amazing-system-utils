// 获取数据失败时，在 requestIdleCallback 中自动重试
function autoRefetchOnfailed ({
    sendRequest,
    params,
    requestSuccess = (result) => true, // 用户不定义此项，则认为请求成功那么获取数据就成功了
    autoRefetch = true
}: {
    sendRequest: (param: any) => Promise<any>,
    params?: any,
    requestSuccess?: (result: any) => boolean, // 用户不定义此项，则认为请求成功那么获取数据就成功了
    autoRefetch?: boolean
}): Promise<any> {
    function refetch() {
        const handle = (window as any).requestIdleCallback(function() {
            this.autoRefetchOnfailed({
                sendRequest,
                params,
                requestSuccess
            });
            (window as any).cancelIdleCallback(handle);
        })
    }
    return sendRequest(params).then((result) => {
        if (requestSuccess(result)) {
            autoRefetch && refetch();
        }
        return Promise.resolve(result);
    }).catch((e) => {
        autoRefetch && refetch();
        return Promise.reject(e);
    })
}
