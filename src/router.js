import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: () => import('./components/DashLayout.vue'),
      children: [
        {
          path: 'home',
          alias: '',
          component: () => import('./views/Home.vue'),
          name: 'Overall',
          meta: { description: 'Global infrastructure view', requiresAuth: false },
        },
        {
          path: 'namespaces',
          component: () => import('./views/Namespaces.vue'),
          name: 'Slices',
          meta: { description: 'Detailled view of slices', requiresAuth: false }
        },
        {
          path: 'nodes',
          component: () => import('./views/Nodes.vue'),
          name: 'Nodes',
          meta: { description: 'Detailled view of nodes', requiresAuth: false }
        },
        {
          path: 'pods',
          component: () => import('./views/Pods.vue'),
          name: 'Services',
          meta: { description: 'Detailled view of services', requiresAuth: false }
        },
        {
          path: 'configuration',
          component: () => import('./views/Configuration.vue'),
          name: 'Configuration',
          meta: { description: 'Detailled view of metrics and pricing rulesets', requiresAuth: false }
        },
        {
          path: 'workflow',
          component: () => import('./views/Workflow.vue'),
          name: 'Workflow',
          meta: { description: 'Workflow definition and consultation', requiresAuth: false }
        }
      ]
    },
    {
      path: '*',
      component: () => import('./components/404Layout.vue'),
    }
  ]
})
