export interface IProjectVendor {
  uuid: string;
  name: string;
  phone: string;
  location: string;
}

export interface IProjectRedemption {
  tokenAmount: string;
  status: string;
  approvedBy: string;
  approvedDate: Date;
}
