import Vue from 'vue'
import Router from 'vue-router'

import DashLayout from './components/DashLayout.vue'
import NotFoundLayout from './components/404Layout.vue'

import HomeView from './views/Home.vue'
import NodesView from './views/Nodes.vue'
import NamespacesView from './views/Namespaces.vue'
import PodsView from './views/Pods.vue'
import MetricsView from './views/Metrics.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: DashLayout,
      children: [
        {
          path: 'home',
          alias: '',
          component: HomeView,
          name: 'Overall',
          meta: { description: 'Global infrastructure view', requiresAuth: false },
        },
        {
          path: 'namespaces',
          component: NamespacesView,
          name: 'Namespaces',
          meta: { description: 'Detailled view of namespaces', requiresAuth: false }
        },
        {
          path: 'nodes',
          component: NodesView,
          name: 'Nodes',
          meta: { description: 'Detailled view of nodes', requiresAuth: false }
        },
        {
          path: 'pods',
          component: PodsView,
          name: 'Pods',
          meta: { description: 'Detailled view of pods', requiresAuth: false }
        },
        {
          path: 'metrics',
          component: MetricsView,
          name: 'Metrics',
          meta: { description: 'Detailled view of metrics and pricing rulesets', requiresAuth: false }
        }
      ]
    },
    {
      path: '*',
      name: NotFoundLayout,
    }
  ]
})
