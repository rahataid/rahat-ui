import { ListBeneficiary, Meta } from '@rahat-ui/types';

export interface IBeneficiaryItem {
  uuid: string;
  walletAddress?: string;
  updatedAt: Date;
  verified?: boolean;
  firstName: string;
  lastName: string;
  id: number;
  customId: string;
  birthDate: Date;
  location: string;
  latitude: number;
  longitude: number;
  notes: string;
  phone: string;
  extras: any;
  createdAt: Date;
  deletedAt: Date;
}

export interface IBeneficiaryTableData {
  data: ListBeneficiary[];
  meta?: Meta;
}

// id: number;
// uuid: string;
// gender: Gender;
// walletAddress?: string;
// location: string;
// latitude: number;
// longitude: number;
// extras?: any;
// notes: string;
// bankedStatus: string;
// internetStatus: string;
// phoneStatus: string;
// createdAt: Date;
// updatedAt: Date;
