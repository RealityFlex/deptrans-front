import type { RouteLocationNormalized } from 'vue-router';
import { AppLayoutsEnum, AppLayoutComponentMap } from '@/1_app/layouts';

/**
 * source: https://www.youtube.com/watch?v=C5VIL2yyzVQ
 */
export async function layoutMiddleware(
  route: RouteLocationNormalized,
): Promise<void> {
  const { layout } = route.meta;
  const normalizedLayoutName: AppLayoutsEnum = layout || AppLayoutsEnum.default;
  const fileName = AppLayoutComponentMap[normalizedLayoutName];
  const fileNameWithoutExtension = fileName.split('.vue')[0];

  const component = await import(
    `../../layouts/ui/${fileNameWithoutExtension}.vue`
  );
  route.meta.layoutComponent = component.default;
}
