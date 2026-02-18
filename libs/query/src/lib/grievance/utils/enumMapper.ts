import {
  GrievanceStatus,
  GrievancePriority,
  GrievanceType,
} from '../types/grievance';

export function mapGrievanceStatusToLabel(
  status: GrievanceStatus | string,
): string {
  const statusLabelMap: Record<GrievanceStatus, string> = {
    [GrievanceStatus.NEW]: 'New',
    [GrievanceStatus.UNDER_REVIEW]: 'Under Review',
    [GrievanceStatus.RESOLVED]: 'Resolved',
    [GrievanceStatus.CLOSED]: 'Closed',
  };

  return statusLabelMap[status as GrievanceStatus] || 'N/A';
}

export function mapGrievancePriorityToLabel(
  priority: GrievancePriority | string,
): string {
  const priorityLabelMap: Record<GrievancePriority, string> = {
    [GrievancePriority.LOW]: 'Low',
    [GrievancePriority.MEDIUM]: 'Medium',
    [GrievancePriority.HIGH]: 'High',
  };

  return priorityLabelMap[priority as GrievancePriority] || 'N/A';
}

export function mapGrievanceTypeToLabel(type: GrievanceType | string): string {
  const typeLabelMap: Record<GrievanceType, string> = {
    [GrievanceType.TECHNICAL]: 'Technical',
    [GrievanceType.NON_TECHNICAL]: 'Non-Technical',
    [GrievanceType.OTHER]: 'Other',
  };

  return typeLabelMap[type as GrievanceType] || 'N/A';
}

export function getGrievanceStatusOptions(): Array<{
  value: GrievanceStatus;
  label: string;
}> {
  const options: Array<{ value: GrievanceStatus; label: string }> = [];
  for (const status of Object.values(GrievanceStatus)) {
    options.push({
      value: status,
      label: mapGrievanceStatusToLabel(status),
    });
  }
  return options;
}

export function getGrievancePriorityOptions(): Array<{
  value: GrievancePriority;
  label: string;
}> {
  const options: Array<{ value: GrievancePriority; label: string }> = [];
  for (const priority of Object.values(GrievancePriority)) {
    options.push({
      value: priority,
      label: mapGrievancePriorityToLabel(priority),
    });
  }
  return options;
}

export function getGrievanceTypeOptions(): Array<{
  value: GrievanceType;
  label: string;
}> {
  const options: Array<{ value: GrievanceType; label: string }> = [];
  for (const type of Object.values(GrievanceType)) {
    options.push({
      value: type,
      label: mapGrievanceTypeToLabel(type),
    });
  }
  return options;
}
