import Vue from 'vue'
import App from './App.vue'
import router from './router'

import VueRangedatePicker from 'vue-rangedate-picker'
import VueContext from 'vue-context'

Vue.config.productionTip = false

// eslint-disable-next-line no-unexpected-multiline
(async () => {
  Vue.component('VueRangedatePicker', VueRangedatePicker)
  Vue.component('VueContext', VueContext)
  
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
})()
  