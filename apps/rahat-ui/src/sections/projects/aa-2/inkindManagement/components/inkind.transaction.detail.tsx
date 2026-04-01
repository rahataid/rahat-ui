'use client';

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useGetGroupInkindDetail } from '@rahat-ui/query';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import {
  DataCard,
  HeaderWithBack,
  TableLoader,
} from 'apps/rahat-ui/src/common';
import { Package } from 'lucide-react';
import { formatDate } from '../inkind.helpers';
import InfoItem from 'apps/rahat-ui/src/sections/projects/aa-2/payout/benefTransactionDetails/infoItem';

export default function InkindTransactionDetail() {
  const { id, allocationId } = useParams();
  const projectUUID = id as UUID;
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

  const { data: allocationData, isLoading: allocationLoading } =
    useGetGroupInkindDetail(projectUUID, allocationId as string);

  const allocation = allocationData?.data;
  const quantityAllocated = allocation?.quantityAllocated ?? 0;
  const quantityRedeemed = allocation?.quantityRedeemed ?? 0;

  if (allocationLoading) return <TableLoader />;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <HeaderWithBack
        path={`/projects/aa/${id}/inkind-management/${allocationId}`}
        title="Transaction Log Details"
        subtitle="Detail view of the selected inkind disbursement transaction"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <DataCard
          title="Quantity Redeemed"
          Icon={Package}
          smallNumber={quantity}
          className="h-24 w-full rounded-sm pt-1"
        />
        <DataCard
          title="Inkind Name"
          Icon={Package}
          smallNumber={inkindName}
          className="h-24 w-full rounded-sm pt-1"
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
            />
            <InfoItem label="Redeemed At" value={formatDate(redeemedAt)} />
            <InfoItem label="Quantity Redeemed" value={quantity} />
            <InfoItem label="Vendor Name" value={vendorName || undefined} />
            <InfoItem
              label="Vendor Wallet Address"
              value={vendorWalletAddress || undefined}
              copyable
            />
            <InfoItem label="Group Name" value={groupName} />
            <InfoItem label="Inkind Assigned" value={inkindName} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
