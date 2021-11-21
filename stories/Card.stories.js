import Card from '../src/components/card/index.vue';
import {
    withKnobs,
    object,
} from '@storybook/addon-knobs';
import StoryRouter from "storybook-vue-router";
import {routeTarget} from "./routes";

export default {
    title: 'Card',
    component: Card,
    decorators: [withKnobs, StoryRouter(
        {},
        {
            routes: [
                {
                    path: '/home',
                    component: routeTarget,
                    name: 'Overall',
                    meta: { description: 'Global infrastructure view', requiresAuth: false }
                },
                {
                    path: '/pods',
                    component: routeTarget,
                    name: 'Pods',
                    meta: { description: 'Detailled Pods', requiresAuth: false }
                }
            ]}
    )]
};
const defaultCardValue = {
    label: 'label',
    value: 15,
    color: "blue",
    icon: "fas fa-address-book",
    link: "/home"
}
export const CardComponent = () => ({
    components: { Card },
    props: {
        configuration: {
            type: Object,
            default: object('configuration', defaultCardValue),
        },
    },
    template: '<div>' +
        '<card :configuration="configuration" />' +
        '<router-view/>' +
        '</div>',
});
