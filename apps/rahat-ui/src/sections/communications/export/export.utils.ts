import axios from 'axios';
import { useAuthStore } from '@rumsan/react-query/auth';
import * as XLSX from 'xlsx';

const communicationURL = process.env['NEXT_PUBLIC_API_CAMPAIGN_URL'];
const appId = process.env['NEXT_PUBLIC_APP_ID'];

const communicationApi = axios.create({
  baseURL: communicationURL,
  headers: {
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    appId,
  },
});

communicationApi.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

const PAGE_SIZE = 100;

async function fetchAllCampaigns(): Promise<any[]> {
  const allCampaigns: any[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await communicationApi.get('/campaigns', {
      params: { page, perPage: PAGE_SIZE },
    });
    const rows = response.data?.data?.rows || [];
    allCampaigns.push(...rows);

    const total = response.data?.response?.meta?.total || 0;
    hasMore = allCampaigns.length < total;
    page++;
  }

  return allCampaigns;
}

async function fetchCampaignDetails(id: number): Promise<any> {
  const response = await communicationApi.get(`/campaigns/${id}`);
  return response.data?.data || null;
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleString();
  } catch {
    return '';
  }
}

function mapVoiceRows(campaign: any, logs: any[]): any[] {
  if (!logs?.length) return [];
  return logs.map((log) => ({
    'Group Name': campaign.group?.name || campaign.name || '',
    'Group Type': campaign.group?.type || campaign.details?.groupType || '',
    'Communication Type': 'VOICE',
    'Communication Title': campaign.name || '',
    'Audience Number': log?.audience?.details?.phone || '',
    Status: log?.status || '',
    Duration: log?.disposition?.duration || '',
    Attempts: log?.attempts ?? '',
    'Max Attempts': log?.maxAttempts ?? '',
    'Triggered Date': formatDate(campaign.updatedAt),
    'Created Date': formatDate(campaign.createdAt),
    'Updated Date': formatDate(campaign.updatedAt),
    'Session Start Date': formatDate(log?.sessionStartedAt),
    'Session End Date': formatDate(log?.sessionEndedAt),
  }));
}

function mapSmsRows(campaign: any, logs: any[]): any[] {
  if (!logs?.length) return [];
  return logs.map((log) => ({
    'Group Name': campaign.group?.name || campaign.name || '',
    'Group Type': campaign.group?.type || campaign.details?.groupType || '',
    'Communication Type': 'SMS',
    'Communication Title': campaign.name || '',
    Message: campaign.details?.body || campaign.details?.message || '',
    'Audience Number': log?.audience?.details?.phone || '',
    Status: log?.status || '',
    'Triggered Date': formatDate(campaign.updatedAt),
    'Created Date': formatDate(campaign.createdAt),
    'Updated Date': formatDate(campaign.updatedAt),
  }));
}

function mapEmailRows(campaign: any, logs: any[]): any[] {
  if (!logs?.length) return [];
  return logs.map((log) => ({
    'Group Name': campaign.group?.name || campaign.name || '',
    'Group Type': campaign.group?.type || campaign.details?.groupType || '',
    'Communication Type': 'EMAIL',
    'Communication Title': campaign.name || '',
    Subject: campaign.details?.subject || '',
    Message: campaign.details?.body || campaign.details?.message || '',
    'Audience Email': log?.audience?.details?.email || '',
    Status: log?.status || '',
    'Triggered Date': formatDate(campaign.updatedAt),
    'Created Date': formatDate(campaign.createdAt),
    'Updated Date': formatDate(campaign.updatedAt),
  }));
}

export async function exportAllCommunicationLogs(): Promise<void> {
  const allCampaigns = await fetchAllCampaigns();

  if (!allCampaigns.length) {
    throw new Error('No campaigns found to export.');
  }

  const voiceRows: any[] = [];
  const smsRows: any[] = [];
  const emailRows: any[] = [];

  for (const campaign of allCampaigns) {
    const details = await fetchCampaignDetails(campaign.id);
    const logs = details?.communicationLogs || [];

    switch (campaign.type) {
      case 'PHONE':
        voiceRows.push(...mapVoiceRows(campaign, logs));
        break;
      case 'SMS':
        smsRows.push(...mapSmsRows(campaign, logs));
        break;
      case 'EMAIL':
        emailRows.push(...mapEmailRows(campaign, logs));
        break;
    }
  }

  const workbook = XLSX.utils.book_new();

  if (voiceRows.length) {
    const voiceSheet = XLSX.utils.json_to_sheet(voiceRows);
    XLSX.utils.book_append_sheet(workbook, voiceSheet, 'Voice');
  }

  if (smsRows.length) {
    const smsSheet = XLSX.utils.json_to_sheet(smsRows);
    XLSX.utils.book_append_sheet(workbook, smsSheet, 'SMS');
  }

  if (emailRows.length) {
    const emailSheet = XLSX.utils.json_to_sheet(emailRows);
    XLSX.utils.book_append_sheet(workbook, emailSheet, 'Email');
  }

  if (!workbook.SheetNames.length) {
    throw new Error('No communication logs available to export.');
  }

  const today = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `CommunicationAllLogs_${today}.xlsx`);
}
