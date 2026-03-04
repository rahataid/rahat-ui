import axios from 'axios';
import { useAuthStore } from '@rumsan/react-query/auth';

const version = '/v1';
const baseURL = process.env['NEXT_PUBLIC_API_HOST_URL'] + version;
const communicationURL = process.env['NEXT_PUBLIC_API_CAMPAIGN_URL'];
const appId = process.env['NEXT_PUBLIC_APP_ID'];

const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
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
  },
);

//api instance for communication
const communicationApi = axios.create({
  baseURL: communicationURL,
  headers: {
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    appId,
  },
});

// Set bearer token using interceptors
communicationApi.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export { api, communicationApi };
