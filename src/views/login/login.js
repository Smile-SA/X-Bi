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

            if (apiInfo.dataType === 'static') {
                if (this.$refs.form.username.value === 'admin' && this.$refs.form.password.value === 'secret') {
                    window.sessionStorage.setItem('isLogin', true);
                    window.sessionStorage.setItem('user', JSON.stringify({username: 'rnd',email: 'rnd@smile.fr' , image: "https://images.theconversation.com/files/350865/original/file-20200803-24-50u91u.jpg?ixlib=rb-1.1.0&rect=37%2C29%2C4955%2C3293&q=45&auto=format&w=926&fit=clip"})) ;
                    window.sessionStorage.setItem('timestamp', Date.now());
                    window.sessionStorage.setItem('uiConfigurations', JSON.stringify(uiConfigurations));
                    this.$refs.form.username.value = '';
                    this.$refs.form.password.value = '';
                    this.$router.push(apiInfo.redirectAfterLogin);
                }
                else {
                    this.message = "Incorrect username or password.";
                    this.showError = true;
                }

                return;
            }
                        
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


