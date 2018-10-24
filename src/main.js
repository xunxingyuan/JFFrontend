import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets



import App from './App.vue'
import router from './router'
import store from './store/index'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/main.less' // global css


Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
