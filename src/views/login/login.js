import {generateAPIUrl} from '@/settings/variables';
import {logIn} from "@/controller/authController";
import {goTo} from "@/settings/utils";

export default {
    name: 'login',
    components: {},
    props: [],
    data() {
        return {
            api: generateAPIUrl(),
            message: "",
            showError: false,
        }
    },
    computed: {},
    mounted() {

    },
    methods: {
        loginUser(e) {
            this.showError = false;
            e.preventDefault();
            logIn(this.$refs.form.tenant.value, this.$refs.form.password.value).then((data) => {
                if (data.login) {
                    this.$refs.form.tenant.value = '';
                    this.$refs.form.password.value = '';
                    goTo('/', this);
                } else {
                    this.message = data.message;
                    this.showError = true;
                }
            });
        },
        password: function () {
            return (`${this.api}/password`)
        },
        login: function () {
            return (`${this.api}/login_user`)
        },
        signup: function () {
            return (`${this.api}/signup`)
        }
    }
}


