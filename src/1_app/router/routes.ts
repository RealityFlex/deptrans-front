import { AppLayoutsEnum } from '@/1_app/layouts';
import type { RouteRecordRaw } from 'vue-router';
import { AppPages } from './types';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)*',
    redirect: { name: AppPages.home },
  },
  {
    name: AppPages.home,
    path: '/',
    component: () => import('@/2_pages/home'),
    meta: {
      layout: AppLayoutsEnum.default,
      authRequired: true,
    },
  },
  {
    name: AppPages.login,
    path: '/login',
    component: () => import('@/2_pages/login'),
    meta: {
      layout: AppLayoutsEnum.login,
    },
  },
];

export default routes;
