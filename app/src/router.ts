import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Index from '~/index.vue';
import { AuthService, isAuthenticated } from '~/auth/oidc.auth';
import LoginPage from '~/page/login.vue';
import { h, watch } from 'vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: {
      public: true,
    },
  },
  {
    path: '/auth/oidc/callback',
    name: 'auth-callback',
    beforeEnter: (_, __, next) => {
      AuthService.logoutPopupCallback();
      AuthService.loginSilentCallback();
      AuthService.loginCallbackPopup();
      next(import.meta.env.BASE_URL);
    },
    component: h('div'),
    meta: {
      public: true,
    },
  },
  {
    path: '/',
    name: 'index',
    component: Index,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, _, next) => {
  if (!to.meta.public) {
    if (to.name !== 'login' && !isAuthenticated.value) next({ name: 'login' });
  }

  if (to.name === 'login' && isAuthenticated.value) next({ name: 'index' });
  next();
});

watch(isAuthenticated, (val) => {
  if (!val) router.replace({ name: 'login' });
});

export default router;
