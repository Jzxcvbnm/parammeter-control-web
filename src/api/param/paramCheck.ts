import request from '../request'

// 上传参数比对文件
export function paramCheck(data: any) {
    return request({
        url: '/param_info/compare/upload',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// 批量确认比对信息
export function saveComparelist(data: any) {
    return request({
        url: '/param_info/compare/confirm',
        method: 'post',
        data
    })
}