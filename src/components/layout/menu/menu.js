import {logOut} from "../../../controller/authController";
import $ from "jquery";

export default {
    name: 'menu-layout',
    components: {},
    props: ["xBiInfo", "user", "isActive", "show", "menus"],
    computed: {},
    methods: {
        logoutUser() {
            logOut();
        },
        reduceMenu() {
            if ($("body").hasClass('sidebar-icon-only')) {
                $("body").removeClass('sidebar-icon-only');
            } else {
                $("body").addClass('sidebar-icon-only');
            }
        },
    },
    async beforeMount() {
        this.$forceUpdate();
    },
    mounted() {
        this.$emit('rendered');
    }
}