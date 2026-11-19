export type CommunicationLogsFilterParams = {
  project?: string;
  from?: string;
  to?: string;
  channel?: string;
  recipient?: string;
  phase?: string;
  status?: string;
  page?: number;
  perPage?: number;
  search?: string;
};

export type GroupDeliveryStats = {
  total: number;
  successful: number;
  failed: number;
  pending: number;
  successRate: number;
};

export type TransportDeliveryCounts = {
  SCHEDULED?: number;
  PENDING?: number;
  SUCCESS?: number;
  FAIL?: number;
  TOTAL?: number;
  TOTAL_PRICE?: number;
};

export type BroadcastCounts = TransportDeliveryCounts;

export type GroupTransportStats = {
  beneficiary?: Record<string, TransportDeliveryCounts>;
  stakeholder?: Record<string, TransportDeliveryCounts>;
};

export type RecipientWiseStats = {
  beneficiary: GroupDeliveryStats;
  stakeholder: GroupDeliveryStats;
};

export type ChannelWiseStats = Record<string, GroupDeliveryStats>;

export type CommunicationOverviewData = {
  overall: {
    totalCommunications: number;
    totalCampaigns?: number;
    successful: number;
    failed: number;
    pending: number;
    totalRecipients: number;
    successRate: number;
  };
  recipientWise: RecipientWiseStats;
  channelWise: ChannelWiseStats;
  rawGroupStats: GroupTransportStats | Record<string, unknown>;
};

export type DeliveryStatus =
  | 'COMPLETED'
  | 'IN_PROGRESS'
  | 'PENDING'
  | 'NOT_STARTED'
  | 'FAILED'
  | 'CANCELLED'
  | (string & Record<never, never>);

export type CommunicationChannel = 'SMS' | 'VOICE' | 'EMAIL' | 'WHATSAPP';

export type CommunicationActivityItem = {
  id: string;
  date: string;
  projectId?: string;
  projectName?: string;
  title: string;
  channel: CommunicationChannel | string;
  transportName?: string;
  groupName?: string;
  recipientType: string;
  phase?: string;
  status: DeliveryStatus;
  delivered: number;
  total: number;
  failed?: number;
  pending?: number;
  sessionId?: string;
  communicationId?: string;
  activityId?: string;
  subject?: string;
  message?: string;
  failReason?: string;
};

export type TargetProject = {
  uuid: string;
  name: string;
};
