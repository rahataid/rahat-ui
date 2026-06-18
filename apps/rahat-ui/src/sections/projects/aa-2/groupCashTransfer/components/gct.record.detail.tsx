'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { Pencil, Send, Loader2 } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { format } from 'date-fns';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
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
import { SpinnerLoader, Back } from 'apps/rahat-ui/src/common';
import {
  useGetOneGctRecord,
  usePhasePayoutStatus,
  useDisburseGroupCashTransfer,
} from '@rahat-ui/query';
import { useUserCurrentUser } from '@rumsan/react-query';
import { GCT_STATUS_STYLE } from '../types/gct.types';

// ponytail: no backend OTP send/verify endpoints exist yet — pin entry is simulated client-side,
// only the final disburse call hits the real API. Swap in real verify once available.
function DisburseModal({
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
  const disburse = useDisburseGroupCashTransfer(projectUUID);
  const { data: currentUser } = useUserCurrentUser();
  const email = currentUser?.data?.email;

  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleVerify = () => {
    if (pin.length !== 6) {
      setPinError('Enter the 6 digit pin.');
      return;
    }
    setPinError('');
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    await disburse.mutateAsync({ uuid: recordUuid });
    onOpenChange(false);
    router.push(recordsListPath);
  };

  const amountFmt = `Nrs. ${record?.amount?.toLocaleString() || '—'}`;

  const summaryRows: [string, string][] = [
    ['Group Name', group?.name || '—'],
    ['Amount', amountFmt],
    ['Phone', group?.phone || '—'],
    ['Account Holder Name', group?.bankDetails?.accountName || '—'],
    ['Bank Account Number', group?.bankDetails?.accountNumber || '—'],
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg p-0">
          <Card className="rounded-sm border-0 shadow-none">
            <CardContent className="p-5 space-y-4">
              <h2 className="text-xl font-semibold">Disbursement Details</h2>
              <div className="text-base divide-y">
                {summaryRows.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-2.5"
                  >
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium font-mono">{value}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <p className="text-lg text-foreground">
                  A Rahat Pin has been sent to{' '}
                  <span className="font-semibold">
                    {email || 'the registered email'}
                  </span>
                  . Please enter it below to verify and start disbursment.
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <Input
                    placeholder="6 digit pin"
                    maxLength={6}
                    inputMode="numeric"
                    autoFocus
                    className="h-11 text-lg"
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value.replace(/\D/g, ''));
                      setPinError('');
                    }}
                  />
                  <Button
                    size="lg"
                    disabled={disburse.isPending}
                    onClick={handleVerify}
                  >
                    Verify
                  </Button>
                </div>
                {pinError && (
                  <p className="text-sm text-destructive mt-2">{pinError}</p>
                )}
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
              <span className="font-semibold text-foreground">
                {amountFmt}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-foreground">
                &quot;{group?.name}&quot;
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={disburse.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={disburse.isPending}
            >
              {disburse.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Disbursing…
                </>
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

function DisburseButton({
  projectUUID,
  onClick,
}: {
  projectUUID: UUID;
  onClick: () => void;
}) {
  const { data: payoutStatus } = usePhasePayoutStatus(projectUUID);
  const canDisburse = !!payoutStatus?.isPayoutMethodPhaseActivated;

  return (
    <Button
      size="sm"
      disabled={!canDisburse}
      className="gap-1.5 mt-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
      onClick={onClick}
    >
      <Send className="h-4 w-4" />
      Disburse
    </Button>
  );
}

function fmt(date?: string | null) {
  if (!date) return '—';
  try {
    return format(new Date(date), 'MMM dd, yyyy  hh:mm a');
  } catch {
    return date;
  }
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 border-b last:border-b-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${mono ? 'font-mono break-all' : ''}`}>
        {value || '—'}
      </span>
    </div>
  );
}

export default function GctRecordDetail() {
  const { id, recordUuid } = useParams();
  const router = useRouter();
  const projectUUID = id as UUID;
  const backPath = `/projects/aa/${id}/group-cash-transfer?tab=gctManagementList`;
  const editPath = `/projects/aa/${id}/group-cash-transfer/records/${recordUuid}/edit`;
  const { data, isLoading } = useGetOneGctRecord(
    projectUUID,
    recordUuid as string,
  );

  const [disburseOpen, setDisburseOpen] = useState(false);

  const record = data?.data ?? data ?? null;
  const group = record?.groupCashTransfer ?? null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <SpinnerLoader />
      </div>
    );
  }

  const status = record?.status ?? 'NOT_STARTED';

  return (
    <div className="p-4">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Back path={backPath} />
          <h1 className="text-2xl font-semibold">{record?.title ?? 'Fund Record'}</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Group Cash Transfer fund record details
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 mt-1"
            onClick={() => router.push(editPath)}
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <DisburseButton
            projectUUID={projectUUID}
            onClick={() => setDisburseOpen(true)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="rounded-sm">
          <CardContent className="px-4 pt-4 pb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Record Information
            </p>
            <DetailRow label="Amount" value={record?.amount?.toLocaleString()} />
            <div className="flex flex-col gap-0.5 py-2.5 border-b">
              <span className="text-xs text-muted-foreground">Status</span>
              <Badge
                className={`w-fit text-xs ${GCT_STATUS_STYLE[status] ?? 'bg-gray-100 text-gray-600'}`}
              >
                {status.replace(/_/g, ' ')}
              </Badge>
            </div>
            <DetailRow label="Created By" value={record?.createdBy} />
            <DetailRow label="Created At" value={fmt(record?.createdAt)} />
            <DetailRow label="Updated At" value={fmt(record?.updatedAt)} />
            <DetailRow label="Disbursed At" value={fmt(record?.disbursedAt)} />
          </CardContent>
        </Card>

        <Card className="rounded-sm">
          <CardContent className="px-4 pt-4 pb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              GCT Group
            </p>
            <DetailRow label="Group Name" value={group?.name} />
            <DetailRow label="Phone" value={group?.phone} />
            {group?.bankDetails && (
              <>
                <DetailRow label="Bank Name" value={group.bankDetails?.bankName} />
                <DetailRow label="Bank Branch" value={group.bankDetails?.bankBranchName} />
                <DetailRow label="Account Holder Name" value={group.bankDetails?.accountName} />
                <DetailRow label="Account Number" value={group.bankDetails?.accountNumber} mono />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <DisburseModal
        projectUUID={projectUUID}
        recordUuid={recordUuid as string}
        record={record}
        group={group}
        open={disburseOpen}
        onOpenChange={setDisburseOpen}
      />
    </div>
  );
}
