import request from '../request'

// 上传配置文件
export function uploadConfig(data) {
    return request({
        url: '/param_info/category/upload',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// 获取参数信息
export function getParamInfoAll() {
    return request({
        url: '/param_info/category/all',
        method: 'get',

    })
}

// 新增参数信息
export function addParamInfo(data) {
    return request({
        url: '/param_info/category/save',
        method: 'post',
        data
    })
}

// 修改参数信息
export function updateParamInfo(data) {
    return request({
        url: '/param_info/category/update',
        method: 'put',
        data
    })
}

// 删除参数信息
export function deleteParamInfo(id) {
    return request({
        url: `/param_info/category/delete/${id}`,
        method: 'put',
    })
}

//批量确认清单信息
export function saveChecklist(data) {
    return request({
        url: '/param_info/category/updateBatch',
        method: 'post',
        data
    })
}

// 批量启用参数信息
export function enableChecklist(data) {
    return request({
        url: '/param_info/compare/confirmBatch',
        method: 'post',
        data
    })
}

// 批量删除参数信息
export function deleteChecklist(data) {
    return request({
        url: '/param_info/category/deleteBatch',
        method: 'delete',
        data
    })
}

// 获取参数总体视图信息
export function getParamTotalView() {
    return request({
        url: '/param_info/category/totalView',
        method: 'get',
    })
}