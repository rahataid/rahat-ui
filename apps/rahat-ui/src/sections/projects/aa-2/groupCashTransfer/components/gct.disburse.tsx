'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { Loader2 } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
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
import { HeaderWithBack, SpinnerLoader } from 'apps/rahat-ui/src/common';
import { useGetOneGctRecord, useDisburseGroupCashTransfer } from '@rahat-ui/query';
import { useUserCurrentUser } from '@rumsan/react-query';

// ponytail: no backend OTP send/verify endpoints exist yet — pin entry is simulated client-side,
// only the final disburse call hits the real API. Swap in real verify once available.
export default function GctDisburse() {
  const { id, recordUuid } = useParams();
  const router = useRouter();
  const projectUUID = id as UUID;
  const backPath = `/projects/aa/${id}/group-cash-transfer/records/${recordUuid}`;
  const recordsListPath = `/projects/aa/${id}/group-cash-transfer?tab=gctManagementList`;

  const { data, isLoading } = useGetOneGctRecord(projectUUID, recordUuid as string);
  const disburse = useDisburseGroupCashTransfer(projectUUID);
  const { data: currentUser } = useUserCurrentUser();

  const record = data?.data ?? data ?? null;
  const group = record?.groupCashTransfer ?? null;
  const email = currentUser?.data?.email;

  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <SpinnerLoader />
      </div>
    );
  }

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
    await disburse.mutateAsync({ uuid: recordUuid as string });
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
    <div className="p-4">
      <HeaderWithBack
        title="Disburse Fund"
        subtitle="Verify the Rahat Pin to initiate disbursement"
        path={backPath}
      />

      <div className="flex justify-center">
        <Card className="rounded-sm max-w-lg w-full">
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

            <div className="border-t pt-4">
              <p className="text-lg text-foreground">
                A Rahat Pin has been sent to{' '}
                <span className="font-semibold">{email || 'the registered email'}</span>.
                Please enter it below to verify and start disbursment.
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
              {pinError && <p className="text-sm text-destructive mt-2">{pinError}</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Disbursement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disburse{' '}
              <span className="font-semibold text-foreground">{amountFmt}</span>{' '}
              to{' '}
              <span className="font-semibold text-foreground">"{group?.name}"</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={disburse.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={disburse.isPending}>
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
    </div>
  );
}
