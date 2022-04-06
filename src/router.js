import Vue from 'vue'
import Router from 'vue-router'
import * as authController  from "./controller/authController";
import error404 from "./views/error404/index.vue";
import Login from "./views/login/index.vue";
import * as controller from "./controller/routerController.js"
const defaultRoutes = controller.getDefaultRoutes();
const routes = [
    {
        // path: rConf.Configuration().default.path,
        // component: rConf.Configuration().default.component,
        // name: rConf.Configuration().default.name,
        // meta: {email: 'rnd@alterway.fr', description: 'Global infrastructure view', requiresAuth: true},
        path: '/',
        component: () => import('./components/Layout/container/index.vue'),
        id: defaultRoutes.name,
        meta: {  description: defaultRoutes.description, requiresAuth: defaultRoutes.requiresAuth ,icon:defaultRoutes.icon},
        children: controller.getChildrenRoutes()
    },
    {
        path: '*',
        component: error404,
    },
    {
        path: '/login',
        component: Login,
    },

]

const router = new Router({
    mode: 'history',
    routes
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        authController.checkConnectionWithAPI();
        if (window.sessionStorage.getItem('isLogin')) {
            next()
        } else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            })
        }
    } else {
        next()
    }
})

Vue.use(Router)

export default router