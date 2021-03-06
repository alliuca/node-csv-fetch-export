import Vue from 'vue';
import VueResource from 'vue-resource';
import App from './App.vue';

Vue.use(VueResource);

const app = new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
});