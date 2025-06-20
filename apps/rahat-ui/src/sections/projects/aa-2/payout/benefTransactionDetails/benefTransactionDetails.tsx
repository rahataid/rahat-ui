'use client';

import { useGetPayoutLog, useTriggerForOnePayoutFailed } from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { DataCard, HeaderWithBack } from 'apps/rahat-ui/src/common';
import { intlFormatDate } from 'apps/rahat-ui/src/utils';
import {
  isPayoutTransactionFailed,
  transactionBgStatus,
} from 'apps/rahat-ui/src/utils/get-status-bg';
import { UUID } from 'crypto';
import { Coins, RotateCcw } from 'lucide-react';
import { useParams } from 'next/navigation';
import InfoItem from './infoItem';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useCallback } from 'react';

export default function BeneficiaryTransactionLogDetails() {
  const { id, uuid } = useParams();
  const triggerForPayoutFailed = useTriggerForOnePayoutFailed();

  const { data, isLoading: payoutLogsLoading } = useGetPayoutLog(id as UUID, {
    uuid,
  });
  const handleTriggerSinglePayoutFailed = useCallback(async () => {
    triggerForPayoutFailed.mutateAsync({
      projectUUID: id as UUID,
      payload: {
        beneficiaryRedeemUuid: uuid as string,
      },
    });
  }, [triggerForPayoutFailed]);
  return (
    <div className="p-4 md:p-6  space-y-6">
      <div className=" flex justify-between items-center">
        <HeaderWithBack
          path=""
          subtitle="Detaild view of the selected payout transaction log"
          title="Transaction Log Details"
        />

        <Button
          className={`gap-2 text-sm ${
            isPayoutTransactionFailed(data?.data?.status) && 'hidden'
          }`}
          onClick={handleTriggerSinglePayoutFailed}
        >
          <RotateCcw className="w-4 h-4" />
          Retry
        </Button>
      </div>
      <DataCard
        title="Token Assigned"
        Icon={Coins}
        number={data?.data?.amount}
        className="max-w-md rounded-sm"
      />

      <Card className="rounded-sm">
        <CardContent className="space-y-6 p-4 ">
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
            <InfoItem
              label="Transaction Type"
              value={data?.data?.transactionType}
            />
            <InfoItem label="Payout Type" value={data?.data?.payout?.type} />
            <InfoItem
              label="Payout Mode"
              value={data?.data?.payout?.extras?.paymentProviderName}
            />
            <InfoItem
              label="Bank Name"
              value={data?.data?.Beneficiary?.extras?.bank_name}
            />
            <InfoItem
              label="Bank Account Number"
              value={data?.data?.Beneficiary?.extras?.bank_ac_number}
            />

            <InfoItem
              label="Created At"
              value={intlFormatDate(data?.data?.createdAt)}
            />

            <InfoItem
              label="Updated At"
              value={intlFormatDate(data?.data?.updatedAt)}
            />
            <InfoItem
              label="No. of Attempts"
              value={data?.data?.info?.numberOfAttempts}
            />
            <InfoItem label="Message" value={data?.data?.info?.message} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
