export function getPhaseColor(phase: string) {
  if (phase === 'PREPAREDNESS') {
    return 'bg-green-100 text-green-500';
  }
  if (phase === 'ACTIVATION') {
    return 'bg-red-100 text-red-500';
  }
  if (phase === 'READINESS') {
    return 'bg-yellow-100 text-yellow-500';
  }
  return '';
}

export function getSessionColor(status: string) {
  const normalizedStatus = status.toUpperCase().replace(/ /g, '_');
  if (normalizedStatus === 'PENDING') {
    return 'bg-yellow-200';
  }
  if (normalizedStatus === 'COMPLETED') {
    return 'bg-green-200';
  }
  if (normalizedStatus === 'WORK_IN_PROGRESS') {
    return 'bg-orange-200';
  }
  if (normalizedStatus === 'FAILED') {
    return 'bg-red-200';
  }
  return 'bg-gray-200';
}
