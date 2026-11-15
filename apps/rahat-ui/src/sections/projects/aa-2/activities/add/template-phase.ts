type Phase = { uuid: string; name: string };

export function getTemplatePhaseId(
  contextPhaseId: string | null,
  templatePhaseName: string | undefined,
  phases: readonly Phase[],
) {
  if (contextPhaseId || !templatePhaseName) return undefined;
  return phases.find(
    (phase) => phase.name.toLowerCase() === templatePhaseName.toLowerCase(),
  )?.uuid;
}

export function getContextPhaseId(
  contextPhaseId: string | null,
  phases: readonly Phase[],
) {
  return contextPhaseId && phases.some((phase) => phase.uuid === contextPhaseId)
    ? contextPhaseId
    : '';
}
