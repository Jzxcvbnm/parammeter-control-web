import request from '../request'
export function loginApi(data:object) {
    return request({
        url: 'login',
        method: 'post',
        data
    })
}

export function getCaptchaApi(uuid:string) {
    return request({
        url: `captcha?uuid=${uuid}`,
        method: 'get'
    })
}

// 退出系统
export function loginOutApi() {
    // 不发送实际请求
    return Promise.resolve({ data: { code: 200 } });
}


