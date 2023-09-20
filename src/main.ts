import { createApp, App as VueApp } from 'vue';

import VueGtag from 'vue-gtag-next';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'intro.js/introjs.css';
import './assets/scss/introjs.scss';
import './assets/scss/app.scss';

import App from './App.vue';
import router from './router/index';
import store from './store';


import { auth } from './firebase-config';
import { registerGateKeeper } from './feature-flags';

// handle page reloads
let app: VueApp | undefined;
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);
    app.use(router);
    // Enable Google analytics with custom events
    app.use(VueGtag, {
      property: { id: 'G-BQ6CTZQPSF' },
    });
    app.use(store);
    app.mount('#app');
  }
});

registerGateKeeper();
