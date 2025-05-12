export interface IPayoutItem {
  id: number;
  campaignId: string;
  title: string;
  responsibility: string;
  source: string;
  phase: string;
  category: string;
  description: string;
  // hazardType: string;
  status: string;
  activityType: string;
  activtiyComm: Record<string, any>;
  activityDocuments: any;
}
