import { ref, computed } from 'vue';
import { createCrudStore } from '@/6_shared/store';
import { http } from '../api';
import { defineStore } from 'pinia';

const namespace = 'version';

export const useVersionStore = createCrudStore<any>(
  namespace,
  http.version,
);

export const useVersionControlStore = defineStore(
  'version_control', () => {
    const currentVersion = ref();

    const changeVersion = (version: string) => {
      currentVersion.value = version;
    }


    return {
      currentVersion,
      changeVersion
    }
  }
)