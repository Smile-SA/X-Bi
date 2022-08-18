import * as configurationsController from "../../../controller/configurationsController.js";


export default {
    name: 'container',
    components: {
        SideMenu: () => import('../menu/index.vue'),
        HeaderLayout: () => import('../header/index.vue'),
        footerLayout: () => import('../footerLayout/index.vue'),
    },
    props: ['displayName', 'email'],
    data: function () {
        return {
            to: new Date().toISOString(),
            from: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
            classes: {
                fixed_layout: false,
                hide_logo: false
            },
            error: '',
            xBiInfo: configurationsController.getXBiInfo(),
            user: JSON.parse(window.sessionStorage.getItem('user')),
            isActive: {},
            show: {},
            menus: null,
            footer: {
                madeBy:"Smile R&D",
                for : "a better dashboards configuration",
                site: {
                    name: 'SMILE',
                    url: 'https://www.smile.fr/'
                },
                blog: {
                    name: 'BLOG',
                    url: 'https://blog.smile.eu/fr/'
                }
            }
        }
    },
    computed: {
        compDisplayName: function () {
            return this.$route.matched[0] && this.$route.matched[0].name ? this.$route.matched[0].name : this.displayName;
        },
        compEmail: function () {
            return this.$route.matched[0] && this.$route.matched[0].meta.email ? this.$route.matched[0].meta.email : this.email;
        }
    },
    methods: {
        async getMenus() {
            this.menus = await configurationsController.getMenus();
        },
        async sunMenu() {
            let a = {}, s = {};
            await Object.keys(this.menus).map((item) => {
                if (this.menus[item].children) {
                    a[this.menus[item].id] = false;
                    s[this.menus[item].id] = []
                    Object.keys(this.menus[item].children).map((subItem) => {
                        s[this.menus[item].id].push(this.menus[item].children[subItem].name);
                    });
                }
            });
            this.isActive = a;
            this.show = s;
        },
        changeloading() {
            this.$store.commit('TOGGLE_SEARCHING')
        },

    },
    async beforeMount() {
        await this.getMenus();
        await this.sunMenu();
    }
}
