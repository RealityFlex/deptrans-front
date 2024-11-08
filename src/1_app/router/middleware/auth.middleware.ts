import {
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from 'vue-router';
import { AuthModel } from '@/5_entities/auth';
import { AppPages } from '../types';

export const authMiddleware = async (
  to: RouteLocationNormalized,
  _: RouteLocationNormalized,
  next: NavigationGuardNext,
): Promise<void> => {
  const userStore = AuthModel.useAuthStore();

  if (!userStore.isAuthorized && to.query.logout !== 'true') {
    console.log('Fetching user...');
  }

  if (userStore.isAuthorized && to.name === AppPages.login) {
    return next({
      name: AppPages.home,
    });
  }
  if (to.meta.authRequired) {
    if (!userStore.isAuthorized && to.path !== '/login') {
      return next({
        name: AppPages.login,
      });
    }
  }
  return next();
};
