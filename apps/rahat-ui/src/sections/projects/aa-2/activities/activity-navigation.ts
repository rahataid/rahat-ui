type Phase = {
  uuid: string;
  name: string;
  isRequiredLeadTime?: boolean;
  isAutomatedActivity?: boolean;
};

export function findActivityPhase<T extends Phase>(
  phases: T[],
  title: string,
): T | undefined {
  return phases.find(
    (phase) => phase.name.toLowerCase() === title.toLowerCase(),
  );
}

export function getActivitiesListPath(projectId: string, phaseName?: string) {
  const basePath = `/projects/aa/${projectId}/activities`;
  return phaseName
    ? `${basePath}/list/${encodeURIComponent(phaseName.toLowerCase())}`
    : basePath;
}
