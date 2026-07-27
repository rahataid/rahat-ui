'use client';

import * as React from 'react';
import * as XLSX from 'xlsx';
import { UUID } from 'crypto';
import { Button } from '@rahat-ui/shadcn/components/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { Download, Loader2, RefreshCcw } from 'lucide-react';
import {
  useFetchBulkSessionBroadcasts,
  useListElCrmTransport,
  useRetryFailedViaCampaign,
} from '@rahat-ui/query';
import { normalizePhoneAddress } from './const';

type CampaignBroadcastActionsProps = {
  projectUUID: UUID;
  sessionIds: string[];
  campaignName: string;
  /** Limits retry button to WhatsApp campaigns only. */
  isWhatsApp?: boolean;
  targetType?: string;
  messageBody?: string;
  filters?: {
    status?: string;
    address?: string;
    startDate?: string;
    endDate?: string;
  };
};

export default function CampaignBroadcastActions({
  projectUUID,
  sessionIds,
  campaignName,
  isWhatsApp,
  targetType,
  messageBody,
  filters,
}: CampaignBroadcastActionsProps) {
  const fetchBulkBroadcasts = useFetchBulkSessionBroadcasts(projectUUID);
  const retryViaCampaign = useRetryFailedViaCampaign(projectUUID);
  const transport = useListElCrmTransport(projectUUID);

  const validSessionIds = sessionIds.filter(Boolean);

  const collectBroadcasts = React.useCallback(
    async (extraFilters?: Record<string, string | undefined>) =>
      fetchBulkBroadcasts.mutateAsync({
        sessions: validSessionIds,
        filters: extraFilters,
      }),
    [validSessionIds.join(',')],
  );

  // ── Retryable-failure check ───────────────────────────────────────────────
  const [retryablePhones, setRetryablePhones] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (!isWhatsApp || !validSessionIds.length) return;

    let cancelled = false;
    (async () => {
      const failed = await collectBroadcasts({ status: 'FAIL' });
      const phones = Array.from(
        new Set(
          failed
            .filter((b) => normalizePhoneAddress(b.address))
            .map((b) => normalizePhoneAddress(b.address) as string),
        ),
      );
      if (!cancelled) setRetryablePhones(phones);
    })();

    return () => {
      cancelled = true;
    };
  }, [isWhatsApp, validSessionIds.join(',')]);

  // ── Transport-picker dialog ───────────────────────────────────────────────
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedTransportId, setSelectedTransportId] = React.useState('');

  const availableTransports: { cuid: string; name: string }[] = (
    transport.data ?? []
  ).filter((t: any) => !!t.cuid && !!t.name);

  const handleRetryClick = () => {
    setSelectedTransportId(availableTransports[0]?.cuid ?? '');
    setDialogOpen(true);
  };

  const handleRetryConfirm = async () => {
    if (!selectedTransportId || !retryablePhones.length) return;
    setDialogOpen(false);
    await retryViaCampaign.mutateAsync({
      name: `${campaignName} - Retry`,
      targetType: targetType ?? 'VENDOR',
      transportId: selectedTransportId,
      message: messageBody ?? '',
      phoneNumbers: retryablePhones,
    });
  };

  // ── Export ────────────────────────────────────────────────────────────────
  const handleExport = async () => {
    const broadcasts = await collectBroadcasts({
      status: filters?.status,
      address: filters?.address,
      startDate: filters?.startDate,
      endDate: filters?.endDate,
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
      `${campaignName.replace(/\s+/g, '-').toLowerCase()}-delivery-logs-${
        new Date().toISOString().split('T')[0]
      }.xlsx`,
    );
  };

  if (!validSessionIds.length) return null;

  const isBusy = fetchBulkBroadcasts.isPending || retryViaCampaign.isPending;

  return (
    <>
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
            {fetchBulkBroadcasts.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            {fetchBulkBroadcasts.isPending ? 'Exporting…' : 'Export'}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Download all delivery logs for this campaign
          {filters?.status ||
          filters?.address ||
          (filters?.startDate && filters?.endDate)
            ? ' (current filters applied)'
            : ''}
        </TooltipContent>
      </Tooltip>

      {isWhatsApp && retryablePhones.length > 0 && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleRetryClick}
                disabled={isBusy}
                className="gap-2"
              >
                {retryViaCampaign.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCcw className="h-3.5 w-3.5" />
                )}
                Retry failed ({retryablePhones.length})
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {retryablePhones.length} failed recipient
              {retryablePhones.length !== 1 ? 's' : ''} — resend via a different
              transport
            </TooltipContent>
          </Tooltip>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Choose a transport to retry with</DialogTitle>
              </DialogHeader>

              <p className="text-sm text-muted-foreground">
                {retryablePhones.length} recipient
                {retryablePhones.length !== 1 ? 's' : ''} failed. Select a
                transport to resend the message to them.
              </p>

              <div className="flex flex-col gap-2 py-1">
                {availableTransports.map((t) => (
                  <label
                    key={t.cuid}
                    className={`flex items-center gap-3 rounded-md border px-3 py-2.5 cursor-pointer text-sm transition-colors ${
                      selectedTransportId === t.cuid
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="retryTransport"
                      value={t.cuid}
                      checked={selectedTransportId === t.cuid}
                      onChange={() => setSelectedTransportId(t.cuid)}
                      className="accent-primary"
                    />
                    {t.name}
                  </label>
                ))}
                {availableTransports.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    No transports available.
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  disabled={!selectedTransportId || retryViaCampaign.isPending}
                  onClick={handleRetryConfirm}
                >
                  {retryViaCampaign.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                  ) : null}
                  Create retry campaign
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}
