import Vue from 'vue'
import router from './router';
import VueSweetalert2 from 'vue-sweetalert2';
import DataTable from "@andresouzaabreu/vue-data-table";
import VueRangedatePicker from 'vue-rangedate-picker';
import AppComponent from './app/index.vue';
import VueFormGenerator from 'vue-form-generator'
import VueApexCharts from 'vue-apexcharts'
import card from './components/graphics/card';
import ApexCharts from './components/graphics/apexcharts';
import selectOption from './components/Layout/selectOption';

import {library} from '@fortawesome/fontawesome-svg-core';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

library.add(fas);
Vue.component("VueApexCharts", VueApexCharts);
Vue.component("selectOption", selectOption);
Vue.component("ApexCharts", ApexCharts);
Vue.component("Card", card);
Vue.component("DataTable", DataTable);
Vue.component("vue-form-generator", VueFormGenerator.component);
Vue.use(VueSweetalert2);
Vue.component('Picker', VueRangedatePicker);
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.config.productionTip = false
Vue.config.devtools = false
new Vue({
    router,
    render: h => h(AppComponent)
}).$mount('#app');

import 'font-awesome/css/font-awesome.css'
import 'font-awesome/css/font-awesome.min.css'
import 'font-awesome/scss/font-awesome.scss'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/eclipse.css';
import "@andresouzaabreu/vue-data-table/dist/DataTable.css";
import '../public/vendors/mdi/css/materialdesignicons.min.css';
import '../public/vendors/css/vendor.bundle.base.css';
import '../public/css/style.css';
import '../public/css/sass.scss';
import 'codemirror/mode/javascript/javascript.js';

