import { defineStore } from 'pinia'
export const useUserStore = defineStore({
    id: 'userStore',
    state: () => {
        /**
         * token:    登录token
         * userInfo: 登录用户信息
         * authList: 登录用户权限列表
         */
        return {
            token: '',
            userInfo: {} as UserInfo,
        }
    },
    getters: {},
    actions: {
        // 设置登录token
        setToken(token: string) {
            this.token = token;
        },
        // 设置登录用户信息
        setUserInfo(userInfo: any) {
            this.userInfo = userInfo
        },
    },
    persist: true
})

interface UserInfo {
    userName: string
    userId: string
}
