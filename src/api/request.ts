import axios from 'axios'
import { useUserStore } from '../store/modules/user'

const service  = axios.create({
    // baseURL: import.meta.env.VITE_APP_BASE_API,
    baseURL: '/param',
    timeout: 300000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
})

// Axios 请求前置拦截器 | 加入token
service.interceptors.request.use( config => {

    if (!config.headers) 
    {
        config.headers = {};
    }

    let token = useUserStore().token

    if (token) {
        config.headers.token = token;
    }

    return config
}, error => {
    console.log("[Interceptors Error]" + error);
})

export default service
