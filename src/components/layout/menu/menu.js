import * as configurationsController from "../../../controller/configurationsController.js";

var uiConfigurations = JSON.parse(window.sessionStorage.getItem('uiConfigurations'))
import {logOut} from "../../../controller/authController";
import $ from "jquery";

export default {
    name: 'menu-layout',
    components: {},
    props: [],
    data() {
        return {
            tenant: window.sessionStorage.getItem('tenant'),
            image: 'https://images.theconversation.com/files/350865/original/file-20200803-24-50u91u.jpg?ixlib=rb-1.1.0&rect=37%2C29%2C4955%2C3293&q=45&auto=format&w=926&fit=clip',
            email: 'rnd@alterway.fr',
            isActive: {},
            show: {},
            menus: null,
            variableToWatch: uiConfigurations
        }
    },
    computed: {},
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
        logoutUser() {
            logOut();
        },
        reduceMenu(){
            if ($( "body" ).hasClass('sidebar-icon-only')) {
                $( "body" ).removeClass( 'sidebar-icon-only');
            } else {
                $( "body" ).addClass( 'sidebar-icon-only');
            }
        },
    },
    async beforeMount() {
        await this.getMenus();
        await this.sunMenu();
        this.$forceUpdate();
    }
}


