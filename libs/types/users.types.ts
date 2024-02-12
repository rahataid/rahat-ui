export interface CreateNewUserPayload {
  name: string;
  gender: string;
  phone: string;
  email: string;
  wallet: string;
}

export interface EditUserPayload {
  name?: string;
  gender?: string;
  phone?: string;
  email?: string;
  wallet?: string;
}

export interface DeleteUserPayload{
  uuid:string
}

export interface GetUsers {
  page?: number | null;
  perPage?: number | null;
  sort?: string | null;
  order?: string | null;
}
