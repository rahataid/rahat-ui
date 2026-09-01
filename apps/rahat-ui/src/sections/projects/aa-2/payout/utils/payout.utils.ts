import { generateExcel } from 'apps/rahat-ui/src/utils';

export function exportPayoutStats(statsPayout: any) {
  if (!statsPayout) return;

  const row = {
    'FSP Payouts': statsPayout?.payoutOverview?.payoutTypes?.FSP ?? 0,
    'Vendor Payouts': statsPayout?.payoutOverview?.payoutTypes?.VENDOR ?? 0,
    'Payouts Success': statsPayout?.payoutOverview?.payoutStatus?.SUCCESS ?? 0,
    'Payouts Failed': statsPayout?.payoutOverview?.payoutStatus?.FAILED ?? 0,
    'Beneficiaries Receiving Cash': statsPayout?.payoutStats?.beneficiaries ?? 0,
    'Total Cash Distribution': statsPayout?.payoutStats?.totalCashDistribution ?? 0,
  };

  generateExcel([row], 'Payout_Overview_Report', 6);
}

export function hasPayoutData(statsPayout: any) {
  return !!(
    statsPayout?.payoutOverview?.payoutTypes?.FSP ||
    statsPayout?.payoutOverview?.payoutTypes?.VENDOR ||
    statsPayout?.payoutOverview?.payoutStatus?.SUCCESS ||
    statsPayout?.payoutOverview?.payoutStatus?.FAILED ||
    statsPayout?.payoutStats?.beneficiaries ||
    statsPayout?.payoutStats?.totalCashDistribution
  );
}
