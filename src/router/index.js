import Vue from 'vue'
import Router from 'vue-router'
import {checkConnectionWithAPI} from "../controller/authController";
const routes = [
  {
    path: '/',
    component: () => import('../components/Layout/container/index.vue'),
    name: 'Default',
    meta: { email: 'rnd@alterway.fr', description: 'Global infrastructure view', requiresAuth: true },
    children: [
      {
        path: 'home',
        alias: '',
        component: () => import('../views/home/index.vue'),
        name: 'Overall',
        meta: { description: 'Global infrastructure view', requiresAuth: true },
      },
      {
        path: 'monitoring',
        component: () => import('../views/monitoring/index.vue'),
        name: 'Monitoring',
        meta: { description: 'Graph view of prometheus query', requiresAuth: false }
      },
      {
        path: 'namespaces',
        component: () => import('../views/namespaces/index.vue'),
        name: 'Namespaces',
        meta: { description: 'Detailled view of namespaces', requiresAuth: true }
      },

      {
        path: 'nodes',
        component: () => import('../views/nodes/index.vue'),
        name: 'Nodes',
        meta: { description: 'Detailled view of nodes', requiresAuth: true }
      },
      {
        path: 'pods',
        component: () => import('../views/pods/index.vue'),
        name: 'pods',
        meta: { description: 'Detailled view of pods', requiresAuth: true }
      },
      {
        path: 'monitoring',
        component: () => import('../views/monitoring/index.vue'),
        name: 'Monitoring',
        meta: { description: 'Graph view of prometheus query', requiresAuth: true }
      },
        //instances
      {
        path: 'instances',
        component: () => import('../views/instances/listInstances/index.vue'),
        name: 'Instances',
        meta: { description: 'Instances list', requiresAuth: true }
      },
      {
        path: 'instances/create',
        component: () => import('../views/instances/createInstance/index.vue'),
        name: 'CreateInstance',
        meta: { description: 'Create instance', requiresAuth: true }
      },
      {
        path: 'instances/display/:id',
        component: () => import('../views/instances/displayInstance/index.vue'),
        name: 'DisplayInstance',
        meta: { description: 'Display instance', requiresAuth: true }
      },

      //templates
      {
        path: 'templates',
        component: () => import('../views/templates/listTemplates/index.vue'),
        name: 'Templates',
        meta: { description: 'Templates list', requiresAuth: true }
      },
      {
        path: 'templates/create',
        component: () => import('../views/templates/createTemplate/index.vue'),
        name: 'CreateTemplate',
        meta: { description: 'Create template', requiresAuth: true }
      },
      {
        path: 'templates/display/:id',
        component: () => import('../views/templates/displayTemplate/index.vue'),
        name: 'DisplayTemplate',
        meta: { description: 'Display template', requiresAuth: true }
      },
      {
        path: 'card',
        component: () => import('../components/Layout/card/index.vue'),
        name: 'card',
        meta: { description: 'Graph view of workflow query', requiresAuth: true }
      }
    ]
  },
  {
    path: '*',
    component: () => import('../views/error404/index.vue'),
  },
  {
    path: '/login',
    component: () => import('../views/login/index.vue'),
  },

]

const router = new Router({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
      checkConnectionWithAPI();
      if (window.sessionStorage.getItem('isLogin')) {
        next()
      } else{
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      }
  } else {
    next()
  }
})

Vue.use(Router)

export default router