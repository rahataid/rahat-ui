export type BankDetails = {
  bankName?: string;
  bankBranchName?: string;
  accountNumber?: string;
  accountName?: string;
};

export type CreateGroupCashTransferPayload = {
  name: string;
  phone?: string;
  bankDetails?: BankDetails;
  extras?: Record<string, unknown>;
};

export type UpdateGroupCashTransferPayload = {
  uuid: string;
  name?: string;
  phone?: string;
  bankDetails?: BankDetails;
  extras?: Record<string, unknown>;
};

export type ListGroupCashTransferParams = {
  page?: number;
  perPage?: number;
  sort?: 'createdAt' | 'name';
  order?: 'asc' | 'desc';
  search?: string;
  phone?: string;
  ward?: string;
  supportArea?: string;
  hasFund?: boolean;
};

export type ListGctRecordsParams = {
  page?: number;
  perPage?: number;
  sort?: 'createdAt' | 'title' | 'amount';
  order?: 'asc' | 'desc';
  groupCashTransferId?: string;
  groupCashTransferName?: string;
  search?: string;
  status?: string;
};

export type UpdateGctRecordPayload = {
  uuid: string;
  title?: string;
  amount?: number;
};

export type AssignFundPayload = {
  groupCashTransferId: string;
  amount: number;
  title?: string;
};

export type DisbursePayload = {
  uuid: string; // fund record UUID from assignFund, not group UUID
};
