'use client';

import React from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { UUID } from 'crypto';
import {
  useGetGroupInkindDetail,
  useInkindTransactions,
} from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import {
  DataCard,
  HeaderWithBack,
  TableLoader,
} from 'apps/rahat-ui/src/common';
import { format } from 'date-fns';
import {
  Package,
  Hash,
  Calendar,
  Wallet,
  Tag,
  Layers,
  Users,
  Info,
  Clock,
} from 'lucide-react';

// ─── InfoItem ─────────────────────────────────────────────────────────────────
function InfoItem({
  label,
  value,
  children,
  fullWidth = false,
}: {
  label: string;
  value?: string | number | null;
  children?: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className={`space-y-1 break-words ${fullWidth ? 'col-span-3' : ''}`}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="text-base font-medium">
        {children ?? (
          <span
            className={
              !value && value !== 0 ? 'text-muted-foreground text-sm' : ''
            }
          >
            {value !== undefined && value !== null && value !== ''
              ? String(value)
              : '—'}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Type badge colour ────────────────────────────────────────────────────────
function getTypeBadgeStyle(type: string) {
  const t = (type ?? '').toUpperCase();
  if (t === 'WALK_IN') return 'bg-blue-100 text-blue-600';
  if (t === 'PRE_DEFINED') return 'bg-purple-100 text-purple-600';
  return 'bg-gray-200 text-gray-600';
}

function formatType(type: string) {
  return (type ?? 'N/A')
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  try {
    return format(new Date(dateStr), 'MMM dd, yyyy, hh:mm a');
  } catch {
    return dateStr;
  }
}

// ─── DUMMY transaction data ───────────────────────────────────────────────────
const DUMMY_TXN = {
  uuid: 'rdm-1',
  beneficiaryWalletAddress: '0xABCDef1234567890abcdef1234567890ABCDEF12',
  transactionId: 'txn-001',
  type: 'WALK_IN',
  quantityDisbursed: 1,
  inkindName: 'GAMCHA',
  inkindType: 'PRE_DEFINED',
  groupName: 'AA DEMO 2',
  groupId: 'group-1',
  quantityAllocated: 6,
  quantityRedeemed: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InkindTransactionDetail() {
  const { id, allocationId, txnId } = useParams();
  const projectUUID = id as UUID;
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupIdParam = searchParams.get('groupId') ?? '';
  const inkindIdParam = searchParams.get('inkindId') ?? '';

  // Try to find this specific redemption from the movements list
  const { data: movementsData, isLoading: movementsLoading } =
    useInkindTransactions(projectUUID);
  const { data: allocationData, isLoading: allocationLoading } =
    useGetGroupInkindDetail(projectUUID, allocationId as string);

  const isLoading = movementsLoading || allocationLoading;

  // ── Resolve allocation detail ──────────────────────────────────────────
  const allocation =
    allocationData?.data ?? allocationData?.response?.data ?? allocationData;

  const groupName =
    allocation?.group?.name ?? allocation?.groupName ?? 'Group Allocation';
  const inkindName =
    allocation?.inkind?.name ?? allocation?.inkindName ?? 'N/A';
  const inkindType =
    allocation?.inkind?.type ?? allocation?.inkindType ?? 'N/A';
  const quantityAllocated = allocation?.quantityAllocated ?? 0;
  const quantityRedeemed = allocation?.quantityRedeemed ?? 0;
  const groupId =
    allocation?.groupId ?? allocation?.group?.uuid ?? groupIdParam;
  const inkindId =
    allocation?.inkindId ?? allocation?.inkind?.uuid ?? inkindIdParam;

  // ── Find the specific movement / redemption ────────────────────────────
  const movements: any[] = (() => {
    const raw =
      movementsData?.data ?? movementsData?.response?.data ?? movementsData;
    return Array.isArray(raw) ? raw : [];
  })();

  const movement = movements.find((m: any) => (m.uuid ?? m.id) === txnId);

  // Build a display object — fall back to dummy if not found yet
  const txn = movement
    ? {
        uuid: movement.uuid ?? movement.id ?? txnId,
        beneficiaryWalletAddress:
          movement.beneficiaryWalletAddress ??
          movement.walletAddress ??
          movement.address ??
          '—',
        transactionId:
          movement.transactionId ?? movement.txHash ?? movement.txnId ?? '—',
        type: movement.type ?? movement.redemptionType ?? 'N/A',
        quantityDisbursed: movement.quantityDisbursed ?? movement.quantity ?? 0,
        createdAt: movement.createdAt,
        updatedAt: movement.updatedAt,
        inkindName,
        inkindType,
        groupName,
        groupId,
        inkindId,
        quantityAllocated,
        quantityRedeemed,
      }
    : {
        ...DUMMY_TXN,
        inkindName,
        inkindType,
        groupName,
        groupId,
        inkindId,
        quantityAllocated,
        quantityRedeemed,
        uuid: txnId as string,
      };

  const typeBadgeStyle = getTypeBadgeStyle(txn.type);
  const remaining = Math.max(0, txn.quantityAllocated - txn.quantityRedeemed);

  if (isLoading) return <TableLoader />;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <HeaderWithBack
        path={`/projects/aa/${id}/inkind-management/${allocationId}`}
        title="Transaction Log Details"
        subtitle="Detail view of the selected inkind disbursement transaction"
      />

      {/* Top Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DataCard
          title="Quantity Disbursed"
          number={String(txn.quantityDisbursed)}
          className="h-24 w-full rounded-sm pt-1"
        />
        <DataCard
          title="Inkind Item"
          number={txn.inkindName}
          className="h-24 w-full rounded-sm pt-1"
        />
      </div>

      {/* Main Detail Card */}
      <Card className="rounded-sm">
        <CardContent className="space-y-6 p-4">
          <div className="inline-flex items-center gap-2 text-lg font-semibold text-foreground">
            <Info className="w-5 h-5 text-primary" />
            Transaction Details
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
            {/* Row 1 */}
            <InfoItem
              label="Beneficiary Wallet Address"
              value={txn.beneficiaryWalletAddress}
            />
            <InfoItem label="Transaction ID" value={txn.transactionId} />
            <InfoItem label="Type">
              <Badge className={typeBadgeStyle}>{formatType(txn.type)}</Badge>
            </InfoItem>

            {/* Row 2 */}
            <InfoItem
              label="Quantity Disbursed"
              value={txn.quantityDisbursed}
            />
            <InfoItem label="In-Kind Item" value={txn.inkindName} />
            <InfoItem label="Item Type">
              <Badge className="bg-gray-200 text-gray-600">
                {formatType(txn.inkindType)}
              </Badge>
            </InfoItem>

            {/* Row 3 */}
            <InfoItem label="Timestamp" value={formatDate(txn.createdAt)} />
            <InfoItem label="Created At" value={formatDate(txn.createdAt)} />
            <InfoItem label="Updated At" value={formatDate(txn.updatedAt)} />
          </div>
        </CardContent>
      </Card>

      {/* Group Allocation Detail */}
      <Card className="rounded-sm">
        <CardContent className="space-y-6 p-4">
          <div className="inline-flex items-center gap-2 text-lg font-semibold text-foreground">
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
            <InfoItem label="Remaining" value={remaining} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
