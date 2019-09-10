import Vue from 'vue'
import Router from 'vue-router'

import DashLayout from './components/DashLayout.vue'

import HomeView from './views/Home.vue'
import NodesView from './views/Nodes.vue'
import NamespacesView from './views/Namespaces.vue'
import PodsView from './views/Pods.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: DashLayout,
      children: [
        {
          path: 'home',
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
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
