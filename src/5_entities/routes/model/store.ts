import { createCrudStore } from '@/6_shared/store';
import { http } from '../api';

const namespace = 'get_routes';

export const useRoutesStore = createCrudStore<any>(
  namespace,
  http.routes,
);