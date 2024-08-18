import request from '../request'

// 上传配置文件
export function uploadConfig(data) {
    return request({
        url: '/param_info/category',
        method: 'post',
        data
    })
}

// 获取参数信息
export function getParamInfoAll() {
    return request({
        url: '/param_info/all',
        method: 'get',

    })
}

// 查询参数
export function getParamInfo(data) {
    return request({
        url: '/param_info/query',
        method: 'post',
        data
    })
}

// 新增参数信息
export function addParamInfo(data) {
    return request({
        url: '/paramClass/addParamInfo',
        method: 'post',
        data
    })
}

// 修改参数信息
export function updateParamInfo(data) {
    return request({
        url: '/paramClass/updateParamInfo',
        method: 'post',
        data
    })
}

// 删除参数信息
export function deleteParamInfo(data) {
    return request({
        url: '/paramClass/deleteParamInfo',
        method: 'post',
        data
    })
}

//获取变量分类
export function getVarClassify() {
    return request({
        url: '/type/category',
        method: 'get',
    })
}    

//保存清单信息
export function saveChecklist(data) {
    return request({
        url: '/param_info/checklist',
        method: 'post',
        data
    })
}
