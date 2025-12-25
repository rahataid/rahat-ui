export type StakeholderType =
  | 'UNICEF'
  | 'NGO'
  | 'Distributor (Wards)'
  | 'Beneficiaries';

export type TransferStatus = 'pending' | 'sent' | 'received';

export interface Entities {
  alias: string;
  name: string;
  type: StakeholderType;
  address: string;
  privatekey: string;
  smartaccount: string;
}

export interface InKindTransfer {
  id: string;
  from: string;
  to: string;
  amount: number;
  status: TransferStatus;
  timestamp: string;
  type: 'in-kind';
  items?: {
    name: string;
    quantity: number;
    unit: string;
  }[];

  comments?: string;
  attachments?: string[];
}
