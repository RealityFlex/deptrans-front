import { ref, computed } from 'vue';
import { createCrudStore } from '@/6_shared/store';
import { http } from '../api';
import { defineStore } from 'pinia';

const namespace = 'raport';

export const useRaportStore = createCrudStore<any>(
  namespace,
  http.raport,
);