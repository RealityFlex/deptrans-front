import { CrudRepository } from '@/6_shared/api/crud';
import type { AxiosInstance } from 'axios';

export class UploadRepository extends CrudRepository<any> {
  constructor(endpoint: string, axiosInstance: AxiosInstance) {
    super(endpoint, axiosInstance);
  }
}
