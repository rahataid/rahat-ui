import { generateExcel } from 'apps/rahat-ui/src/utils';

export function exportGctData(stats: any) {
  if (!stats) return;

  const row = {
    'Total Allocated Amount': stats?.totalAllocatedAmount ?? 0,
    'Total Disbursed Amount': stats?.totalDisbursedAmount ?? 0,
    'Treasury Balance': stats?.treasuryBalance ?? 0,
    'Total GCT Groups': stats?.totalGroups ?? 0,
    'Total Records': stats?.totalRecords ?? 0,
    'Disbursed Count': stats?.disbursedCount ?? 0,
    'Token Disbursed Count': stats?.tokenDisbursedCount ?? 0,
    'Pending Count': stats?.pendingCount ?? 0,
    'Not Started Count': stats?.notStartedCount ?? 0,
    'Failed Count': stats?.failedCount ?? 0,
    'Rejected Count': stats?.rejectedCount ?? 0,
  };

  generateExcel([row], 'GCT_Overview_Report', 11);
}

export function hasGctData(stats: any) {
  return !!(
    stats?.totalAllocatedAmount ||
    stats?.totalDisbursedAmount ||
    stats?.treasuryBalance ||
    stats?.totalGroups ||
    stats?.totalRecords ||
    stats?.disbursedCount ||
    stats?.pendingCount ||
    stats?.failedCount ||
    stats?.rejectedCount
  );
}
