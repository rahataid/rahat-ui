'use client';

import * as XLSX from 'xlsx';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { formatRate } from '../communications/const';
import type {
  CommunicationStats,
  AutomationHealth,
  RecentCampaign,
  RecentImport,
} from '@rahat-ui/query';

// -- Export Data Types -------------------------------------------------------

interface ExportButtonProps {
  totalCustomers: number;
  activeCustomers: number;
  newlyInactiveCustomers: number;
  inactiveCustomers: number;
  commStats: CommunicationStats;
  automationHealth: AutomationHealth;
  recentCampaigns: RecentCampaign[];
  recentImports: RecentImport[];
  failedBatchCount: number;
}

// -- Helper Functions -------------------------------------------------------

function pctOf(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// -- Report Data Builder -----------------------------------------------------

function buildReportData(props: ExportButtonProps) {
  const {
    totalCustomers,
    activeCustomers,
    newlyInactiveCustomers,
    inactiveCustomers,
    commStats,
    automationHealth,
    recentCampaigns,
    recentImports,
    failedBatchCount,
  } = props;

  const timestamp = new Date().toLocaleString();
  const activePct = pctOf(activeCustomers, totalCustomers);
  const inactivePct = pctOf(inactiveCustomers, totalCustomers);
  const newlyInactivePct = pctOf(newlyInactiveCustomers, totalCustomers);

  const summaryRows: (string | number)[][] = [
    ['RAHAT CRM - DASHBOARD REPORT'],
    ['Generated', timestamp],
    [],
    ['Metric', 'Value', 'Percentage'],
    ['Total Customers', totalCustomers, ''],
    ['Active', activeCustomers, `${activePct}%`],
    ['Newly Inactive', newlyInactiveCustomers, `${newlyInactivePct}%`],
    ['Inactive', inactiveCustomers, `${inactivePct}%`],
    [],
    ['Communication', 'Count', ''],
    ['Total Messages Sent', commStats.totalMessages, ''],
    ['Messages Delivered', commStats.sent, ''],
    ['Messages Failed', commStats.failed, ''],
    ['Messages Skipped', commStats.skipped, ''],
    ['Delivery Rate', formatRate(commStats.deliveryRate), ''],
    [],
    ['Automation Health', '', ''],
    ['Total Rules', automationHealth.totalRules, ''],
    ['Enabled Rules', automationHealth.enabledRules, ''],
    ['Last Triggered', timeAgo(automationHealth.lastTriggeredAt), ''],
    [],
    ['Data Quality', '', ''],
    ['Failed Import Batches', failedBatchCount, ''],
  ];

  const campaignRows: (string | number)[][] = [
    ['Campaign Name', 'Recipients', 'Date'],
  ];
  if (recentCampaigns.length > 0) {
    recentCampaigns.forEach((c) => {
      campaignRows.push([c.name, c.recipientCount, formatDate(c.createdAt)]);
    });
  } else {
    campaignRows.push(['No campaigns yet', '', '']);
  }

  const importRows: (string | number)[][] = [
    ['Date', 'Records Processed', 'Successful', 'Failed', 'Status'],
  ];
  if (recentImports.length > 0) {
    recentImports.forEach((imp) => {
      const succeeded = Array.isArray(imp.successVendors)
        ? imp.successVendors.length
        : 0;
      const failedCount = Array.isArray(imp.failedVendors)
        ? imp.failedVendors.length
        : 0;
      const total = succeeded + failedCount;
      importRows.push([
        new Date(imp.createdAt).toLocaleDateString(),
        total,
        succeeded,
        failedCount,
        imp.status,
      ]);
    });
  } else {
    importRows.push(['No import activity yet', '', '', '', '']);
  }

  return { summaryRows, campaignRows, importRows };
}

// -- CSV Export ---------------------------------------------------------------

function exportAsCSV(props: ExportButtonProps): void {
  const { summaryRows, campaignRows, importRows } = buildReportData(props);

  const allRows = [
    ...summaryRows,
    [],
    ['--- RECENT CAMPAIGNS ---'],
    ...campaignRows,
    [],
    ['--- RECENT IMPORTS ---'],
    ...importRows,
  ];

  const ws = XLSX.utils.aoa_to_sheet(allRows);
  const csv = XLSX.utils.sheet_to_csv(ws);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `crm-dashboard-report-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// -- Excel Export -------------------------------------------------------------

function exportAsExcel(props: ExportButtonProps): void {
  const { summaryRows, campaignRows, importRows } = buildReportData(props);

  const wb = XLSX.utils.book_new();

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  wsSummary['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  const wsCampaigns = XLSX.utils.aoa_to_sheet(campaignRows);
  wsCampaigns['!cols'] = [{ wch: 35 }, { wch: 15 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, wsCampaigns, 'Campaigns');

  const wsImports = XLSX.utils.aoa_to_sheet(importRows);
  wsImports['!cols'] = [
    { wch: 15 },
    { wch: 18 },
    { wch: 12 },
    { wch: 10 },
    { wch: 15 },
  ];
  XLSX.utils.book_append_sheet(wb, wsImports, 'Imports');

  XLSX.writeFile(
    wb,
    `crm-dashboard-report-${new Date().toISOString().slice(0, 10)}.xlsx`,
  );
}

// -- Component ---------------------------------------------------------------

export function DashboardExportButton(props: ExportButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="cursor-pointer gap-2"
          onClick={() => exportAsCSV(props)}
        >
          <FileText className="h-4 w-4" />
          Download as CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer gap-2"
          onClick={() => exportAsExcel(props)}
        >
          <FileSpreadsheet className="h-4 w-4" />
          Download as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
