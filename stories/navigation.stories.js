import menuLayout from '../src/components/layout/menu';
import headerLayout from '../src/components/layout/header';
import footerLayout from '../src/components/layout/footerLayout';
import titleBoxLayout from '../src/components/layout/titleBox';
import {object, withKnobs} from "@storybook/addon-knobs";
import * as configurationsController from "../src/controller/configurationsController";
import StoryRouter from "storybook-vue-router";

export default {
    title: 'Navigation',
    decorators: [withKnobs, StoryRouter(
        {},
    )]
};

export const SideMenu = () => ({
    props: {
        user: {
            type: Object,
            default: object('user', {
                username: 'rnd',
                email: 'rnd@smile.fr',
                image: "https://images.theconversation.com/files/350865/original/file-20200803-24-50u91u.jpg?ixlib=rb-1.1.0&rect=37%2C29%2C4955%2C3293&q=45&auto=format&w=926&fit=clip"
            }),
        },
        menus: {
            type: Array,
            default: object('menus', [
                {
                    description: "Cities view",
                    display: true,
                    displayInMenu: true,
                    icon: "fa-house-chimney-window",
                    name: "Cities",
                    path: "/",
                    requiresAuth: true,
                    structure: Object
                },
                {
                    description: "Detailed view of city information",
                    display: true,
                    displayInMenu: true,
                    icon: "fa-tree-city",
                    name: "City",
                    path: "/city",
                    requiresAuth: true,
                    structure: Object
                }
            ])
        },
        xBiInfo: {
            type: Object,
            default: object('xBiInfo', configurationsController.getXBiInfo()),
        },
        isActive: {},
        show: {},
    },

    components: {menuLayout},
    template: '<div>' +
        '<menuLayout :menus="menus" :user="user" :xBiInfo="xBiInfo"  :isActive="isActive" :show="show" ></menuLayout>' +
        '</div>',
    methods: {},
});
export const Header = () => ({
    props: {
        user: {
            type: Object,
            default: object('user', {
                username: 'rnd',
                email: 'rnd@smile.fr',
                image: "https://images.theconversation.com/files/350865/original/file-20200803-24-50u91u.jpg?ixlib=rb-1.1.0&rect=37%2C29%2C4955%2C3293&q=45&auto=format&w=926&fit=clip"
            }),
        },
    },

    components: {headerLayout},
    template: '<div>' +
        '<header-layout :user="user"></header-layout>' +
        '</div>',
    methods: {},
});
export const Footer = () => ({
    props: {
        footer: {
            type: Object,
            default: object('footer', {
                madeBy: "Smile R&D",
                for: "a better dashboards configuration",
                site: {
                    name: 'SMILE',
                    url: 'https://www.smile.fr/'
                },
                blog: {
                    name: 'BLOG',
                    url: 'https://blog.smile.eu/fr/'
                }
            }),
        },
    },
    components: {footerLayout},
    template: '<div>' +
        '<footer-layout :footer="footer"></footer-layout>' +
        '</div>',
    methods: {},
});
export const TitleBox = () => ({
    props: {
        icon: {
            type: String,
            default: object('icon','fa-plus')
        },
        description: {
            type: String,
            default: object('description','description of view')
        },
        that: {
            type: Object,
            default: object('that',{hover :true})
        },
    },
    components: {titleBoxLayout},
    template: '<div class="container-sm m-0 ms-2 p-3">' +
        '<titleBoxLayout :that="that" :icon="icon" :description="description"></titleBoxLayout>' +
        '</div>',
    methods: {},
});
