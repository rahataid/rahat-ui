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
