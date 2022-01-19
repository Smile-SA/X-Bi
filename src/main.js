import Vue from 'vue'
import router from './router';
import VueSweetalert2 from 'vue-sweetalert2';
import DataTable from "@andresouzaabreu/vue-data-table";
import VueRangedatePicker from 'vue-rangedate-picker';
import AppComponent from './app/index.vue';
Vue.component("DataTable", DataTable);
Vue.use(VueSweetalert2);
Vue.config.productionTip = false
Vue.config.devtools = false
Vue.component('Picker', VueRangedatePicker);
new Vue({
    router,
    render: h => h(AppComponent)
}).$mount('#app');

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/eclipse.css';
import "@andresouzaabreu/vue-data-table/dist/DataTable.css";
import '../public/vendors/mdi/css/materialdesignicons.min.css';
import '../public/vendors/css/vendor.bundle.base.css';
import '../public/css/style.css';

import 'codemirror/mode/javascript/javascript.js';

