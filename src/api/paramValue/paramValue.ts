import request from '../request'

// 修改参数值
export function updateParamValue(data: any) {
    return request({
        url: '/paramValue/updateParamValue',
        method: 'post',
        data
    })
}

// 删除参数
export function deleteParamValue(data: any) {
    return request({
        url: '/paramValue/deleteParamValue',
        method: 'post',
        data
    })
}

