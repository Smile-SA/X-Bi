import Vue from 'vue'
import router from './router';
import VueSweetalert2 from 'vue-sweetalert2';
import DataTable from "@andresouzaabreu/vue-data-table";
import VueRangedatePicker from 'vue-rangedate-picker';
import AppComponent from './app/index.vue';
import VueFormGenerator from 'vue-form-generator'
import VueApexCharts from 'vue-apexcharts'
import card from './components/graphics/card';
import ApexCharts from '@/components/graphics/apexchart.js/apexcharts';
import selectOption from '@/components/Layout/selectOption';
Vue.component("VueApexCharts", VueApexCharts);
Vue.component("selectOption", selectOption);
Vue.component("ApexCharts", ApexCharts);
Vue.component("Card", card);
Vue.component("DataTable", DataTable);
Vue.component("vue-form-generator", VueFormGenerator.component);
Vue.use(VueSweetalert2);
Vue.component('Picker', VueRangedatePicker);
Vue.config.productionTip = false
Vue.config.devtools = false
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

