import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

import { layoutMiddleware, authMiddleware } from './middleware';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(authMiddleware);
router.beforeEach(layoutMiddleware);
