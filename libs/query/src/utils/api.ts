import axios from 'axios';
import { useAuthStore } from '../lib/auth';

const baseURL = process.env['NEXT_PUBLIC_API_HOST_URL'];

const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

// set bearer token
api.interceptors.request.use(
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

export default api;
