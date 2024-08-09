import {defineStore} from 'pinia'
import {asyncRoutes, staticRouter} from "../../router";
export const useMenuStore = defineStore({
    id:'menuState',
    state: ()=>({

        /**
         * routers:    menu静态路由
         * addRouters: 动态路由
         * authList:   登录用户权限列表
         */
        routers:[], 
        addRouters: [],
        authList: []
    }),
    getters: {},
    actions: {
        // 设置路由
        generateRoutes: function ({authList}: { authList: any }) {
            let accessedRoutes = filterAsyncRoutes({routes: asyncRoutes, authList: authList})
            this.addRouters = accessedRoutes
            this.routers = staticRouter.concat(accessedRoutes)

            return accessedRoutes
        },

        // 动态生成访问路由
        setRoles({authList}: { authList: any }) {
            this.authList = authList
        }
    }
})

// 通过递归过滤asyncRoutes
export function filterAsyncRoutes ({routes, authList}: { routes: any, authList: any }) {
    const res = []
    routes.forEach(route => {
        const tmp = { ...route }
        if (hasPermission(authList, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes({routes: tmp.children, authList: authList})
            }
            res.push(tmp)
        }
    })

    return res
}

function hasPermission (authList, route) {
    if (route.meta && route.meta.auth) {
        return authList.includes(route.meta.auth)
    } else {
        return true
    }
}
