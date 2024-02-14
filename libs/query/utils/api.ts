import axios from 'axios';
import { accessToken } from './tokens';

const baseURL = process.env.API_URL;

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
    const token = accessToken.get(); //for local testing paste token from swagger here
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
