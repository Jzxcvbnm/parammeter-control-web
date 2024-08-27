import request from '../request'

// 上传参数比对文件（准确性校验）
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

// 上传参数比对文件（冗余变量校验）
export function paramCheckRedundancy(data: any) {
    return request({
        url: '/param_info/compare/upload/redundancy',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// 上传参数比对文件（无效变量校验）
export function paramCheckInvalid(data: any) {
    return request({
        url: '/param_info/compare/upload/invalid',
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
        url: '/param_info/compare/updateBatch',
        method: 'post',
        data
    })
}