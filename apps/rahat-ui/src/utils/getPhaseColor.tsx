const customPhaseColors = [
  'bg-blue-100 text-blue-800',
  'bg-violet-100 text-violet-800',
  'bg-cyan-100 text-cyan-800',
  'bg-orange-100 text-orange-800',
  'bg-pink-100 text-pink-800',
];

export function getPhaseColor(phase?: string | null) {
  const name = phase?.trim().toUpperCase();
  if (!name) return 'bg-gray-100 text-gray-700';
  if (name === 'PREPAREDNESS') return 'bg-green-100 text-green-700';
  if (name === 'ACTIVATION') return 'bg-red-100 text-red-700';
  if (name === 'READINESS') return 'bg-yellow-100 text-yellow-800';

  const hash = Array.from(name).reduce(
    (value, character) => (value * 31 + character.charCodeAt(0)) >>> 0,
    0,
  );
  return customPhaseColors[hash % customPhaseColors.length];
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
