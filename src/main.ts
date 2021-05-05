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

import * as fb from './firebaseConfig';

// handle page reloads
let app: VueApp | undefined;
fb.auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);
    app.use(router);
    // Enable Google analytics with custom events
    app.use(VueGtag, {
      property: { id: 'UA-124837875-2' },
    });
    app.use(store);
    app.mount('#app');
  }
});
