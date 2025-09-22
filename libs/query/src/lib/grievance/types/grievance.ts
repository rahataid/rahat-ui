import { Pagination } from '@rumsan/sdk/types';
import { UUID } from 'crypto';

export type GetGrievanceList = Pagination & {
  order?: 'asc' | 'desc';
  sort?: string;
  status?: string;
  projectUUID: UUID;
  type?: string;
};

export enum GrievanceType {
  TECHNICAL = 'TECHNICAL',
  OPERATIONAL = 'OPERATIONAL',
  FINANCIAL = 'FINANCIAL',
  OTHER = 'OTHER',
}

export enum GrievanceStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  REJECTED = 'REJECTED',
}

export enum GrievancePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export type Tag = {
  id: string;
  text: string;
};

export type GrievanceFormData = {
  reportedBy: string;
  reporterContact: string;
  title: string;
  type: GrievanceType;
  description: string;
  status?: GrievanceStatus;
  priority: GrievancePriority;
  tags: Tag[];
};
