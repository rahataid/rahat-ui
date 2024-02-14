import { useMutation } from '@tanstack/react-query';

import { LoginPayload, OTPPayload } from '@rahat-ui/types/auth.types';
import api from '../../utils/api';
import { accessToken } from '../../utils/tokens';
import { useAuthStore } from './auth-store';

const userLogin = async (payload: LoginPayload) => {
  const res = await api.post('/auth/login', payload);
  return res.data;
};

const useLogin = (options?: any) => {
  const token = useAuthStore((state) => state.token);
  console.log('token', token);

  return useMutation({
    mutationFn: (payload: LoginPayload) => userLogin(payload),
    onSuccess: ({ data }) => {
      accessToken.set(data.accessToken);
    },
    onError: () => {},
  });
};

const createOtp = async (payload: OTPPayload) => {
  const res = await api.post('/auth/otp', payload);
  return res.data;
};

const useSendOtp = () => {
  return useMutation({
    mutationFn: (payload: OTPPayload) => createOtp(payload),

    onSuccess: () => {},
    onError: () => {},
  });
};

export { useLogin, useSendOtp };
