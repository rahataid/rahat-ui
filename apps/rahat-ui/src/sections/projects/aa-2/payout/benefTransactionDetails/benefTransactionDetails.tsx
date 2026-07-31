'use client';

import { useTranslations } from 'next-intl';
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
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

export default function BeneficiaryTransactionLogDetails() {
  const tv = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const { id, uuid } = useParams();
  const router = useRouter();
  const groupId = useSearchParams().get('groupId');
  const searchParams = useSearchParams();
  const navigation = searchParams.get('from');
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
    ((status === 'FIAT_TRANSACTION_COMPLETED' ||
      status === 'TOKEN_TRANSACTION_COMPLETED') &&
      (transactionType === 'TOKEN_TRANSFER' ||
        transactionType === 'FIAT_TRANSFER'))
  ) {
    totalSuccessAmount = amount * ONE_TOKEN_VALUE;
  }

  // Failed Amount Logic
  if (
    (status !== 'COMPLETED' && transactionType === 'VENDOR_REIMBURSEMENT') ||
    ((status !== 'FAIT_TRANSACTION_COMPLETED' ||
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
          }?from=${navigation ? navigation : ''}`}
          subtitle={tv('DETAIL_VIEW_OF_THE_SELECTED_PAYOUT')}
          title={tv('TRANSACTION_LOG_DETAILS')}
        />
        {data?.data?.payout?.type === 'FSP' && (
          <RoleAuth
            roles={[AARoles.ADMIN, AARoles.Municipality]}
            hasContent={false}
          >
            <Button
              className={`gap-2 text-sm ${
                !isPayoutTransactionFailed(data?.data?.status) && 'hidden'
              }`}
              onClick={handleTriggerSinglePayoutFailed}
            >
              <RotateCcw className="w-4 h-4" />
              {tg('RETRY')}
            </Button>
          </RoleAuth>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
        <DataCard
          title={tv('ACTUAL_BUDGET')}
          Icon={Coins}
          smallNumber={`Rs. ${formatNum(data?.data?.amount * ONE_TOKEN_VALUE)}`}
          className="h-24 w-full rounded-sm pt-1"
        />

        <DataCard
          title={tv('AMOUNT_DISBURSED')}
          Icon={Coins}
          smallNumber={`Rs. ${formatNum(totalSuccessAmount || totalFailedAmount || 0)}`}
          className="h-24 w-full rounded-sm pt-1"
        />
        {data?.data?.status.endsWith('COMPLETED') && (
          <>
            <DataCard
              title={tv('PAYOUT_TYPE')}
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
              title={tv('PAYOUT_METHOD')}
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
            {tv('BENEFICIARY_DETAILS')}
            <ArrowUpRight
              className="w-5 h-5 text-blue-500 hover:cursor-pointer"
              onClick={handleRedirect}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoItem
              label={tv('BENEFICIARY_WALLET_ADDRESS')}
              value={data?.data?.beneficiaryWalletAddress}
              copyable
            />
            <InfoItem
              label={tv('TRANSACTION_WALLET_ID')}
              value={data?.data?.info?.offrampWalletAddress}
              copyable
            />
            <InfoItem
              label={tv('TRANSACTION_HASH')}
              value={data?.data?.txHash}
              link
              copyable
            />
            <InfoItem label={tv('PAYOUT_STATUS')}>
              <Badge
                className={`rounded-xl w-auto ${transactionBgStatus(
                  data?.data?.status,
                )}`}
              >
                {data?.data?.status ? tg(data.data.status) : ''}
              </Badge>
            </InfoItem>
            <InfoItem label={tv('TRANSACTION_TYPE')}>
              <Badge className="text-muted-foreground">
                {data?.data?.transactionType.split('_').join(' ')}
              </Badge>
            </InfoItem>

            {data?.data?.payout?.type === 'FSP' && (
              <>
                <InfoItem
                  label={tv('BANK_NAME')}
                  value={data?.data?.Beneficiary?.extras?.bank_name}
                />
                <InfoItem
                  label={tv('BANK_ACCOUNT_NUMBER')}
                  value={data?.data?.Beneficiary?.extras?.bank_ac_number}
                />
                <InfoItem
                  label={tv('BANK_ACCOUNT_NAME')}
                  value={data?.data?.Beneficiary?.extras?.bank_ac_name}
                />
              </>
            )}

            <InfoItem
              label={tg('CREATED_AT')}
              value={intlFormatDate(data?.data?.createdAt)}
            />

            <InfoItem
              label={tv('UPDATED_AT')}
              value={intlFormatDate(data?.data?.updatedAt)}
            />

            {data?.data?.payout?.type === 'FSP' && (
              <>
                <InfoItem
                  label={tv('NO_OF_ATTEMPTS')}
                  value={data?.data?.info?.numberOfAttempts}
                />
              </>
            )}

            {data?.data?.info?.error && (
              <InfoItem
                label={tg('MESSAGE')}
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
