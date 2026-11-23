import { ACTIVITY_STATUS } from 'apps/rahat-ui/src/constants/aa.constants';

const { NOT_STARTED, WORK_IN_PROGRESS, COMPLETED, DELAYED } = ACTIVITY_STATUS;

export const OVERVIEW_STATUSES = [
  COMPLETED,
  WORK_IN_PROGRESS,
  NOT_STARTED,
  DELAYED,
];

// No backend stats endpoint: one call loads every activity and the stats are counted here
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
  categories: { name: string; counts: Record<string, number>; total: number }[];
  automated: number;
  manual: number;
  withCommunication: number;
};

const hasItems = (value: unknown) =>
  Array.isArray(value)
    ? value.length > 0
    : !!value && typeof value === 'object' && Object.keys(value).length > 0;

export function computeActivityStats(
  rows: ActivityRow[],
  phaseOrder: string[] = [],
): ActivityStats {
  const byStatus: Record<string, number> = Object.fromEntries(
    OVERVIEW_STATUSES.map((s) => [s, 0]),
  );
  const phaseCounts = new Map<string, Record<string, number>>();
  const categoryCounts = new Map<string, Record<string, number>>();
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
    const categoryRow = categoryCounts.get(category) ?? {};
    categoryRow[status] = (categoryRow[status] ?? 0) + 1;
    categoryCounts.set(category, categoryRow);

    if (row.isAutomated) automated += 1;
    if (hasItems(row.activityCommunication)) withCommunication += 1;
  }

  const rank = (name: string) => {
    const i = phaseOrder.indexOf(name);
    return i === -1 ? phaseOrder.length : i;
  };

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
      .map(([name, counts]) => ({
        name,
        counts,
        total: Object.values(counts).reduce((sum, n) => sum + n, 0),
      }))
      .sort((a, b) => b.total - a.total),
    automated,
    manual: rows.length - automated,
    withCommunication,
  };
}
