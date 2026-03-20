'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { UUID } from 'crypto';
import {
  useGroupInkindAllocations,
  useGetGroupInkindRedemptions,
  useSingleBeneficiaryGroup,
} from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  DemoTable,
  SearchInput,
  CustomPagination,
  HeaderWithBack,
  DataCard,
} from 'apps/rahat-ui/src/common';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { Eye, Package } from 'lucide-react';
import { format } from 'date-fns';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';

// ─── Types ────────────────────────────────────────────────────────────────────
type RedemptionRow = {
  uuid: string;
  beneficiaryWalletAddress: string;
  transactionId?: string;
  type: string;
  quantityDisbursed: number;
  createdAt?: string;
};

// ─── Status helpers ───────────────────────────────────────────────────────────
function deriveStatus(
  allocated: number,
  redeemed: number,
): 'Not Started' | 'In Progress' | 'Completed' {
  if (redeemed === 0) return 'Not Started';
  if (redeemed >= allocated) return 'Completed';
  return 'In Progress';
}

const STATUS_STYLE: Record<string, string> = {
  'Not Started': 'bg-gray-200 text-gray-600',
  'In Progress': 'bg-yellow-100 text-yellow-600',
  Completed: 'bg-green-100 text-green-500',
};

// ─── DUMMY redemption data ────────────────────────────────────────────────────
const DUMMY_REDEMPTIONS: RedemptionRow[] = [
  {
    uuid: 'rdm-1',
    beneficiaryWalletAddress: '0xABCDef1234567890abcdef1234567890ABCDEF12',
    transactionId: 'txn-001',
    type: 'WALK_IN',
    quantityDisbursed: 1,
    createdAt: new Date().toISOString(),
  },
  {
    uuid: 'rdm-2',
    beneficiaryWalletAddress: '0x9CB0B706fa0e700000000000000000000000dead',
    transactionId: 'txn-002',
    type: 'PRE_DEFINED',
    quantityDisbursed: 2,
    createdAt: new Date().toISOString(),
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InkindAllocationDetail() {
  const { id, allocationId } = useParams();
  const projectUUID = id as UUID;
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Query params as immediate fallbacks ──────────────────────────────────
  const qGroupId = searchParams.get('groupId') ?? '';
  const qInkindId = searchParams.get('inkindId') ?? '';
  const qGroupName = searchParams.get('groupName') ?? 'N/A';
  const qInkindName = searchParams.get('inkindName') ?? 'N/A';
  const qAllocated = Number(searchParams.get('quantityAllocated') ?? 0);
  const qRedeemed = Number(searchParams.get('quantityRedeemed') ?? 0);
  const qBeneficiaryCount = Number(searchParams.get('beneficiaryCount') ?? 0);

  // ── Fetch full allocations list and find the matching record ─────────────
  const { data: allData, isLoading: detailLoading } =
    useGroupInkindAllocations(projectUUID);

  const detail = useMemo(() => {
    const list = allData?.data ?? allData?.response?.data ?? allData;
    if (!Array.isArray(list)) return null;
    return (
      list.find((item: any) => item.uuid === allocationId) ??
      list.find(
        (item: any) =>
          (item.groupId ?? item.group?.uuid) === qGroupId &&
          (item.inkindId ?? item.inkind?.uuid) === qInkindId,
      ) ??
      null
    );
  }, [allData, allocationId, qGroupId, qInkindId]);

  const { data: redemptionsData, isLoading: redemptionsLoading } =
    useGetGroupInkindRedemptions(projectUUID, allocationId as string);

  const groupId = detail?.groupId ?? detail?.group?.uuid ?? qGroupId;
  const inkindId = detail?.inkindId ?? detail?.inkind?.uuid ?? qInkindId;

  // ── Fetch single group to get _count.groupedBeneficiaries ────────────────
  const { data: groupData } = useSingleBeneficiaryGroup(
    projectUUID,
    groupId as UUID,
  );

  const groupName = detail?.group?.name ?? detail?.groupName ?? qGroupName;
  const inkindName = detail?.inkind?.name ?? detail?.inkindName ?? qInkindName;
  const quantityAllocated = detail?.quantityAllocated ?? qAllocated;
  const quantityRedeemed = detail?.quantityRedeemed ?? qRedeemed;
  const beneficiaryCount =
    groupData?._count?.groupedBeneficiaries ??
    groupData?.groupedBeneficiaries?.length ??
    detail?.group?.beneficiaryCount ??
    qBeneficiaryCount;
  const status = deriveStatus(quantityAllocated, quantityRedeemed);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const redemptionRows: RedemptionRow[] = useMemo(() => {
    const raw =
      redemptionsData?.data ??
      redemptionsData?.response?.data ??
      redemptionsData;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((r: any) => ({
        uuid: r.uuid ?? r.id ?? '',
        beneficiaryWalletAddress:
          r.beneficiaryWalletAddress ?? r.walletAddress ?? r.address ?? 'N/A',
        transactionId: r.transactionId ?? r.txHash ?? r.txnId ?? '',
        type: r.type ?? r.redemptionType ?? 'N/A',
        quantityDisbursed: r.quantityDisbursed ?? r.quantity ?? 0,
        createdAt: r.createdAt,
      }));
    }
    return DUMMY_REDEMPTIONS;
  }, [redemptionsData]);

  const columns: ColumnDef<RedemptionRow>[] = [
    {
      accessorKey: 'beneficiaryWalletAddress',
      header: 'Wallet Address',
      cell: ({ row }) => (
        <TruncatedCell
          text={row.original.beneficiaryWalletAddress || 'N/A'}
          maxLength={18}
        />
      ),
    },
    {
      accessorKey: 'transactionId',
      header: 'Transaction ID',
      cell: ({ row }) => (
        <TruncatedCell
          text={row.original.transactionId || 'N/A'}
          maxLength={16}
        />
      ),
    },
    {
      accessorKey: 'quantityDisbursed',
      header: 'Qty Disbursed',
      cell: ({ row }) => (
        <span className="font-semibold text-primary">
          {row.original.quantityDisbursed}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Timestamp',
      cell: ({ row }) => {
        const ts = row.original.createdAt;
        return (
          <span className="text-sm text-muted-foreground">
            {ts ? format(new Date(ts), 'MMM dd, yyyy, hh:mm a') : '—'}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => (
        <TooltipComponent
          Icon={Eye}
          tip="View Transaction Details"
          iconStyle="hover:text-primary cursor-pointer"
          handleOnClick={() =>
            router.push(
              `/projects/aa/${id}/inkind-management/${allocationId}/transactions/${row.original.uuid}?groupId=${groupId}&inkindId=${inkindId}`,
            )
          }
        />
      ),
    },
  ];

  const table = useReactTable({
    data: redemptionRows,
    columns,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { columnVisibility, columnFilters, pagination },
  });

  const dataCards = [
    {
      name: 'Inkind Name',
      amount: inkindName,
    },
    {
      name: 'No of Beneficiaries',
      amount: beneficiaryCount,
    },
    {
      name: 'Total Redeemed',
      amount: quantityRedeemed,
    },
  ];

  return (
    <div className="p-4">
      {/* Header */}
      <HeaderWithBack
        path={`/projects/aa/${id}/inkind-management?tab=inkindAllocation`}
        title={groupName}
        subtitle="Disbursement information for this group allocation"
        status={status}
        badgeClassName={STATUS_STYLE[status]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {dataCards.map((card) => (
          <DataCard
            key={card.name}
            title={card.name}
            number={String(card.amount)}
            className="border-solid rounded-md"
            iconStyle="bg-white text-secondary-muted"
          />
        ))}
      </div>

      {/* Disbursement Table */}
      <Card className="rounded-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Package className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm">{groupName}</h2>
            <span className="text-muted-foreground text-xs">
              — Disbursement Records
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            List of all beneficiaries who received this in-kind item
          </p>

          <SearchInput
            className="w-full mb-2"
            name="beneficiaryWalletAddress"
            value={
              (table
                .getColumn('beneficiaryWalletAddress')
                ?.getFilterValue() as string) ?? ''
            }
            onSearch={(event) =>
              table
                .getColumn('beneficiaryWalletAddress')
                ?.setFilterValue(event.target.value)
            }
          />

          <DemoTable
            table={table}
            tableHeight="h-[calc(100vh-520px)]"
            loading={redemptionsLoading || detailLoading}
          />

          <CustomPagination
            currentPage={pagination.pageIndex + 1}
            handleNextPage={() => table.nextPage()}
            handlePrevPage={() => table.previousPage()}
            handlePageSizeChange={(size) => table.setPageSize(size as number)}
            meta={{
              total: redemptionRows.length,
              currentPage: pagination.pageIndex + 1,
              lastPage: table.getPageCount() || 1,
              perPage: pagination.pageSize,
              next: null,
              prev: null,
            }}
            perPage={pagination.pageSize}
          />
        </CardContent>
      </Card>
    </div>
  );
}
