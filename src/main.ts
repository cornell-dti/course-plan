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
    // Analytics are anonymous per our privacy policy: never create person profiles
    // or link events to a student's account, and keep on-screen text (names,
    // emails, course plans) out of autocapture and session recordings.
    person_profiles: 'never',
    mask_all_text: true,
    mask_all_element_attributes: true,
    disable_session_recording: true,
    // Exception messages can contain Firestore document paths, which are keyed by
    // student email, so never send exceptions (this also overrides the project's
    // remote "exception autocapture" setting).
    capture_exceptions: false,
    // The router sends $pageview after each successful navigation (src/router/index.ts).
    capture_pageview: false,
    logs: {
      serviceName: 'courseplan-web',
      environment: import.meta.env.MODE,
    },
  });
  // Dev, staging and prod share one PostHog project; tag events so they can be filtered.
  posthog.register({ environment: import.meta.env.MODE });
} else if (import.meta.env.DEV) {
  const missingVariable = posthogProjectToken ? 'VITE_POSTHOG_HOST' : 'VITE_POSTHOG_PROJECT_TOKEN';
  throw new Error(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  );
}

let wasSignedIn = false;

// handle page reloads
let app: VueApp | undefined;
auth.onAuthStateChanged(user => {
  // We intentionally never call posthog.identify(). On sign-out, rotate the
  // anonymous ID so the next person on a shared device isn't grouped with the last.
  if (isPostHogConfigured && wasSignedIn && !user) {
    posthog.reset();
  }
  wasSignedIn = Boolean(user);

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
