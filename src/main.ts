import Vue from 'vue';

import BootstrapVue from 'bootstrap-vue';
import VueGtag from 'vue-gtag';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import App from './App.vue';
import router from './router/index';
import store from './store';
import './assets/scss/app.scss';

import * as fb from './firebaseConfig';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

Vue.use(VueGtag, {
  config: { id: 'UA-124837875-2' }
});

// handle page reloads
let app: Vue | undefined;
fb.auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App)
    });
  }
});
