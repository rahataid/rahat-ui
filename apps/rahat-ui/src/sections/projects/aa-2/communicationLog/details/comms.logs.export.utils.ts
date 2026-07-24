import { BroadcastStatus } from '@rumsan/connect/src/types';
import * as XLSX from 'xlsx';

const formatDate = (date: Date | string | undefined | null, pattern?: string) => {
  if (!date) return 'N/A';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'N/A';
    return new Intl.DateTimeFormat('ne-NP', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true,
    }).format(d);
  } catch { return 'N/A'; }
};

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

type LogsData = {
  group?: { name?: string };
  communicationDetail?: {
    groupType?: string;
    communicationTitle?: string;
    subject?: string;
    message?: any;
  };
  sessionDetails?: {
    Transport?: { name?: string };
    createdAt?: string;
    status?: string;
    updatedAt?: string;
  };
};

type ActivityDetail = {
  title?: string;
  description?: string;
  phase?: { name?: string };
  status?: string;
};

type CountData = {
  SUCCESS?: number;
  FAIL?: number;
};

const TYPE_SPECIFIC_FIELDS: Record<
  string,
  (log: SessionLog, logs: LogsData) => Record<string, any>
> = {
  EMAIL: (log, logs) => ({
    Subject: logs?.communicationDetail?.subject || 'N/A',
    Message: resolveMessageText(logs?.communicationDetail?.message),
    'Audience Email': log.address || 'N/A',
    Status: log.status || 'N/A',
  }),
  VOICE: (log) => ({
    'Audience Number': log.address || 'N/A',
    Status: log.status || 'N/A',
    Duration:
      log.status === 'FAIL'
        ? log.disposition?.disposition || log.message || log.error || 'N/A'
        : log.disposition?.duration !== null &&
          log.disposition?.duration !== undefined
          ? log.disposition.duration
          : 'N/A',
    Attempts: log.attempts || 0,
    'Max Attempts': log.maxAttempts || 0,
  }),
  SMS: (log, logs) => ({
    Message: resolveMessageText(logs?.communicationDetail?.message),
    'Audience Number': log.address || 'N/A',
    Status: log.status || 'N/A',
  }),
};

function resolveMessageText(message: any): string {
  if (!message) return 'N/A';
  if (typeof message === 'string') return message;
  return message?.fileName ?? 'N/A';
}

function buildRowMapper(logs: LogsData) {
  const communicationType = logs?.sessionDetails?.Transport?.name || 'SMS';
  const getTypeFields =
    TYPE_SPECIFIC_FIELDS[communicationType] || TYPE_SPECIFIC_FIELDS.SMS;

  return (log: SessionLog) => ({
    'Group Name': logs?.group?.name || 'N/A',
    'Group Type': logs?.communicationDetail?.groupType || 'N/A',
    'Communication Type': communicationType,
    'Communication Title':
      logs?.communicationDetail?.communicationTitle || 'N/A',
    ...getTypeFields(log, logs),
    'Triggered Date': logs?.sessionDetails?.updatedAt
      ? formatDate(logs.sessionDetails.updatedAt)
      : 'N/A',
    'Created Date': log.createdAt ? formatDate(log.createdAt) : 'N/A',
    'Updated Date': log.updatedAt ? formatDate(log.updatedAt) : 'N/A',
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

export function exportAllLogs(
  logsData: SessionLog[],
  logs: LogsData,
  activityDetail: ActivityDetail,
  countData: CountData,
  total: number,
): void {
  if (!logsData?.length) return;

  const communicationType =
    logs?.sessionDetails?.Transport?.name || 'Communication';
  const rowMapper = buildRowMapper(logs);
  const communicationLogsData = logsData.map(rowMapper);

  const detailsData = [
    {
      'Activity Title': activityDetail?.title || 'N/A',
      'Activity Description': activityDetail?.description || 'N/A',
      Phase: activityDetail?.phase?.name || 'N/A',
      'Activity Status': activityDetail?.status || 'N/A',
      'Total Audience Count': total,
      'Successfully Delivered': countData?.SUCCESS ?? 0,
      'Failed Delivered': countData?.FAIL ?? 0,
    },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(communicationLogsData),
    'Communication Logs',
  );
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(detailsData),
    'Details',
  );
  XLSX.writeFile(workbook, `${communicationType} Logs.xlsx`);
}
