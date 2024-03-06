import { ListBeneficiary, Meta } from '@rahat-ui/types';

export interface IBeneficiaryItem {
  uuid?: string;
  walletAddress?: string;
  updatedAt: Date;
  verified?: boolean;
}

export interface IBeneficiaryTableData {
  data: ListBeneficiary[];
  meta?: Meta;
}
