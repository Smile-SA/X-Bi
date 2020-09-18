import { action } from '@storybook/addon-actions';
import StoryRouter from 'storybook-vue-router';

import Sidebar from '../src/components/partials/Sidebar';
import {routes} from "./routes";
import {text, withKnobs} from "@storybook/addon-knobs";

export default {
    title: 'Navigation',
    component: Sidebar,
    decorators: [withKnobs, StoryRouter(
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

export const Side = () => ({
    components: { Sidebar },
    template: '<div><sidebar @click="action" style="text-centered" :display-name="name" :email="mail" />' +
        '<router-view/></div>',
    props: {
        name: {
            type: String,
            default: text('name', 'Name'),
        },
        mail: {
            type: String,
            default: text('mail', 'mail@alterway.fr'),
        },
    },
});

