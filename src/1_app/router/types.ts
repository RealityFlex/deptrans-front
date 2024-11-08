/* eslint-disable no-unused-vars */
import type { VueElement } from 'vue';
import type { AppLayoutsEnum } from '@/1_app/layouts';

declare module 'vue-router' {
  interface RouteMeta {
    layout?: AppLayoutsEnum;
    layoutComponent?: VueElement;
  }
}

export const enum AppPages {
  home = 'HomePage',
  login = 'LoginPage',
}
