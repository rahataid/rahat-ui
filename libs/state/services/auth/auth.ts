import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from '../../../utils/api';
import { accessToken } from '../../../utils/tokens';
import { LoginPayload, OTPPayload } from '../../../types/auth.types';

const userLogin = async (payload: LoginPayload) => {
  const res = await api.post('/auth/login', payload);
  return res.data;
};

const userLoginMutation = (payload: LoginPayload) => {
  return useMutation({
    mutationFn: () => userLogin(payload),
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

const otpMutation = (payload: OTPPayload) => {
  return useMutation({
    mutationFn: () => createOtp(payload),
    onSuccess: () => {},
    onError: () => {},
  });
};

export { userLoginMutation, otpMutation };
