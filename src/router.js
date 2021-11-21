import Vue from 'vue'
import Router from 'vue-router'
import { needAuth } from './utils'

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
        component: () => import('./views/Home/index.vue'),
        name: 'Overall',
        meta: { description: 'Global infrastructure view', requiresAuth: true },
      },
      {
        path: 'namespaces',
        component: () => import('./views/Namespaces/index.vue'),
        name: 'Namespaces',
        meta: { description: 'Detailled view of namespaces', requiresAuth: true }
      },
      
      {
        path: 'nodes',
        component: () => import('./views/Nodes/index.vue'),
        name: 'Nodes',
        meta: { description: 'Detailled view of nodes', requiresAuth: true }
      },
      {
        path: 'pods',
        component: () => import('./views/Pods/index.vue'),
        name: 'pods',
        meta: { description: 'Detailled view of pods', requiresAuth: true }
      },
      {
        path: 'configuration',
        component: () => import('./views/Configuration/index.vue'),
        name: 'Configuration',
        meta: { description: 'Detailled view of metrics and pricing rulesets', requiresAuth: true }
      },
      {
        path: 'monitoring',
        component: () => import('./views/Monitoring/index.vue'),
        name: 'Monitoring',
        meta: { description: 'Graph view of prometheus query', requiresAuth: true }
      },
      {
        path: 'workflow',
        component: () => import('./views/Workflow/index.vue'),
        name: 'Xorkflow',
        meta: { description: 'Graph view of workflow query', requiresAuth: true }
      },
      {
        path: 'card',
        component: () => import('./components/card/index.vue'),
        name: 'Xorkflow',
        meta: { description: 'Graph view of workflow query', requiresAuth: true }
      }
    ]
  },
  {
    path: '*',
    component: () => import('./components/404Layout.vue'),
  },   
  {
    path: '/login',
    component: () => import('./views/Login/index.vue'),
  },

]

const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    needAuth().then(r => {
      if (r.results === '') { // User is not logged in
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    })
  } else {
    next()
  }
})

Vue.use(Router)

export default router