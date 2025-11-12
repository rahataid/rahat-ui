import axios from 'axios';

const aiBaseURL = process.env['NEXT_PUBLIC_AI_API_URL'];

const aiApi = axios.create({
  baseURL: aiBaseURL,
  headers: {
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

export { aiApi };
