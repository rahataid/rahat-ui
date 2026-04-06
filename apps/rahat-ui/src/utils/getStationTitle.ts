export function getStationTitle(projectType: string): string {
  if (!projectType || typeof projectType !== 'string') return 'River Basin';
  switch (projectType) {
    case 'FLOOD':
      return 'River Basin';
    case 'HEAT_WAVE':
      return 'Station';
    default:
      return 'Station';
  }
}
