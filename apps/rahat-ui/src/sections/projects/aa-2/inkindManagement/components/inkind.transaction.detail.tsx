'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { DataCard, HeaderWithBack } from 'apps/rahat-ui/src/common';
import { formatDate } from '../inkind.helpers';
import InfoItem from 'apps/rahat-ui/src/sections/projects/aa-2/payout/benefTransactionDetails/infoItem';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

export default function InkindTransactionDetail() {
  const tv = useTranslations('AA_PROJECT_WITH_GNOSIS');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const { id, allocationId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const sp = useSearchParams();

  const beneficiaryWalletAddress = sp.get('beneficiaryWalletAddress') ?? '';
  const beneficiaryPhone = sp.get('beneficiaryPhone') || '';
  const vendorName = sp.get('vendorName') ?? '';
  const vendorWalletAddress = sp.get('vendorWalletAddress') ?? '';
  const txHash = sp.get('txHash') || '';
  const quantity = sp.get('quantity') ?? '0';
  const redeemedAt = sp.get('redeemedAt') ?? '';
  const inkindName = sp.get('inkindName') ?? 'N/A';
  const groupName = sp.get('groupName') ?? 'N/A';
  const inkindType = sp.get('inkindType') ?? '';
  const inkindAvailableStock = sp.get('inkindAvailableStock') ?? '0';
  const otpExemptionReason = sp.get('otpExemptionReason') || '';

  const formatOtpReason = (reason: string): string => {
    if (!reason) return 'N/A';
    return reason.split('_').join(' ').toLowerCase();
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <HeaderWithBack
        path={`/projects/aa/${id}/inkind-management/${allocationId}`}
        title={tv('TRANSACTION_LOG_DETAILS')}
        subtitle={tv('DETAIL_VIEW_OF_THE_SELECTED_INKIND')}
        onBack={() => {
          queryClient.invalidateQueries({
            queryKey: [
              'aaProject.groupInkinds.getLogs',
              id as string,
              allocationId as string,
            ],
          });
          const params = new URLSearchParams({
            inkindType,
            inkindAvailableStock,
          });
          router.push(
            `/projects/aa/${id}/inkind-management/${allocationId}?${params}`,
          );
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <DataCard
          title={tv('INKIND_NAME')}
          smallNumber={inkindName}
          className="border-solid rounded-sm"
          iconStyle="bg-white text-secondary-muted"
        />
        <DataCard
          title={tv('GROUP_NAME')}
          smallNumber={groupName}
          className="border-solid rounded-sm"
          iconStyle="bg-white text-secondary-muted"
        />
        <DataCard
          title={tv('TOTAL_REDEEMED')}
          smallNumber={formatNum(quantity)}
          className="border-solid rounded-sm"
          iconStyle="bg-white text-secondary-muted"
        />
      </div>

      <Card className="rounded-sm">
        <CardContent className="p-6">
          <div className="inline-flex items-center gap-3 text-lg font-semibold text-[#2c2f3c] mb-6">
            {tv('TRANSACTION_DETAILS')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-7">
            <InfoItem
              label={tv('BENEFICIARY_WALLET_ADDRESS')}
              value={beneficiaryWalletAddress || undefined}
              copyable
            />
            <InfoItem
              label={tv('BENEFICIARY_PHONE')}
              value={beneficiaryPhone || undefined}
            />
            <InfoItem
              label={tv('TRANSACTION_HASH')}
              value={txHash || undefined}
              copyable
              link={true}
            />
            <InfoItem label={tv('REDEEMED_AT')} value={formatDate(redeemedAt)} />
            <InfoItem label={tv('VENDOR_NAME')} value={vendorName || undefined} />
            <InfoItem
              label={tv('VENDOR_WALLET_ADDRESS')}
              value={vendorWalletAddress || undefined}
              copyable
            />
            {otpExemptionReason && (
              <InfoItem
                label={tv('OTP_EXEMPTION_REASON')}
                value={formatOtpReason(otpExemptionReason)}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
