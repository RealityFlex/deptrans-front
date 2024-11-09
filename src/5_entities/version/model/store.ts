import { createCrudStore } from '@/6_shared/store';
import { http } from '../api';

const namespace = 'version';

export const useVersionStore = createCrudStore<any>(
  namespace,
  http.version,
);