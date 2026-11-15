import * as XLSX from 'xlsx';
import { buildRedemptionLogSheet } from './inkind.export';

describe('in-kind redemption export', () => {
  it('exports mode for each log in the first worksheet', () => {
    const rows = buildRedemptionLogSheet(
      [
        { quantity: 2, beneficiary: { name: 'Alice' }, mode: 'online' },
        { quantity: 1, beneficiary: { name: 'Bob' }, mode: 'OFFLINE' },
        { quantity: 3, beneficiary: { name: 'Carol' } },
      ],
      'offline',
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet(rows),
      'Redemption Logs',
    );
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet([['Inkind name']]),
      'Inkind details',
    );
    const bytes = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    const result = XLSX.read(bytes, { type: 'buffer' });
    expect(result.SheetNames[0]).toBe('Redemption Logs');
    expect(result.Sheets['Redemption Logs'].H1.v).toBe('mode');
    expect(result.Sheets['Redemption Logs'].H2.v).toBe('ONLINE');
    expect(result.Sheets['Redemption Logs'].H3.v).toBe('OFFLINE');
    expect(result.Sheets['Redemption Logs'].H4.v).toBe('OFFLINE');
  });

  it('does not mislabel unknown or missing modes as online', () => {
    expect(buildRedemptionLogSheet([{}, { mode: 'unknown' }]).slice(1)).toEqual([
      ['0', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'],
      ['0', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'],
    ]);
  });
});
