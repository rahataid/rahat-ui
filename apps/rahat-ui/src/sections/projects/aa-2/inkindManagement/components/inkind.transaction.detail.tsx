'use client';

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { UUID } from 'crypto';
import {
  useGetGroupInkindDetail,
  useInkindTransactions,
} from '@rahat-ui/query';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import {
  DataCard,
  HeaderWithBack,
  TableLoader,
} from 'apps/rahat-ui/src/common';
import { Info, Users } from 'lucide-react';
import { formatDate } from '../inkind.helpers';
import InfoItem from './inkind.info.item';

export default function InkindTransactionDetail() {
  const { id, allocationId, txnId } = useParams();
  const projectUUID = id as UUID;
  const sp = useSearchParams();
  const groupIdParam = sp.get('groupId') ?? '';
  const inkindIdParam = sp.get('inkindId') ?? '';

  const { data: movementsData, isLoading: movementsLoading } =
    useInkindTransactions(projectUUID);
  const { data: allocationData, isLoading: allocationLoading } =
    useGetGroupInkindDetail(projectUUID, allocationId as string);

  const allocation = allocationData?.data;
  const groupName = allocation?.group?.name ?? allocation?.groupName ?? 'N/A';
  const inkindName =
    allocation?.inkind?.name ?? allocation?.inkindName ?? 'N/A';
  const quantityAllocated = allocation?.quantityAllocated ?? 0;
  const quantityRedeemed = allocation?.quantityRedeemed ?? 0;
  const groupId =
    allocation?.groupId ?? allocation?.group?.uuid ?? groupIdParam;
  const inkindId =
    allocation?.inkindId ?? allocation?.inkind?.uuid ?? inkindIdParam;

  const movements: any[] = (() => {
    const raw =
      movementsData?.data ?? movementsData?.response?.data ?? movementsData;
    return Array.isArray(raw) ? raw : [];
  })();

  const movement = movements.find((m: any) => (m.uuid ?? m.id) === txnId);

  const txn = movement
    ? {
        uuid: movement.uuid ?? txnId,
        beneficiaryWalletAddress:
          movement.beneficiaryWalletAddress ??
          movement.walletAddress ??
          movement.address ??
          '—',
        transactionId:
          movement.transactionId ?? movement.txHash ?? movement.txnId ?? '—',
        quantityDisbursed: movement.quantityDisbursed ?? movement.quantity ?? 0,
        createdAt: movement.createdAt,
        inkindName,
        groupName,
        groupId,
        inkindId,
        quantityAllocated,
        quantityRedeemed,
      }
    : {
        uuid: txnId as string,
        beneficiaryWalletAddress: '—',
        transactionId: '—',
        quantityDisbursed: 0,
        createdAt: undefined,
        inkindName,
        groupName,
        groupId,
        inkindId,
        quantityAllocated,
        quantityRedeemed,
      };

  if (movementsLoading || allocationLoading) return <TableLoader />;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <HeaderWithBack
        path={`/projects/aa/${id}/inkind-management/${allocationId}`}
        title="Transaction Log Details"
        subtitle="Detail view of the selected inkind disbursement transaction"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DataCard
          title="Quantity Disbursed"
          number={String(txn.quantityDisbursed)}
          className="h-24 w-full rounded-sm pt-1"
        />
        <DataCard
          title="Inkind Name"
          number={txn.inkindName}
          className="h-24 w-full rounded-sm pt-1"
        />
      </div>

      <Card className="rounded-sm">
        <CardContent className="space-y-6 p-4">
          <div className="inline-flex items-center gap-2 text-lg font-semibold">
            <Info className="w-5 h-5 text-primary" />
            Transaction Details
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
            <InfoItem
              label="Beneficiary Wallet Address"
              value={txn.beneficiaryWalletAddress}
            />
            <InfoItem label="Transaction ID" value={txn.transactionId} />
            <InfoItem
              label="Quantity Disbursed"
              value={txn.quantityDisbursed}
            />
            <InfoItem label="Inkind Name" value={txn.inkindName} />
            <InfoItem label="Timestamp" value={formatDate(txn.createdAt)} />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-sm">
        <CardContent className="space-y-6 p-4">
          <div className="inline-flex items-center gap-2 text-lg font-semibold">
            <Users className="w-5 h-5 text-primary" />
            Group Allocation Details
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
            <InfoItem label="Group Name" value={txn.groupName} />
            <InfoItem label="Group ID" value={txn.groupId} />
            <InfoItem label="Inkind ID" value={txn.inkindId} />
            <InfoItem label="Inkind Assigned" value={txn.inkindName} />
            <InfoItem
              label="Quantity Allocated"
              value={txn.quantityAllocated}
            />
            <InfoItem label="Quantity Redeemed" value={txn.quantityRedeemed} />
            <InfoItem
              label="Remaining"
              value={Math.max(0, txn.quantityAllocated - txn.quantityRedeemed)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
