import Vue from 'vue';
import Router from 'vue-router';
import firebase from 'firebase';

import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import Settings from '@/components/Settings';

Vue.use(Router);

const baseURL = process.env.BASE_URL;

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: `${baseURL}/`
    },
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
    }
  ]
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
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
