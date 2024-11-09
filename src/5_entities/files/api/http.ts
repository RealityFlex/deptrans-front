import axiosInstance from '@/1_app/api/axios';
import { FilesRepository } from './repository';

const filesUrl = 'files';

export const http = {
  files: new FilesRepository(filesUrl, axiosInstance),
};
