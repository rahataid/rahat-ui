'use client';

import * as React from 'react';
import * as XLSX from 'xlsx';
import { UUID } from 'crypto';
import { Button } from '@rahat-ui/shadcn/components/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { Download } from 'lucide-react';
import { useFetchSessionBroadcasts } from '@rahat-ui/query';
import { normalizePhoneAddress } from './const';

type CampaignBroadcastActionsProps = {
  projectUUID: UUID;
  sessionIds: string[];
  campaignName: string;
  filters?: { status?: string; address?: string };
};

export default function CampaignBroadcastActions({
  projectUUID,
  sessionIds,
  campaignName,
  filters,
}: CampaignBroadcastActionsProps) {
  const fetchSessionBroadcasts = useFetchSessionBroadcasts(projectUUID);

  const validSessionIds = sessionIds.filter(Boolean);

  const collectBroadcasts = React.useCallback(
    async (extraFilters?: Record<string, string | undefined>) => {
      const all: any[] = [];
      for (const sessionId of validSessionIds) {
        const broadcasts = await fetchSessionBroadcasts.mutateAsync({
          sessionId,
          filters: extraFilters,
        });
        all.push(...broadcasts);
      }
      return all;
    },
    [validSessionIds, fetchSessionBroadcasts],
  );

  const handleExport = async () => {
    const broadcasts = await collectBroadcasts({
      status: filters?.status,
      address: filters?.address,
    });
    if (!broadcasts.length) return;

    const exportData = broadcasts.map((b) => ({
      Audience: normalizePhoneAddress(b.address) || b.address || '',
      Status: b.status,
      Attempts: b.attempts ?? '',
      Price: b?.disposition?.price ?? '',
      Error:
        b?.disposition?.message ||
        b?.disposition?.data?.message ||
        b?.disposition?.error ||
        b?.disposition?.reason ||
        '',
      'Last Attempt': b.lastAttempt || b.createdAt || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Delivery Logs');
    XLSX.writeFile(
      workbook,
      `${campaignName.replace(/\s+/g, '-').toLowerCase()}-delivery-logs-${new Date()
        .toISOString()
        .split('T')[0]}.xlsx`,
    );
  };

  if (!validSessionIds.length) return null;

  const isBusy = fetchSessionBroadcasts.isPending;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleExport}
          disabled={isBusy}
          className="gap-2"
        >
          <Download className="h-3.5 w-3.5" />
          Export
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        Download all delivery logs for this campaign
        {filters?.status || filters?.address ? ' (current filters applied)' : ''}
      </TooltipContent>
    </Tooltip>
  );
}
