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
