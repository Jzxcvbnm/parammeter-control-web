/**
 * @/router/index.ts
 * 定义页面路由 Vue Router
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import NProgress from "../config/nprogress";
import { useUserStore } from '../store/modules/user'
import { useMenuStore } from '../store/modules/menu'

// 定义静态路由
export const staticRouter = [
    {
        path: '/',
        redirect: "/login",
        isMenu: false
    },
    {
        path: '/login',
        name: 'Login',
        meta: { title: '参数治理管控平台 - 登录'},
        component: ()=> import('../views/login/Login.vue'),
        isMenu: false
    },

    {
        path: '/index',
        name: 'index',
        component: ()=> import('../views/layout/Index.vue'),
        redirect: "/home",
        isMenu: true,
        funcNode:1,
        children: [
            {
                path: '/home',
                name: 'home',
                meta: { title: '首页', icon: 'House',affix: true },
                component: ()=> import('../views/home/Index.vue')
            }
        ]

    },
]

// 定义动态路由
export const asyncRoutes = [
    {
        path: '/param_classify_menu',
        name: 'param_classify_menu',
        meta: {
            auth: 'PARAM_CLASSIFY'
        },
        component: ()=> import('../views/layout/Index.vue'),
        redirect: "/param_classify",
        isMenu: true,
        funcNode:1,
        children: [
            {
                path: '/param_classify',
                name: 'param_classify',
                meta: {
                    title: '参数分类',
                    icon: 'Box',
                    auth: 'PARAM_CLASSIFY'
                },
                component: ()=> import('../views/paramClass/ParamClass.vue')
            }
        ]
    },
    {
        path: '/param_check_menu',
        name: 'param_check_menu',
        meta: {
            auth: 'PARAM_CHECK'
        },
        component: ()=> import('../views/layout/Index.vue'),
        redirect: "/param_check",
        isMenu: true,
        funcNode:1,
        children: [
            {
                path: '/param_check',
                name: 'param_check',
                meta: {
                    title: '参数校验',
                    icon: 'Tickets',
                    auth: 'PARAM_CHECK'
                },
                component: ()=> import('../views/paramCheck/ParamCheck.vue')
            }
        ]
    },
]

// 创建静态路由实例 createRouter -> Hash Mode
const router = createRouter({
    history: createWebHashHistory(),
    routes: staticRouter
})

// 路由拦截器 beforeEach
router.beforeEach(async (to, from, next) => {
    // 进度条触发
    NProgress.start();

    // 若访问登录/注册页，直接放行
    if(to.path==='/login')return next()
    if(to.path==='/captcha')return next()

    // 判断是否有Token,没有重定向到login
    const userStore = useUserStore()
    // if(!userStore.token)return next({path:`/login?redirect=${to.path}`,replace:true})

    // 获取登录用户的权限列表
    const authList = ['PARAM_CLASSIFY', 'PARAM_CHECK']

    // 根据权限列表动态生成路由访问映射
    const menuStore = useMenuStore()
    if (!menuStore.routers.length) {
        const accessRoutes =  menuStore.generateRoutes({authList: authList})
        accessRoutes.forEach(item => router.addRoute(item)) // 动态添加访问路由表
        next({ ...to, replace: true }) // 这里相当于push到一个页面 不在进入路由拦截
    }else {
        // 正常访问页面
        next();
    }
});

/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {
    NProgress.done();
});
/**
 * @description 路由跳转错误
 * */
router.onError(error => {
    NProgress.done();
    console.warn("路由错误", error.message);
});
export default router