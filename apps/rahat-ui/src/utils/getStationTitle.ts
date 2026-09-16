// `t` is an optional GLOBAL-namespace translator; callers that don't pass one
// keep getting the raw English fallback (unchanged legacy behaviour).
export function getStationTitle(
  projectType: string,
  t?: (key: 'RIVER_BASIN' | 'STATION') => string,
): string {
  const isFlood = projectType === 'FLOOD';
  if (t) return isFlood ? t('RIVER_BASIN') : t('STATION');
  if (!projectType || typeof projectType !== 'string') return 'River Basin';
  return isFlood ? 'River Basin' : 'Station';
}
