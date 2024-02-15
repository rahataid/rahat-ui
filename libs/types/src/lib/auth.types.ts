export interface LoginPayload {
  challenge: string;
  otp: string;
  service: string;
}

export interface OTPPayload {
  address: string;
  clientId: string;
  service: string;
}

export interface OTPResponse {
  clientId: string;
  challenge: string;
  ip: string;
}

export interface LoginResponse {
  accessToken: string;
}
