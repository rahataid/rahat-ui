import { UUID } from 'crypto';

export interface IProjectVendor {
  uuid: string;
  name: string;
  extras?: Record<string, any>;
  phone: string;
  location: string;
}

export interface IProjectRedemption {
  tokenAmount: string;
  redemptionStatus: string;
  totalAmount: string;
  approvedAt: Date;
  createdAt: Date;
  approvedBy: string;
  transactionHash: string;
}
export type BeneficiaryType = 'predefined' | 'walkin';

export interface InKindLog {
  uuid: UUID;
  beneficiaryWallet: string;
  groupInkindId: UUID;
  quantity: number;
  redeemedAt: string;
  txHash: string;
  vendorUuid: UUID;
  Vendor: {
    name: string;
  };
  beneficiary: {
    uuid: UUID;
    walletAddress: string;
    phone: string | null;
    extras: {
      phone: string;
      validPhoneNumber: boolean;
    };
  };
  groupInkind: {
    uuid: UUID;
    inkind: {
      uuid: UUID;
      name: string;
      type: string;
    };
    group: {
      uuid: UUID;
      name: string;
    };
  };
}
