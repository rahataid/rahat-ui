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

type RedemptionRow = {
  uuid: string;
  beneficiaryWalletAddress: string;
  transactionId: string;
  quantityDisbursed: number;
  createdAt?: string;
};

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

function formatRedemptions(raw: any[]): RedemptionRow[] {
  return raw.map((r) => ({
    uuid: r.uuid ?? r.id ?? '',
    beneficiaryWalletAddress:
      r.beneficiaryWalletAddress ?? r.walletAddress ?? r.address ?? 'N/A',
    transactionId: r.transactionId ?? r.txHash ?? r.txnId ?? '',
    quantityDisbursed: r.quantityDisbursed ?? r.quantity ?? 0,
    createdAt: r.createdAt,
  }));
}

export default function InkindAllocationDetail() {
  const { id, allocationId } = useParams();
  const projectUUID = id as UUID;
  const router = useRouter();
  const sp = useSearchParams();

  const qGroupId = sp.get('groupId') ?? '';
  const qInkindId = sp.get('inkindId') ?? '';
  const qGroupName = sp.get('groupName') ?? 'N/A';
  const qInkindName = sp.get('inkindName') ?? 'N/A';
  const qAllocated = Number(sp.get('quantityAllocated') ?? 0);
  const qRedeemed = Number(sp.get('quantityRedeemed') ?? 0);
  const qBeneficiaryCount = Number(sp.get('beneficiaryCount') ?? 0);

  const { data: allData, isLoading: detailLoading } =
    useGroupInkindAllocations(projectUUID);
  const { data: redemptionsData, isLoading: redemptionsLoading } =
    useGetGroupInkindRedemptions(projectUUID, allocationId as string);

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

  const groupId = detail?.groupId ?? detail?.group?.uuid ?? qGroupId;
  const inkindId = detail?.inkindId ?? detail?.inkind?.uuid ?? qInkindId;
  const groupName = detail?.group?.name ?? detail?.groupName ?? qGroupName;
  const inkindName = detail?.inkind?.name ?? detail?.inkindName ?? qInkindName;
  const quantityAllocated = detail?.quantityAllocated ?? qAllocated;
  const quantityRedeemed = detail?.quantityRedeemed ?? qRedeemed;
  const status = deriveStatus(quantityAllocated, quantityRedeemed);

  const { data: groupData } = useSingleBeneficiaryGroup(
    projectUUID,
    groupId as UUID,
  );
  const beneficiaryCount =
    groupData?._count?.groupedBeneficiaries ??
    groupData?.groupedBeneficiaries?.length ??
    qBeneficiaryCount;

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const redemptionRows = useMemo<RedemptionRow[]>(() => {
    const raw =
      redemptionsData?.data ??
      redemptionsData?.response?.data ??
      redemptionsData;
    return Array.isArray(raw) && raw.length > 0 ? formatRedemptions(raw) : [];
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
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.createdAt
            ? format(new Date(row.original.createdAt), 'MMM dd, yyyy, hh:mm a')
            : '—'}
        </span>
      ),
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

  return (
    <div className="p-4">
      <HeaderWithBack
        path={`/projects/aa/${id}/inkind-management?tab=inkindAllocation`}
        title={groupName}
        subtitle="Disbursement information for this group allocation"
        status={status}
        badgeClassName={STATUS_STYLE[status]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {[
          { name: 'Inkind Name', amount: inkindName },
          { name: 'No of Beneficiaries', amount: beneficiaryCount },
          { name: 'Total Redeemed', amount: quantityRedeemed },
        ].map((card) => (
          <DataCard
            key={card.name}
            title={card.name}
            number={String(card.amount)}
            className="border-solid rounded-md"
            iconStyle="bg-white text-secondary-muted"
          />
        ))}
      </div>

      <Card className="rounded-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Package className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm">{groupName}</h2>
            <span className="text-muted-foreground text-xs">
              — Disbursement Records
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            List of all beneficiaries who received this inkind
          </p>
          <SearchInput
            className="w-full mb-2"
            name="beneficiaryWalletAddress"
            value={
              (table
                .getColumn('beneficiaryWalletAddress')
                ?.getFilterValue() as string) ?? ''
            }
            onSearch={(e) =>
              table
                .getColumn('beneficiaryWalletAddress')
                ?.setFilterValue(e.target.value)
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
