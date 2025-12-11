import axios from 'axios';

export const getAiApi = (baseURL: string) => {
  return axios.create({
    baseURL,
    headers: {
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
