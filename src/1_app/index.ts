import '@/1_app/styles/index.scss';

import { setFormLocale } from '@/1_app/config/locale';
import { router } from '@/1_app/router';
import { store } from '@/1_app/store';

import { createApp } from 'vue';
import App from './App.vue';

setFormLocale();

export const application = createApp(App).use(router).use(store);
