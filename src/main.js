import Vue from 'vue'

import router from './router';
import AppComponent from './app/index.vue';
import VueRangedatePicker from 'vue-rangedate-picker';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/eclipse.css';
import "../public/css/bootstrap.min.css";
import "../public/font-awesome/css/font-awesome.css";
import "../public/js/plugins/gritter/jquery.gritter.css";
import "../public/css/plugins/toastr/toastr.min.css";
import "../public/css/animate.css";
import "../public/css/style.css";
import 'codemirror/mode/javascript/javascript.js';

Vue.config.productionTip = false
Vue.config.devtools = false
Vue.component('VueRangedatePicker', VueRangedatePicker);
new Vue({
  router,
  render: h => h(AppComponent)
}).$mount('#app');
