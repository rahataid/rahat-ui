export interface IProjectVendor {
  uuid: string;
  name: string;
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
