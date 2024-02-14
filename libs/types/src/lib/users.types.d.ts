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
    uuid: string;
}
export interface DeleteUserPayload {
    uuid: string;
}
export interface GetUsers {
    page?: number | null;
    perPage?: number | null;
    sort?: string | null;
    order?: string | null;
}
export interface User {
    id: number;
    uuid: string;
    name: string;
    gender: Gender;
    email: string;
    phone?: any;
    wallet?: string;
    extras?: any;
    createdAt: string;
    updatedAt: string;
    deletedAt?: Date;
    createdBy?: Number;
    updatedBy?: Number;
    permissions: Permission[];
    roles: string[];
}
interface Permission {
    action: string;
    subject: string;
    inverted: boolean;
    conditions?: any;
}
export interface ListUserResponse {
    data: User[];
    meta: Meta;
}
interface Meta {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev?: any;
    next?: any;
}
declare enum Gender {
    MALE = 0,
    FEMALE = 1,
    OTHER = 2,
    UNKNOWN = 3
}
export {};
