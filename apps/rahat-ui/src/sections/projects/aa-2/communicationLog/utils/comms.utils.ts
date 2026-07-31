import { generateExcel } from 'apps/rahat-ui/src/utils';

export function exportCommsStats(stats: any) {
  if (!stats) return;

  const rows = [
    {
      'Total SMS Sent': (stats?.beneficiary?.SMS?.TOTAL || 0) + (stats?.stakeholder?.SMS?.TOTAL || 0),
      'SMS Success': (stats?.beneficiary?.SMS?.SUCCESS || 0) + (stats?.stakeholder?.SMS?.SUCCESS || 0),
      'SMS Fail': (stats?.beneficiary?.SMS?.FAIL || 0) + (stats?.stakeholder?.SMS?.FAIL || 0),
      'SMS to Beneficiaries': stats?.beneficiary?.SMS?.SUCCESS || 0,
      'SMS to Stakeholders': stats?.stakeholder?.SMS?.SUCCESS || 0,
      'Total AVC Sent': (stats?.beneficiary?.VOICE?.TOTAL || 0) + (stats?.stakeholder?.VOICE?.TOTAL || 0),
      'AVC Success': (stats?.beneficiary?.VOICE?.SUCCESS || 0) + (stats?.stakeholder?.VOICE?.SUCCESS || 0),
      'AVC Fail': (stats?.beneficiary?.VOICE?.FAIL || 0) + (stats?.stakeholder?.VOICE?.FAIL || 0),
      'AVC to Beneficiaries': stats?.beneficiary?.VOICE?.SUCCESS || 0,
      'AVC to Stakeholders': stats?.stakeholder?.VOICE?.SUCCESS || 0,
    },
  ];

  generateExcel(rows, 'Communication_Stats_Report', 10);
}

export function hasCommsData(stats: any) {
  return !!(
    stats?.beneficiary?.SMS?.TOTAL ||
    stats?.stakeholder?.SMS?.TOTAL ||
    stats?.beneficiary?.VOICE?.TOTAL ||
    stats?.stakeholder?.VOICE?.TOTAL
  );
}
