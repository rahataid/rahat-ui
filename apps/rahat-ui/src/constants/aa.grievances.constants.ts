import {
  GrievancePriority,
  GrievanceStatus,
  GrievanceType,
} from '@rahat-ui/query/lib/grievance/types/grievance';

export const grievanceType = [
  { value: GrievanceType.TECHNICAL, label: 'Technical' },
  { value: GrievanceType.NON_TECHNICAL, label: 'Non-Technical' },
  { value: GrievanceType.OTHER, label: 'Other' },
];

export const grievanceStatus = [
  { value: GrievanceStatus.NEW, label: 'New' },
  { value: GrievanceStatus.UNDER_REVIEW, label: 'Under Review' },
  { value: GrievanceStatus.RESOLVED, label: 'Resolved' },
  { value: GrievanceStatus.CLOSED, label: 'Closed' },
];

export const grievancePriority = [
  { value: GrievancePriority.LOW, label: 'Low' },
  { value: GrievancePriority.MEDIUM, label: 'Medium' },
  { value: GrievancePriority.HIGH, label: 'High' },
];
