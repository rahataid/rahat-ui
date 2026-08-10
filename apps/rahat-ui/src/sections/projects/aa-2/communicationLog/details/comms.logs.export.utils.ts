import { BroadcastStatus } from '@rumsan/connect/src/types';
import * as XLSX from 'xlsx';

type SessionLog = {
  address: string;
  status: string;
  disposition?: {
    duration?: string | number;
    answerTime?: string;
    endTime?: string;
    disposition?: string;
  };
  message?: string;
  error?: string;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  updatedAt: string;
};

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
): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}