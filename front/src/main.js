// import { createApp } from 'vue'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Import modules boostrapvue et icones bootstrap
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/styles/custom.scss'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)


new Vue({
  router,
  store,
  render: h => h(App),
  created(){
    const html = document.documentElement;
    html.setAttribute('lang', 'fr');
  }
}).$mount('#app')