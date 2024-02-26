import axios from 'axios';
import { useAuthStore } from '../lib/auth';

const baseURL = process.env['NEXT_PUBLIC_API_HOST_URL'];

export const createApiInstance = (baseURL: string, appId?: string) => {
  const apiInstance = axios.create({
    baseURL,
    headers: {
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      appId,
    },
  });
  // d8e29ab6-6876-43e4-9de1-e2e0d49d32cf

  // Set bearer token using interceptors
  apiInstance.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return apiInstance;
};
