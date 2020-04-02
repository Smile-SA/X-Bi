import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
window.jQuery = require('jquery')
window.$ = require('jquery')
import SidebarMenu from '../src/components/partials/SidebarMenu';

export default {
    title: 'SidebarMenu',
    component: SidebarMenu,
};

export const Side = () => ({
    components: { SidebarMenu },
    template: '<SidebarMenu @click="action"></SidebarMenu>',
    methods: { action: action('clicked') },
});
