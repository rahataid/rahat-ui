import { generateExcel } from 'apps/rahat-ui/src/utils';

export function exportTokenStats(data: any) {
  if (!data?.data?.length) return;

  const row: Record<string, string | number> = {};
  data.data.forEach((item: any) => {
    row[item.name] = item.value ?? 0;
  });

  generateExcel([row], 'Tokens_Overview_Report', Object.keys(row).length);
}

export function hasTokenData(data: any) {
  return !!(data?.data?.length);
}
