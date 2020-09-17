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
          name: 'Namespaces',
          meta: { description: 'Detailled view of namespaces', requiresAuth: false }
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
          name: 'pods',
          meta: { description: 'Detailled view of pods', requiresAuth: false }
        },
        {
          path: 'configuration',
          component: () => import('./views/Configuration.vue'),
          name: 'Configuration',
          meta: { description: 'Detailled view of metrics and pricing rulesets', requiresAuth: false }
        },
        // {
        //   path: 'workflow',
        //   component: () => import('./views/Workflow.vue'),
        //   name: 'Workflow',
        //   meta: { description: 'Workflow configuration', requiresAuth: false }
        // },
        {
          path: 'monitoring',
          component: () => import('./views/Monitoring.vue'),
          name: 'Monitoring',
          meta: { description: 'Graph view of prometheus query', requiresAuth: false }
        }
      ]
    },
   
    {
      path: '*',
      component: () => import('./components/404Layout.vue'),
    },   
    
    {
          path: '/login',
          component: () => import('./views/login.vue'),
                 }
]
})
