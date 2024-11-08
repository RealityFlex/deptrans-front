/* eslint-disable no-unused-vars */
export enum AppLayoutsEnum {
  default = 'default',
  login = 'login',
}

export const AppLayoutComponentMap: Record<AppLayoutsEnum, string> = {
  default: 'AppLayoutDefault.vue',
  login: 'AppLayoutLogin.vue',
};
