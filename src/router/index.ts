import { Router, createRouter, createWebHistory } from 'vue-router';

import Login from '@/containers/Login.vue';
import Dashboard from '@/containers/Dashboard.vue';
import Page404 from '@/containers/404.vue';
import Policy from '@/containers/Policy.vue';
import Analytics from '@/containers/Analytics.vue';
import store from '../store';
import { usePostHog } from '@/composables/usePostHog';

const router: Router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/policy',
      name: 'Policy',
      component: Policy,
    },
    {
      path: '/analytics',
      name: 'Analytics',
      component: Analytics,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: Page404,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const { matched } = to;

  const requiresAuth = matched.some(x => x.meta.requiresAuth);
  const { currentFirebaseUser } = store.state;

  if (requiresAuth && !currentFirebaseUser) {
    next('/login');
  } else if (requiresAuth && currentFirebaseUser) {
    next();
  } else {
    next();
  }
});

const { posthog } = usePostHog();

export default router;
