import { useMutation } from '@tanstack/react-query';

import api from '@/libs/utils/api';
import { accessToken } from '@/libs/utils/tokens';
import { LoginPayload, OTPPayload } from '@/libs/types/auth.types';

const userLogin = async (payload: LoginPayload) => {
  const res = await api.post('/auth/login', payload);
  return res.data;
};

const userLoginMutation = () => {
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

const otpMutation = () => {
  return useMutation({
    mutationFn: (payload: OTPPayload) => createOtp(payload),
    onSuccess: () => {},
    onError: () => {},
  });
};

export { userLoginMutation, otpMutation };
