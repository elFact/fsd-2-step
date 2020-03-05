import './js/common'
import './content/website_pages/main.scss'
// примеры подключения библиотек
// import 'vue' - поиск идет в начальной директории, затем в note_modules
// import 'bootstrap/dist/css/bootstrap.min.css' - для подключения какого то небольшого участка
// import Vue from 'vue' - подключение для непосрдственного использования в этом скрипте
// Vue.use() - пример использования
window.Vue = require('vue') // - "подвешивание в окне" на примере vue
import store from './store'
Vue.component('example-component', require('./components/Example.vue').default)

const app = new Vue({
  data (){
    return {
      component: false,
    }
  },
  store,
  el: '#app'
})