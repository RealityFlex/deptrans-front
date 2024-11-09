import axiosInstance from '@/1_app/api/axios';
import { UploadRepository } from './repository';

const uploadUrl = 'upload_files';

export const http = {
  upload: new UploadRepository(uploadUrl, axiosInstance),
};
