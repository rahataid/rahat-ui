import { ACTIVITY_STATUS } from 'apps/rahat-ui/src/constants/aa.constants';

const { NOT_STARTED, WORK_IN_PROGRESS, COMPLETED, DELAYED } = ACTIVITY_STATUS;

// Every ActivityStatus value, in display order.
export const OVERVIEW_STATUSES = [
  COMPLETED,
  WORK_IN_PROGRESS,
  NOT_STARTED,
  DELAYED,
];

// The backend has no stats endpoint, so the overview loads every activity
// matching the filters in one call and counts here.
export const STATS_PAGE_SIZE = 9999;

type ActivityRow = {
  status?: string;
  phase?: string;
  category?: string;
  isAutomated?: boolean;
  activityCommunication?: unknown;
};

export type ActivityStats = {
  total: number;
  byStatus: Record<string, number>;
  phases: string[];
  statusByPhase: Record<string, number[]>;
  categories: { name: string; completed: number; total: number }[];
  automated: number;
  manual: number;
  withCommunication: number;
};

const hasItems = (value: unknown) =>
  Array.isArray(value)
    ? value.length > 0
    : !!value && typeof value === 'object' && Object.keys(value).length > 0;

// Phases are project-defined, so their order comes from the caller (the
// phases list from the backend). Phases missing from it keep the order in
// which they first appear in the rows.
export function computeActivityStats(
  rows: ActivityRow[],
  phaseOrder: string[] = [],
): ActivityStats {
  const byStatus: Record<string, number> = Object.fromEntries(
    OVERVIEW_STATUSES.map((s) => [s, 0]),
  );
  const phaseCounts = new Map<string, Record<string, number>>();
  const categoryCounts = new Map<
    string,
    { completed: number; total: number }
  >();
  let automated = 0;
  let withCommunication = 0;

  for (const row of rows) {
    const status = row.status ?? NOT_STARTED;
    byStatus[status] = (byStatus[status] ?? 0) + 1;

    const phase = row.phase ?? 'UNKNOWN';
    const phaseRow = phaseCounts.get(phase) ?? {};
    phaseRow[status] = (phaseRow[status] ?? 0) + 1;
    phaseCounts.set(phase, phaseRow);

    const category = row.category ?? 'UNKNOWN';
    const categoryRow = categoryCounts.get(category) ?? {
      completed: 0,
      total: 0,
    };
    categoryRow.total += 1;
    if (status === COMPLETED) categoryRow.completed += 1;
    categoryCounts.set(category, categoryRow);

    if (row.isAutomated) automated += 1;
    if (hasItems(row.activityCommunication)) withCommunication += 1;
  }

  const rank = (name: string) => {
    const i = phaseOrder.indexOf(name);
    return i === -1 ? phaseOrder.length : i;
  };
  // Array.sort is stable, so unknown phases stay in first-seen order.
  const phases = [...phaseCounts.keys()].sort((a, b) => rank(a) - rank(b));

  return {
    total: rows.length,
    byStatus,
    phases,
    statusByPhase: Object.fromEntries(
      OVERVIEW_STATUSES.map((s) => [
        s,
        phases.map((p) => phaseCounts.get(p)?.[s] ?? 0),
      ]),
    ),
    categories: [...categoryCounts.entries()]
      .map(([name, counts]) => ({ name, ...counts }))
      .sort((a, b) => b.total - a.total),
    automated,
    manual: rows.length - automated,
    withCommunication,
  };
}
