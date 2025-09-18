import {
  GrievancePriority,
  GrievanceStatus,
  GrievanceType,
} from '@rahat-ui/query/lib/grievance/types/grievance';

export const grievanceType = [
  { value: GrievanceType.TECHNICAL, label: 'Technical' },
  { value: GrievanceType.OPERATIONAL, label: 'Operational' },
  { value: GrievanceType.FINANCIAL, label: 'Financial' },
  { value: GrievanceType.OTHER, label: 'Other' },
];

export const grievanceStatus = [
  { value: GrievanceStatus.NEW, label: 'New' },
  { value: GrievanceStatus.IN_PROGRESS, label: 'In Progress' },
  { value: GrievanceStatus.RESOLVED, label: 'Resolved' },
  { value: GrievanceStatus.CLOSED, label: 'Closed' },
  { value: GrievanceStatus.REJECTED, label: 'Rejected' },
];

export const grievancePriority = [
  { value: GrievancePriority.LOW, label: 'Low' },
  { value: GrievancePriority.MEDIUM, label: 'Medium' },
  { value: GrievancePriority.HIGH, label: 'High' },
  { value: GrievancePriority.CRITICAL, label: 'Critical' },
];
