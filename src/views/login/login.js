import {logIn} from "../../controller/authController";
import * as uiConfigurations from "../../uiConfigurations.json";
let apiInfo = uiConfigurations.apiInfo;
export default {
    name: 'login',
    components: {},
    props: [],
    data() {
        return {
            message: "", showError: false,
        }
    }, computed: {}, mounted() {

    }, methods: {
        loginUser(e) {
            this.showError = false;
            e.preventDefault();
            logIn(this.$refs.form.username.value, this.$refs.form.password.value).then((data) => {
                if (data.login) {
                    this.$refs.form.username.value = '';
                    this.$refs.form.password.value = '';
                    this.$router.push(apiInfo.redirectAfterLogin);
                } else {
                    this.message = data.message;
                    this.showError = true;
                }
            });
        }, password: function () {
            return (apiInfo.password)
        }
    }
}


