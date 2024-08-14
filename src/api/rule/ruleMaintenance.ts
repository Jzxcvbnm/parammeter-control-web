import request from '../request'

// 获取分类树
export function getTypeTree() {
    return request({
        url: '/type/getTypeTree',
        method: 'get',
    })
}

// 新增分类
export function addType(data) {
    return request({
        url: '/type/save',
        method: 'post',
        data
    })
}

// 修改分类
export function updateType(data) {
    return request({
        url: '/type/update',
        method: 'post',
        data
    })
}

// 删除分类
export function deleteType(id) {
    return request({
        url: '/type/delete/{id}',
        method: 'delete',
    })
}