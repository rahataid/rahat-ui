export interface CreateNewBeneficiaryPayload {
  gender?: string;
  walletAddress?: string;
  birthDate?: Date;
  location?: string;
  latitude?: number;
  longitude?: number;
  extras?: Record<string, any>;
  notes?: string;
  phone: string;
  bankedStatus?: string;
  internetStatus?: string;
  phoneStatus?: string;
  piiData?: TPIIData;
}

export interface ListBeneficiary {
  id: number;
  uuid: string;
  gender: Gender;
  walletAddress?: string;
  location: string;
  latitude: number;
  longitude: number;
  extras?: any;
  notes: string;
  bankedStatus: string;
  internetStatus: string;
  phoneStatus: string;
  createdAt: Date;
  updatedAt: Date;
  piiData?: TPIIData;
  BeneficiaryProject?: any;
}

export interface ListBeneficiaryGroup {
  id: number;
  uuid: string;
  name: string;
  totalMembers: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  beneficiaryGroupProject?: any;
  isGroupValidForAA: boolean;
  groupPurpose?: string;
}

export interface UpdateBeneficiaryPayload {
  uuid?: string;
  gender?: Gender;
  walletAddress?: string;
  birthDate?: Date;
  location?: string;
  latitude?: number;
  longitude?: number;
  extras?: Record<string, any>;
  notes?: string;
  bankedStatus?: BankedStatus;
  internetStatus?: InternetStatus;
  phoneStatus?: PhoneStatus;
  piiData?: TPIIData;
}

export interface ListBeneficiariesResponse {
  success: true;
  data: ListBeneficiary[];
  meta: Meta;
}

export interface Meta {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev?: any;
  next?: any;
}

export type TPIIData = {
  name?: string;
  phone?: string;
  email?: string;
  extras?: Record<string, any>;
};

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

export enum Gender {
  MALE,
  FEMALE,
  OTHER,
  UNKNOWN,
}

export enum BankedStatus {
  UNKNOWN,
  UNBANKED,
  BANKED,
  UNDER_BANKED,
}

export enum InternetStatus {
  UNKNOWN,
  NO_INTERNET,
  HOME_INTERNET,
  MOBILE_INTERNET,
}

export enum PhoneStatus {
  UNKNOWN,
  NO_PHONE,
  FEATURE_PHONE,
  SMART_PHONE,
}
