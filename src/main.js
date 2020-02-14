import Vue from 'vue';

import BootstrapVue from 'bootstrap-vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import App from './App';
import router from './router/index';
import store from './store';
import './assets/scss/app.scss';

const fb = require('./firebaseConfig.js');

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

// handle page reloads
let app;
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


// Code to query the database for data collection
