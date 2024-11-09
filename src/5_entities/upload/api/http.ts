import axiosInstance from '@/1_app/api/axios';
import { UploadRepository } from './repository';

const uploadUrl = 'upload-files';

export const http = {
  uploadFiles: new UploadRepository(uploadUrl, axiosInstance),
};
