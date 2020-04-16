import { action } from '@storybook/addon-actions';
window.jQuery = require('jquery');
window.$ = require('jquery');
import SidebarMenu from '../src/components/partials/SidebarMenu';
import StoryRouter from "storybook-vue-router";
import {routes} from "./routes";

export default {
    title: 'Navigation',
    component: SidebarMenu,
    decorators: [StoryRouter(
        {},
        {
            routes: [
                {
                    path: '/',
                    name: 'Admin',
                    meta: { email: 'rnd@alterway.fr', description: 'Global infrastructure view', requiresAuth: false },
                    children: routes
                }
            ]}
    )]
};

export const SideBar = () => ({
    components: { SidebarMenu },
    template: '<div>' +
        '<SidebarMenu @click="action"></SidebarMenu>' +
        '<router-view/>' +
        '</div>',
    methods: { action: action('clicked') },
});
