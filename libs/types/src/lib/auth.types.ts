export interface LoginPayload {
  otp: string;
  challenge: string;
  service: string;
}

export interface LoginResponse {
  accessToken: string;
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
