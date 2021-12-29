import Vue from 'vue'

import router from './router';
import AppComponent from './app/index.vue';
import VueRangedatePicker from 'vue-rangedate-picker';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/mode/javascript/javascript.js';

Vue.config.productionTip = false
Vue.config.devtools = false
Vue.component('VueRangedatePicker', VueRangedatePicker);
new Vue({
    router,
    render: h => h(AppComponent)
}).$mount('#app');
