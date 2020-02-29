import Vue from 'vue';
import Router from 'vue-router';
import firebase from 'firebase/app';

import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import Settings from '@/components/Settings';

Vue.use(Router);

const baseURL = process.env.BASE_URL;

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: `${baseURL}/login`,
      name: 'Login',
      component: Login
    },
    {
      path: `${baseURL}/`,
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: `${baseURL}/settings`,
      name: 'Settings',
      component: Settings,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: `${baseURL}/*`,
      redirect: `${baseURL}/`
    }
  ]
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
