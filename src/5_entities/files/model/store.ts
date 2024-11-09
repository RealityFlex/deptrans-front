import { createCrudStore } from '@/6_shared/store';
import { http } from '../api';

const namespace = 'files';

export const useFilesStore = createCrudStore<any>(
  namespace,
  http.files,
);