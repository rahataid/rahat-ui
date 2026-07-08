'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import {
  Dialog,
  DialogContent,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import {
  useConfirmDisburseGroupCashTransfer,
  usePaymentProviders,
  usePhasePayoutStatus,
} from '@rahat-ui/query';

type PaymentProvider = { id: number | string; name: string; type: string; createdAt: string };

// ─── DisburseModal ────────────────────────────────────────────────────────────
// Shows disbursement summary, provider selection, and confirm alert.

export function DisburseModal({
  projectUUID,
  recordUuid,
  record,
  group,
  open,
  onOpenChange,
}: {
  projectUUID: UUID;
  recordUuid: string;
  record: any;
  group: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const recordsListPath = `/projects/aa/${projectUUID}/group-cash-transfer?tab=gctManagementList`;
  const confirmDisburse = useConfirmDisburseGroupCashTransfer(projectUUID);
  const { data: providers, isLoading: providersLoading } = usePaymentProviders({ projectUUID });

  const [providerId, setProviderId] = useState<string>('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const amountFmt = `Nrs. ${record?.amount?.toLocaleString() || '—'}`;
  const selectedProvider = providers?.find((p: PaymentProvider) => String(p.id) === providerId);

  const summaryRows: [string, string][] = [
    ['Group Name', group?.name || '—'],
    ['Amount', amountFmt],
    ['Phone', group?.phone || '—'],
    ['Account Holder Name', group?.bankDetails?.accountName || '—'],
    ['Bank Account Number', group?.bankDetails?.accountNumber || '—'],
  ];

  const handleConfirm = async () => {
    setConfirmOpen(false);
    await confirmDisburse.mutateAsync({ uuid: recordUuid, paymentProviderId: providerId });
    onOpenChange(false);
    router.push(recordsListPath);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg p-0" onInteractOutside={(e) => e.preventDefault()}>
          <Card className="rounded-sm border-0 shadow-none">
            <CardContent className="p-5 space-y-4">
              <h2 className="text-xl font-semibold">Disbursement Details</h2>
              <div className="text-base divide-y">
                {summaryRows.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between py-2.5">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium font-mono">{value}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <p className="text-sm font-medium">Select Payment Provider</p>
                <Select value={providerId} onValueChange={setProviderId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={providersLoading ? 'Loading…' : 'Select a provider'} />
                  </SelectTrigger>
                  <SelectContent>
                    {(providers ?? []).map((p: PaymentProvider) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  className="w-full"
                  disabled={!providerId || confirmDisburse.isPending}
                  onClick={() => setConfirmOpen(true)}
                >
                  Proceed
                </Button>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Disbursement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disburse{' '}
              <span className="font-semibold text-foreground">{amountFmt}</span>{' '}
              to{' '}
              <span className="font-semibold text-foreground">&quot;{group?.name}&quot;</span>{' '}
              via{' '}
              <span className="font-semibold text-foreground">{selectedProvider?.name ?? '—'}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={confirmDisburse.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={confirmDisburse.isPending}>
              {confirmDisburse.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Disbursing…</>
              ) : (
                'Yes, Disburse'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ─── DisburseButton ───────────────────────────────────────────────────────────
// Checks payout phase activation and shows tooltip when disabled.

export function DisburseButton({
  projectUUID,
  loading,
  disabled,
  disabledReason,
  onClick,
}: {
  projectUUID: UUID;
  loading?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  onClick: () => void;
}) {
  const { data: payoutStatus } = usePhasePayoutStatus(projectUUID);
  const canDisburse = !!payoutStatus?.isPayoutMethodPhaseActivated;
  const isDisabled = !canDisburse || loading || disabled;
  const tip = !canDisburse ? 'Phase not triggered.' : disabledReason;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="mt-1">
            <Button
              size="sm"
              disabled={isDisabled}
              className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              onClick={onClick}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Disburse
            </Button>
          </span>
        </TooltipTrigger>
        {isDisabled && tip && <TooltipContent>{tip}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
}
