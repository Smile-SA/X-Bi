import DashLayout from '../src/components/DashLayout';
import {storiesOf} from "@storybook/vue";
import StoryRouter from 'storybook-vue-router';
import {
    withKnobs,
    text
} from '@storybook/addon-knobs';
import {routes} from "./routes";

export default {
    title: 'Navigation',
    component: DashLayout,
    decorators: [withKnobs, StoryRouter(
        {},
        {
            routes: [
                {
                    path: '/',
                    children: routes
                }
            ]}
    )]
};

export const knobs = () => ({
    components: { DashLayout },
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
    template: `<dash-layout :email="mail" :display-name="name"/>`
});
