import { ItemError } from '@rahat-ui/query';

export const getDynamicColors = (data: string) => {
  if (['VALID', 'NORMAL', 'HEALTHY'].includes(data)) {
    return 'text-green-500 bg-green-50 border-green-500';
  }

  if (['STALE', 'WARNING', 'DEGRADED'].includes(data)) {
    return 'text-yellow-500 bg-yellow-50 border-yellow-500';
  }

  if (['EXPIRED', 'CRITICAL', 'UNHEALTHY'].includes(data)) {
    return 'text-red-500 bg-red-50 border-red-500';
  }

  return 'text-muted-foreground bg-muted/10 border-border';
};

export const getSeverityFromData = (status: string, errors: ItemError[]) => {
  if (status === 'DOWN') return 'CRITICAL';
  if (status === 'DEGRADED' || errors?.length > 0) return 'WARNING';
  return 'NORMAL';
};
