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
