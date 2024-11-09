import axiosInstance from '@/1_app/api/axios';
import { VersionRepository } from './repository';

const versionUrl = 'folders';

export const http = {
  version: new VersionRepository(versionUrl, axiosInstance),
};
