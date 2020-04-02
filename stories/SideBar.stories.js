import { action } from '@storybook/addon-actions';
//import { linkTo } from '@storybook/addon-links';

import Sidebar from '../src/components/partials/Sidebar';

export default {
    title: 'sidebar',
    component: Sidebar,
};

export const Side = () => ({
    components: { Sidebar },
    template: '<sidebar @click="action" style="text-centered" :display-name="\'Admin\'" :email="\'rnd@alterway.fr\'" />',
    methods: { action: action('clicked') },
});

