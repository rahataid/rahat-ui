'use client';

import { useGetPayoutLog, useTriggerForOnePayoutFailed } from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import {
  DataCard,
  HeaderWithBack,
  TableLoader,
} from 'apps/rahat-ui/src/common';
import { intlFormatDate } from 'apps/rahat-ui/src/utils';
import {
  isPayoutTransactionFailed,
  transactionBgStatus,
} from 'apps/rahat-ui/src/utils/get-status-bg';
import { UUID } from 'crypto';
import {
  ArrowUpRight,
  Coins,
  ExternalLink,
  RotateCcw,
  Ticket,
} from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import InfoItem from './infoItem';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useCallback } from 'react';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { ONE_TOKEN_VALUE } from 'apps/rahat-ui/src/constants/aa.constants';

export default function BeneficiaryTransactionLogDetails() {
  const { id, uuid } = useParams();
  const router = useRouter();
  const groupId = useSearchParams().get('groupId');

  const triggerForPayoutFailed = useTriggerForOnePayoutFailed();

  const { data, isLoading: payoutLogsLoading } = useGetPayoutLog(id as UUID, {
    uuid,
  });
  const { status, transactionType, amount } = data?.data || {};

  const handleTriggerSinglePayoutFailed = useCallback(async () => {
    triggerForPayoutFailed.mutateAsync({
      projectUUID: id as UUID,
      payload: {
        beneficiaryRedeemUuid: uuid as string,
      },
    });
  }, [triggerForPayoutFailed]);

  let totalSuccessAmount = 0;
  let totalFailedAmount = 0;

  // Success Amount Logic
  if (
    (status === 'COMPLETED' && transactionType === 'VENDOR_REIMBURSEMENT') ||
    ((status === 'FIAT_TRANSFER_COMPLETED' ||
      status === 'TOKEN_TRANSACTION_COMPLETED') &&
      transactionType === 'TOKEN_TRANSFER')
  ) {
    totalSuccessAmount = amount * ONE_TOKEN_VALUE;
  }

  // Failed Amount Logic
  if (
    (status !== 'COMPLETED' && transactionType === 'VENDOR_REIMBURSEMENT') ||
    ((status !== 'FAIT_TRANSFER_COMPLETED' ||
      status !== 'TOKEN_TRANSACTION_COMPLETED') &&
      transactionType === 'FIAT_TRANSFER')
  ) {
    totalFailedAmount = 0; // or you can assign actual amount if required
  }

  if (payoutLogsLoading) {
    return <TableLoader />;
  }
  const handleRedirect = () => {
    router.push(
      `/beneficiary/${data?.data?.Beneficiary?.uuid}?projectId=${id}&groupId=${
        groupId as string
      }&txnDetailsId=${uuid}`,
    );
  };
  return (
    <div className="p-4 md:p-6  space-y-6">
      <div className=" flex justify-between items-center">
        <HeaderWithBack
          path={`/projects/aa/${id as string}/payout/details/${
            groupId as string
          }`}
          subtitle="Detaild view of the selected payout transaction log"
          title="Transaction Log Details"
        />
        {data?.data?.payout?.type === 'FSP' && (
          <RoleAuth roles={[AARoles.ADMIN]} hasContent={false}>
            <Button
              className={`gap-2 text-sm ${
                !isPayoutTransactionFailed(data?.data?.status) && 'hidden'
              }`}
              onClick={handleTriggerSinglePayoutFailed}
            >
              <RotateCcw className="w-4 h-4" />
              Retry
            </Button>
          </RoleAuth>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
        <DataCard
          title="Actual Budget"
          Icon={Coins}
          smallNumber={`Rs. ${data?.data?.amount * ONE_TOKEN_VALUE}`}
          className="h-24 w-full rounded-sm pt-1"
        />

        <DataCard
          title="Amount Disbursed"
          Icon={Coins}
          smallNumber={`Rs. ${
            totalSuccessAmount.toString() || totalFailedAmount.toString()
          }`}
          className="h-24 w-full rounded-sm pt-1"
        />
        {data?.data?.status.endsWith('COMPLETED') && (
          <>
            <DataCard
              title="Payout Type"
              Icon={Ticket}
              badge={true}
              smallNumber={
                data?.data?.payout?.type === 'VENDOR'
                  ? 'CVA'
                  : data?.data?.payout?.type
              }
              className="h-24 w-full rounded-sm"
            />

            <DataCard
              title="Payout Method"
              Icon={Ticket}
              badge={true}
              smallNumber={
                data?.data?.payout?.type === 'FSP'
                  ? data?.data?.payout?.extras?.paymentProviderName
                      .split('_')
                      .join(' ')
                  : data?.data?.payout?.mode
              }
              className="h-24 w-full rounded-sm"
            />
          </>
        )}
      </div>

      <Card className="rounded-sm">
        <CardContent className="space-y-6 p-4 ">
          <div className="inline-flex items-center gap-3 text-lg font-semibold text-[#2c2f3c] ">
            Beneficiary Details
            <ArrowUpRight
              className="w-5 h-5 text-blue-500 hover:cursor-pointer"
              onClick={handleRedirect}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoItem
              label="Beneficiary Wallet Address"
              value={data?.data?.beneficiaryWalletAddress}
              copyable
            />
            <InfoItem
              label="Transaction Wallet ID"
              value={data?.data?.info?.offrampWalletAddress}
              copyable
            />
            <InfoItem
              label="Transaction Hash"
              value={data?.data?.txHash}
              link
              copyable
            />
            <InfoItem label="Payout Status">
              <Badge
                className={`rounded-xl w-auto ${transactionBgStatus(
                  data?.data?.status,
                )}`}
              >
                {data?.data?.status
                  .toLowerCase()
                  .split('_')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </Badge>
            </InfoItem>
            <InfoItem label="Transaction Type">
              <Badge className="text-muted-foreground">
                {data?.data?.transactionType.split('_').join(' ')}
              </Badge>
            </InfoItem>

            {data?.data?.payout?.type === 'FSP' && (
              <>
                <InfoItem
                  label="Bank Name"
                  value={data?.data?.Beneficiary?.extras?.bank_name}
                />
                <InfoItem
                  label="Bank Account Number"
                  value={data?.data?.Beneficiary?.extras?.bank_ac_number}
                />
                <InfoItem
                  label="Bank Account Name"
                  value={data?.data?.Beneficiary?.extras?.bank_ac_name}
                />
              </>
            )}

            <InfoItem
              label="Created At"
              value={intlFormatDate(data?.data?.createdAt)}
            />

            <InfoItem
              label="Updated At"
              value={intlFormatDate(data?.data?.updatedAt)}
            />

            {data?.data?.payout?.type === 'FSP' && (
              <>
                <InfoItem
                  label="No. of Attempts"
                  value={data?.data?.info?.numberOfAttempts}
                />
              </>
            )}

            {data?.data?.info?.error && (
              <InfoItem
                label="Message"
                value={data?.data?.info?.error}
                failed
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
