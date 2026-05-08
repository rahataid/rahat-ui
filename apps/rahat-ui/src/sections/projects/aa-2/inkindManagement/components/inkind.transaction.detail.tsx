'use client';

import React from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { DataCard, HeaderWithBack } from 'apps/rahat-ui/src/common';
import { formatDate } from '../inkind.helpers';
import InfoItem from 'apps/rahat-ui/src/sections/projects/aa-2/payout/benefTransactionDetails/infoItem';

export default function InkindTransactionDetail() {
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

  return (
    <div className="p-4 md:p-6 space-y-6">
      <HeaderWithBack
        path={`/projects/aa/${id}/inkind-management/${allocationId}`}
        title="Transaction Log Details"
        subtitle="Detail view of the selected inkind disbursement transaction"
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
          title="Inkind Name"
          smallNumber={inkindName}
          className="border-solid rounded-sm"
          iconStyle="bg-white text-secondary-muted"
        />
        <DataCard
          title="Group Name"
          smallNumber={groupName}
          className="border-solid rounded-sm"
          iconStyle="bg-white text-secondary-muted"
        />
        <DataCard
          title="Quantity Redeemed"
          smallNumber={quantity}
          className="border-solid rounded-sm"
          iconStyle="bg-white text-secondary-muted"
        />
      </div>

      <Card className="rounded-sm">
        <CardContent className="p-6">
          <div className="inline-flex items-center gap-3 text-lg font-semibold text-[#2c2f3c] mb-6">
            Transaction Details
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-7">
            <InfoItem
              label="Beneficiary Wallet Address"
              value={beneficiaryWalletAddress || undefined}
              copyable
            />
            <InfoItem
              label="Beneficiary Phone"
              value={beneficiaryPhone || undefined}
            />
            <InfoItem
              label="Transaction Hash"
              value={txHash || undefined}
              copyable
              link={true}
            />
            <InfoItem label="Redeemed At" value={formatDate(redeemedAt)} />
            <InfoItem label="Vendor Name" value={vendorName || undefined} />
            <InfoItem
              label="Vendor Wallet Address"
              value={vendorWalletAddress || undefined}
              copyable
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
