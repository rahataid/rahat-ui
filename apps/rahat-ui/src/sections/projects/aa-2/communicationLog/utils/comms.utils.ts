import { generateExcel } from 'apps/rahat-ui/src/utils';

const CHANNEL_LABELS: Record<string, string> = {
  SMS: 'SMS',
  VOICE: 'AVC',
  EMAIL: 'Email',
};

export function exportCommsStats(stats: any) {
  if (!stats) return;

  const beneficiary = stats?.beneficiary ?? {};
  const stakeholder = stats?.stakeholder ?? {};
  const channels = new Set([
    ...Object.keys(beneficiary),
    ...Object.keys(stakeholder),
  ]);

  const row: Record<string, string | number> = {};
  let colCount = 0;

  channels.forEach((channel) => {
    const label = CHANNEL_LABELS[channel] || channel;
    const ben = beneficiary[channel] ?? {};
    const stk = stakeholder[channel] ?? {};

    row[`Total ${label} Sent`] = (ben.TOTAL || 0) + (stk.TOTAL || 0);
    row[`${label} Success`] = (ben.SUCCESS || 0) + (stk.SUCCESS || 0);
    row[`${label} Fail`] = (ben.FAIL || 0) + (stk.FAIL || 0);
    row[`${label} Pending`] = (ben.PENDING || 0) + (stk.PENDING || 0);
    row[`${label} Scheduled`] = (ben.SCHEDULED || 0) + (stk.SCHEDULED || 0);
    row[`${label} to Beneficiaries`] = ben.SUCCESS || 0;
    row[`${label} to Stakeholders`] = stk.SUCCESS || 0;
    row[`${label} Failed to Beneficiaries`] = ben.FAIL || 0;
    row[`${label} Failed to Stakeholders`] = stk.FAIL || 0;
    row[`${label} Scheduled to Beneficiaries`] = ben.SCHEDULED || 0;
    row[`${label} Scheduled to Stakeholders`] = stk.SCHEDULED || 0;
    row[`${label} Pending to Beneficiaries`] = ben.PENDING || 0;
    row[`${label} Pending to Stakeholders`] = stk.PENDING || 0;

    colCount += 13;
  });

  if (!channels.size) return;

  generateExcel([row], 'Communication_Stats_Report', colCount);
}

export function hasCommsData(stats: any) {
  const beneficiary = stats?.beneficiary ?? {};
  const stakeholder = stats?.stakeholder ?? {};

  const anyTotal = (obj: any) =>
    Object.values(obj).some((ch: any) => ch?.TOTAL > 0);

  return anyTotal(beneficiary) || anyTotal(stakeholder);
}
