'use client';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { Download } from 'lucide-react';
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

// -- Export Logic -----------------------------------------------------------

function generateTextReport(props: ExportButtonProps): string {
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

  let text = '================================================================================\n';
  text += 'RAHAT CRM - DASHBOARD REPORT\n';
  text += `Generated: ${timestamp}\n`;
  text += '================================================================================\n\n';

  // KPI Summary
  text += '--- KPI SUMMARY ---\n';
  text += `Total Customers:        ${totalCustomers.toLocaleString()}\n`;
  text += `Active:                 ${activeCustomers.toLocaleString()} (${activePct}%)\n`;
  text += `Newly Inactive:         ${newlyInactiveCustomers.toLocaleString()} (${newlyInactivePct}%)\n`;
  text += `Inactive:               ${inactiveCustomers.toLocaleString()} (${inactivePct}%)\n`;
  text += `Total Messages Sent:    ${commStats.totalMessages.toLocaleString()}\n`;
  text += `Messages Delivered:     ${commStats.sent.toLocaleString()}\n`;
  text += `Messages Failed:        ${commStats.failed.toLocaleString()}\n`;
  text += `Messages Skipped:       ${commStats.skipped.toLocaleString()}\n`;
  text += `Delivery Rate:          ${commStats.deliveryRate}%\n\n`;

  // Automation Health
  text += '--- AUTOMATION HEALTH ---\n';
  text += `Total Rules:            ${automationHealth.totalRules}\n`;
  text += `Enabled Rules:          ${automationHealth.enabledRules}\n`;
  text += `Last Triggered:         ${timeAgo(automationHealth.lastTriggeredAt)}\n\n`;

  // Data Quality
  text += '--- DATA QUALITY ---\n';
  text += `Failed Import Batches:  ${failedBatchCount}\n\n`;

  // Recent Campaigns
  text += '--- RECENT CAMPAIGNS (Last 5) ---\n';
  if (recentCampaigns.length > 0) {
    recentCampaigns.forEach((campaign, idx) => {
      text += `${idx + 1}. ${campaign.name}\n`;
      text += `   Recipients: ${campaign.recipientCount.toLocaleString()}\n`;
      text += `   Date: ${formatDate(campaign.createdAt)}\n`;
    });
  } else {
    text += 'No campaigns yet\n';
  }
  text += '\n';

  // Recent Imports
  text += '--- RECENT IMPORTS ---\n';
  if (recentImports.length > 0) {
    recentImports.forEach((imp, idx) => {
      const succeeded = Array.isArray(imp.successVendors)
        ? imp.successVendors.length
        : 0;
      const failedCount = Array.isArray(imp.failedVendors)
        ? imp.failedVendors.length
        : 0;
      const total = succeeded + failedCount;
      text += `${idx + 1}. ${new Date(imp.createdAt).toLocaleDateString()}\n`;
      text += `   Records Processed: ${total}\n`;
      text += `   Successful: ${succeeded}\n`;
      text += `   Failed: ${failedCount}\n`;
      text += `   Status: ${imp.status}\n`;
    });
  } else {
    text += 'No import activity yet\n';
  }
  text += '\n';

  text += '================================================================================\n';
  text += 'End of Report\n';
  text += '================================================================================\n';

  return text;
}

function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// -- Component ---------------------------------------------------------------

export function DashboardExportButton(props: ExportButtonProps) {
  const handleExport = () => {
    const textContent = generateTextReport(props);
    const filename = `crm-dashboard-report-${new Date().toISOString().slice(0, 10)}.txt`;
    downloadTextFile(textContent, filename);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleExport}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Export dashboard data as text</p>
      </TooltipContent>
    </Tooltip>
  );
}
