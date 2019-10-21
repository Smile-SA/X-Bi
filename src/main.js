import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'highlight.js/styles/default.css';
import VueRangedatePicker from 'vue-rangedate-picker'
import { VueContext } from 'vue-context'

import VueHighlightJS from 'vue-highlight.js';
import yaml_highlight from 'highlight.js/lib/languages/yaml.js';
import jsyaml from 'js-yaml'

Vue.use(jsyaml)
Vue.use(VueHighlightJS, {languages: {yaml_highlight}})
Vue.config.productionTip = false

Vue.component('VueContext', VueContext)
Vue.component('VueRangedatePicker', VueRangedatePicker)
window.jQuery = require('jquery')
window.$ = require('jquery')

// eslint-disable-next-line no-unexpected-multiline
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  components: { }
});

