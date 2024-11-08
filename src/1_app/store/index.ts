import { createPinia } from 'pinia';
export const store = createPinia();
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
store.use(piniaPluginPersistedstate);
