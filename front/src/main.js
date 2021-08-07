// import { createApp } from 'vue'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// font-awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCommentDots as fasCommentDots } from '@fortawesome/free-solid-svg-icons'
import { faCommentDots as farCommentDots } from '@fortawesome/free-regular-svg-icons'
import { faThumbsUp as fashumbsUp } from '@fortawesome/free-solid-svg-icons'
import { faThumbsUp as farhumbsUp } from '@fortawesome/free-regular-svg-icons'
import { faThumbsDown as fashumbsDown } from '@fortawesome/free-solid-svg-icons'
import { faThumbsDown as farhumbsDown } from '@fortawesome/free-regular-svg-icons'
import { faComments as fasComments } from '@fortawesome/free-solid-svg-icons'
import { faComments as farComments } from '@fortawesome/free-regular-svg-icons'
import { faEdit as fasEdit } from '@fortawesome/free-solid-svg-icons'
import { faEdit as farEdit } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(farCommentDots, fasCommentDots, fashumbsUp, farhumbsUp, fashumbsDown, farhumbsDown, fasEdit, farEdit, fasComments, farComments)

Vue.component('font-awesome-icon', FontAwesomeIcon)

// Import modules boostrapvue et icones bootstrap
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
// Import d'un scss perso qui définit des couleurs et modifie le thème bootstrap avant d'en charger le CSS
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
  },
}).$mount('#app')