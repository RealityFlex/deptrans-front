import axiosInstance from '@/1_app/api/axios';
import { RoutesRepository } from './repository';

const routesUrl = 'get_routes';

export const http = {
  routes: new RoutesRepository(routesUrl, axiosInstance),
};
