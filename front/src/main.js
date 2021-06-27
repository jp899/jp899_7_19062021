import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Import modules boostrapvue et icones bootstrap
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

createApp(App).use(store).use(router).use(BootstrapVue).use(IconsPlugin).mount('#app')
