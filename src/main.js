import Vue from 'vue'
import App from './App.vue'
import store from './store'

import axios from 'axios'
import VueAxios from 'vue-axios'

import Vuetify from 'vuetify/lib'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)

Vue.use(Vuetify)

new Vue({
  store,
  render: h => h(App),
  vuetify: new Vuetify()
}).$mount('#app')
