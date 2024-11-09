import { createCrudStore } from '@/6_shared/store';
import { http } from '../api';

const namespace = 'upload';

export const useUploadStore = createCrudStore<any>(
  namespace,
  http.upload,
);