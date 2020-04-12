
export const routeTarget = {
    template: '<div>' +
        '<strong>Nom de la route {{$route.name}}</strong><br/>' +
        '<strong v-if="$route.meta.description">Description de la route {{$route.meta.description}}</strong>' +
        '</div>',
};

export const routes =   [
                {
                    path: 'home',
                    alias: '',
                    component: routeTarget,
                    name: 'Overall',
                    meta: { description: 'Global infrastructure view', requiresAuth: false },
                },
                {
                    path: 'namespaces',
                    component: routeTarget,
                    name: 'Slices',
                    meta: { description: 'Detailled view of slices', requiresAuth: false }
                },
                {
                    path: 'nodes',
                    component: routeTarget,
                    name: 'Nodes',
                    meta: { description: 'Detailled view of nodes', requiresAuth: false }
                },
                {
                    path: 'pods',
                    component: routeTarget,
                    name: 'Services',
                    meta: { description: 'Detailled view of services', requiresAuth: false }
                },
                {
                    path: 'configuration',
                    component: routeTarget,
                    name: 'Configuration',
                    meta: { description: 'Detailled view of metrics and pricing rulesets', requiresAuth: false }
                },
            ];