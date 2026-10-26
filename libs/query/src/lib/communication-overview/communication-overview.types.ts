import { Project } from '@rahataid/sdk/project/project.types';

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

export type CommunicationOverviewFilterParams = CommunicationLogsFilterParams;

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

export type OverallCommunicationStats = {
  totalCommunications: number;
  successful: number;
  failed: number;
  pending: number;
  totalRecipients: number;
  successRate: number;
};

export type CommunicationOverviewData = {
  overall: OverallCommunicationStats;
  recipientWise: RecipientWiseStats;
  channelWise: ChannelWiseStats;
  rawGroupStats: Record<string, unknown>;
};

export type DeliveryStatus = 'COMPLETED' | 'FAILED' | 'IN_PROGRESS';
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

export type ResolvedTransportInfo = {
  channel: CommunicationChannel;
  transportName: string;
};

export type TransportEntry = {
  cuid?: string;
  id?: string;
  name?: string;
  type?: string;
};

export type TargetProject = {
  uuid: string;
  name: string;
};

export type { Project };
