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
  NON_TECHNICAL = 'NON_TECHNICAL',
  OTHER = 'OTHER',
}

export enum GrievanceStatus {
  NEW = 'NEW',
  UNDER_REVIEW = 'UNDER_REVIEW',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum GrievancePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
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
