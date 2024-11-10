import axiosInstance from '@/1_app/api/axios';
import { RaportRepository } from './repository';

const raportUrl = 'get_raport';

export const http = {
  raport: new RaportRepository(raportUrl, axiosInstance),
};
