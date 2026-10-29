import { createApp, App as VueApp } from 'vue';

import VueGtag from 'vue-gtag-next';
import posthog from 'posthog-js';

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

const posthogProjectToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;
const isPostHogConfigured = Boolean(posthogProjectToken && posthogHost);

if (posthogProjectToken && posthogHost) {
  posthog.init(posthogProjectToken, {
    api_host: posthogHost,
    person_profiles: 'identified_only',
    logs: {
      serviceName: 'courseplan-web',
      environment: import.meta.env.MODE,
    },
  });
} else if (import.meta.env.DEV) {
  const missingVariable = posthogProjectToken ? 'VITE_POSTHOG_HOST' : 'VITE_POSTHOG_PROJECT_TOKEN';
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

let posthogDistinctId: string | undefined;

// handle page reloads
let app: VueApp | undefined;
auth.onAuthStateChanged(user => {
  if (isPostHogConfigured) {
    if (user) {
      if (posthogDistinctId && posthogDistinctId !== user.uid) {
        posthog.reset();
      }

      posthog.identify(user.uid, {
        ...(user.email ? { email: user.email } : {}),
        ...(user.displayName ? { name: user.displayName } : {}),
      });
      posthogDistinctId = user.uid;
    } else if (posthogDistinctId) {
      posthog.reset();
      posthogDistinctId = undefined;
    }
  }

  if (!app) {
    app = createApp(App);
    app.config.errorHandler = error => {
      if (isPostHogConfigured) {
        posthog.captureException(error);
      }
    };
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
