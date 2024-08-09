import request from '../request'

// 上传配置文件
export function uploadConfig(data) {
    return request({
        url: '/paramClass/uploadConfig',
        method: 'post',
        data
    })
}

// 获取参数分类列表
export function getParamClassList(data) {
    return request({
        url: '/paramClass/getParamClassList',
        method: 'post',
        data
    })
}

// 修改参数分类
export function updateParamClass(data) {
    return request({
        url: '/paramClass/updateParamClass',
        method: 'post',
        data
    })
}

