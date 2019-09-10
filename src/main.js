import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import store from './store'

import VueRangedatePicker from 'vue-rangedate-picker'
import { VueContext } from 'vue-context'

Vue.config.productionTip = false

Vue.component('VueContext', VueContext)
Vue.component('VueRangedatePicker', VueRangedatePicker)
window.jQuery = require('jquery')

// eslint-disable-next-line no-unexpected-multiline
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  components: { }
});

