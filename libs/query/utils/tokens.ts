// variable name for  tokens
const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

// operation for access token
const accessToken = {
  get: () => localStorage.getItem(ACCESS_TOKEN),
  set: (token: string) => localStorage.setItem(ACCESS_TOKEN, token),
  remove: () => localStorage.removeItem(ACCESS_TOKEN),
};

export { accessToken };
