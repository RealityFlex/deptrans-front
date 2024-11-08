import { defineStore } from 'pinia';
import { ref } from 'vue';

const namespace = 'auth';

export const useAuthStore = defineStore(
  namespace,
  () => {
    const isAuthorized = ref(true);

    return {
      isAuthorized,
    };
  },
  { persist: true },
);
