/* import used libraries */
import Vue from 'vue'
import router from './router';
import VueSweetalert2 from 'vue-sweetalert2';
import DataTable from "@andresouzaabreu/vue-data-table";
import VueRangedatePicker from 'vue-rangedate-picker';
import VueFormGenerator from 'vue-form-generator';
import VueFormulate from '@braid/vue-formulate';
import VueApexCharts from 'vue-apexcharts';
import VModal from "vue-js-modal";

/* import used components */
import AppComponent from './app/index.vue';
import card from './components/graphics/card';
import ApexCharts from './components/graphics/apexcharts';
import selectOption from './components/Layout/selectOption';

/* import fontawesome */
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {fas} from '@fortawesome/free-solid-svg-icons'



/* add icons to the library */
library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)

/* add components to vue*/
Vue.component("VueApexCharts", VueApexCharts);
Vue.component("selectOption", selectOption);
Vue.component("ApexCharts", ApexCharts);
Vue.component("Card", card);
Vue.component("DataTable", DataTable);
Vue.component("vue-form-generator", VueFormGenerator.component);
Vue.component('Picker', VueRangedatePicker);
Vue.component("font-awesome-icon", FontAwesomeIcon);

/* add use library to vue*/
Vue.use(VueSweetalert2);
Vue.use(VueFormulate);
Vue.use(VModal)
Vue.config.productionTip = false
Vue.config.devtools = false
new Vue({
    router,
    render: h => h(AppComponent)
}).$mount('#app');
/* import used css */

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/eclipse.css';
import '@fortawesome/fontawesome-free/css/all.css'
import "@andresouzaabreu/vue-data-table/dist/DataTable.css";
import '../public/vendors/mdi/css/materialdesignicons.min.css';
import '../public/vendors/css/vendor.bundle.base.css';
import '../public/css/style.css';
import '../public/css/sass.scss';
import '../public/css/vueFormulate.scss';


import 'codemirror/mode/javascript/javascript.js';
import '@fortawesome/fontawesome-free/js/all.js'
