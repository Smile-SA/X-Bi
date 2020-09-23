import Vue from 'vue'
import Router from 'vue-router'
import { isAuth } from './utils'

const routes = [
  {
    path: '/',
    component: () => import('./components/DashLayout.vue'),
    name: 'Default',
    meta: { email: 'rnd@alterway.fr', description: 'Global infrastructure view', requiresAuth: true },
    children: [
      {
        path: 'home',
        alias: '',
        component: () => import('./views/Home.vue'),
        name: 'Overall',
        meta: { description: 'Global infrastructure view', requiresAuth: true },
      },
      {
        path: 'namespaces',
        component: () => import('./views/Namespaces.vue'),
        name: 'Namespaces',
        meta: { description: 'Detailled view of namespaces', requiresAuth: true }
      },
      
      {
        path: 'nodes',
        component: () => import('./views/Nodes.vue'),
        name: 'Nodes',
        meta: { description: 'Detailled view of nodes', requiresAuth: true }
      },
      {
        path: 'pods',
        component: () => import('./views/Pods.vue'),
        name: 'pods',
        meta: { description: 'Detailled view of pods', requiresAuth: true }
      },
      {
        path: 'configuration',
        component: () => import('./views/Configuration.vue'),
        name: 'Configuration',
        meta: { description: 'Detailled view of metrics and pricing rulesets', requiresAuth: true }
      },
      {
        path: 'monitoring',
        component: () => import('./views/Monitoring.vue'),
        name: 'Monitoring',
        meta: { description: 'Graph view of prometheus query', requiresAuth: true }
      }
    ]
  },
  {
    path: '*',
    component: () => import('./components/404Layout.vue'),
  },   
  {
    path: '/login',
    component: () => import('./views/Login.vue'),
  }
]

const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (isAuth()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

Vue.use(Router)

export default router