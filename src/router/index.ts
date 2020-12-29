import Vue from 'vue';
import Router from 'vue-router';
import firebase from 'firebase/app';

import Login from '@/containers/Login.vue';
import Dashboard from '@/containers/Dashboard.vue';
import Page404 from '@/containers/404.vue';

Vue.use(Router);

const baseURL = process.env.BASE_URL;

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: `${baseURL}/login`,
      name: 'Login',
      component: Login,
    },
    {
      path: `${baseURL}/`,
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: `${baseURL}/*`,
      name: '404',
      component: Page404,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const { matched } = to;
  if (matched.length === 0) {
    next(baseURL);
    return;
  }

  const requiresAuth = matched.some(x => x.meta.requiresAuth);
  const { currentUser } = firebase.auth();

  if (requiresAuth && !currentUser) {
    next(`${baseURL}/login`);
  } else if (requiresAuth && currentUser) {
    next();
  } else {
    next();
  }
});

export default router;
