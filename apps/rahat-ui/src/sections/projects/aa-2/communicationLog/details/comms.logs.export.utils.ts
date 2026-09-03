import { BroadcastStatus } from '@rumsan/connect/src/types';
import * as XLSX from 'xlsx';

type SessionLog = {
  address: string;
  status: string;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  updatedAt: string;
};

type ExportMeta = {
  groupName: string;
  groupType: string;
  transportName: string;
  communicationTitle: string;
  message?: string;
  subject?: string;
};

const UNWANTED_COLUMNS = new Set([
  'id',
  'cuid',
  'app',
  'session',
  'transport',
  'xref',
  'ivrSequence',
  'trunk',
  'fullDisposition',
]);

function parseCsv(csvText: string): Record<string, string>[] {
  const workbook = XLSX.read(csvText, { type: 'string' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const allRows: Record<string, string>[] = XLSX.utils.sheet_to_json(sheet);

  return allRows.map((row) => {
    const filtered: Record<string, string> = {};
    for (const key of Object.keys(row)) {
      if (!UNWANTED_COLUMNS.has(key)) {
        filtered[key] = row[key];
      }
    }
    return filtered;
  });
}

function buildVoiceRow(raw: Record<string, string>, meta: ExportMeta) {
  return {
    'Group Name': meta.groupName,
    'Group Type': meta.groupType,
    'Communication Type': meta.transportName,
    'Communication Title': meta.communicationTitle,
    'Audience Number': raw.address ?? '',
    Status: raw.status ?? '',
    Disposition: raw.disposition ?? '',
    Duration: raw.duration ?? '',
    Attempts: raw.attempts ?? '',
    'Max Attempts': raw.maxAttempts ?? '',
    'Is Complete': raw.isComplete ?? '',
    'Triggered Date': raw.createdAt ?? '',
    'Created Date': raw.createdAt ?? '',
    'Updated Date': raw.updatedAt ?? '',
    'Session Start Date': raw.answerTime ?? '',
    'Session End Date': raw.endTime ?? '',
    Address: raw.address ?? '',
    'Last Attempt': raw.lastAttempt ?? '',
  };
}

function buildSmsRow(raw: Record<string, string>, meta: ExportMeta) {
  return {
    'Group Name': meta.groupName,
    'Group Type': meta.groupType,
    'Communication Type': meta.transportName,
    'Communication Title': meta.communicationTitle,
    Message: meta.message ?? '',
    'Audience Number': raw.address ?? '',
    Status: raw.status ?? '',
    Attempts: raw.attempts ?? '',
    'Max Attempts': raw.maxAttempts ?? '',
    'Is Complete': raw.isComplete ?? '',
    'Triggered Date': raw.createdAt ?? '',
    'Created Date': raw.createdAt ?? '',
    'Updated Date': raw.updatedAt ?? '',
    Address: raw.address ?? '',
    'Last Attempt': raw.lastAttempt ?? '',
  };
}

function buildEmailRow(raw: Record<string, string>, meta: ExportMeta) {
  return {
    'Group Name': meta.groupName,
    'Group Type': meta.groupType,
    'Communication Type': meta.transportName,
    'Communication Title': meta.communicationTitle,
    Subject: meta.subject ?? '',
    Message: meta.message ?? '',
    'Audience Email': raw.address ?? '',
    Status: raw.status ?? '',
    Attempts: raw.attempts ?? '',
    'Max Attempts': raw.maxAttempts ?? '',
    'Is Complete': raw.isComplete ?? '',
    'Triggered Date': raw.createdAt ?? '',
    'Created Date': raw.createdAt ?? '',
    'Updated Date': raw.updatedAt ?? '',
    Address: raw.address ?? '',
    'Last Attempt': raw.lastAttempt ?? '',
  };
}

function buildExportRows(
  rows: Record<string, string>[],
  meta: ExportMeta,
): Record<string, any>[] {
  const transport = meta.transportName?.toUpperCase();

  return rows.map((raw) => {
    if (transport === 'VOICE') return buildVoiceRow(raw, meta);
    if (transport === 'EMAIL') return buildEmailRow(raw, meta);
    return buildSmsRow(raw, meta);
  });
}

export function exportFailedLogs(logsData: SessionLog[]): void {
  const failed = logsData?.filter(
    (log) => log?.status === BroadcastStatus.FAIL,
  );
  if (!failed?.length) return;

  const worksheetData = failed.map((log) => ({
    Address: log.address,
    Status: log.status,
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(worksheetData),
    'FailedLogs',
  );
  XLSX.writeFile(workbook, 'CommunicationFailed.xlsx');
}

export async function downloadLogsCsv(
  url: string,
  fileName: string,
  meta: ExportMeta,
): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);

  const csvText = await res.text();
  const rows = parseCsv(csvText);
  console.log('Parsed rows:', rows);
  console.log('First row:', rows[0]);
  console.log({
    address: rows[0]?.address,
    lastAttempt: rows[0]?.lastAttempt,
  });
  const exportRows = buildExportRows(rows, meta);
  console.log('Export rows:', exportRows);

  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(exportRows);
  XLSX.utils.book_append_sheet(workbook, sheet, meta.transportName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
