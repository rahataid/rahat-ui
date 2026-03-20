'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import {
  useGroupInkindAllocations,
  useBeneficiaryGroups,
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
  Heading,
  SearchInput,
  CustomPagination,
} from 'apps/rahat-ui/src/common';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Eye } from 'lucide-react';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';

type AllocationRow = {
  uuid: string;
  groupId: string;
  groupName: string;
  inkindId: string;
  inkindName: string;
  inkindType: string;
  quantityAllocated: number;
  quantityRedeemed: number;
  beneficiaryCount: number;
  createdAt?: string;
  updatedAt?: string;
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

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function InkindAllocationList() {
  const { id } = useParams();
  const projectUUID = id as UUID;
  const router = useRouter();

  const { data, isLoading } = useGroupInkindAllocations(projectUUID);
  const { data: groupsList } = useBeneficiaryGroups(projectUUID, {
    page: 1,
    perPage: 1000,
  });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const rows = useMemo<AllocationRow[]>(() => {
    const d = data?.data ?? data?.response?.data ?? data;
    if (!Array.isArray(d) || d.length === 0) return [];

    return d
      .map((item: any) => {
        const groupId = item.groupId ?? item.group?.uuid ?? '';
        const matchedGroup = Array.isArray(groupsList)
          ? groupsList.find((g: any) => g.uuid === groupId)
          : null;

        return {
          uuid: item.uuid,
          groupId,
          groupName: item.group?.name ?? item.groupName ?? 'N/A',
          inkindId: item.inkindId ?? item.inkind?.uuid ?? '',
          inkindName: item.inkind?.name ?? item.inkindName ?? 'N/A',
          inkindType: item.inkind?.type ?? item.inkindType ?? 'N/A',
          quantityAllocated: item.quantityAllocated ?? 0,
          quantityRedeemed: item.quantityRedeemed ?? 0,
          beneficiaryCount:
            matchedGroup?._count?.groupedBeneficiaries ??
            item.group?._count?.groupedBeneficiaries ??
            0,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt ?? b.createdAt ?? 0).getTime() -
          new Date(a.updatedAt ?? a.createdAt ?? 0).getTime(),
      );
  }, [data, groupsList]);

  const columns: ColumnDef<AllocationRow>[] = [
    {
      accessorKey: 'inkindName',
      header: 'In-Kind Name',
      cell: ({ row }) => (
        <TruncatedCell text={row.original.inkindName} maxLength={20} />
      ),
    },
    {
      accessorKey: 'groupName',
      header: 'Assigned Group',
      cell: ({ row }) => (
        <TruncatedCell text={row.original.groupName} maxLength={20} />
      ),
    },
    {
      accessorKey: 'inkindType',
      header: 'Inkind Type',
      cell: ({ row }) => (
        <Badge className="bg-gray-200 text-gray-600">
          {formatLabel(row.original.inkindType)}
        </Badge>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = deriveStatus(
          row.original.quantityAllocated,
          row.original.quantityRedeemed,
        );
        return <Badge className={STATUS_STYLE[status]}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'quantityRedeemed',
      header: 'Total Redeemed',
      cell: ({ row }) => (
        <span className="font-semibold text-primary">
          {row.original.quantityRedeemed}{' '}
          <span className="text-xs font-normal text-muted-foreground">
            / {row.original.beneficiaryCount}
          </span>
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const r = row.original;
        const params = new URLSearchParams({
          groupId: r.groupId,
          inkindId: r.inkindId,
          groupName: r.groupName,
          inkindName: r.inkindName,
          quantityAllocated: String(r.quantityAllocated),
          quantityRedeemed: String(r.quantityRedeemed),
          beneficiaryCount: String(r.beneficiaryCount),
        });
        return (
          <TooltipComponent
            Icon={Eye}
            tip="View Details"
            iconStyle="hover:text-primary cursor-pointer"
            handleOnClick={() =>
              router.push(
                `/projects/aa/${id}/inkind-management/${r.uuid}?${params}`,
              )
            }
          />
        );
      },
    },
  ];

  const table = useReactTable({
    data: rows,
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
    <div>
      <Heading
        title="Allocation List"
        titleStyle="text-lg"
        description="In-kind items assigned to beneficiary groups"
      />
      <SearchInput
        className="w-full mb-2"
        name="inkindName"
        value={
          (table.getColumn('inkindName')?.getFilterValue() as string) ?? ''
        }
        onSearch={(e) =>
          table.getColumn('inkindName')?.setFilterValue(e.target.value)
        }
      />
      <DemoTable
        table={table}
        tableHeight="h-[calc(100vh-420px)]"
        loading={isLoading}
      />
      <CustomPagination
        currentPage={pagination.pageIndex + 1}
        handleNextPage={() => table.nextPage()}
        handlePrevPage={() => table.previousPage()}
        handlePageSizeChange={(size) => table.setPageSize(size as number)}
        meta={{
          total: rows.length,
          currentPage: pagination.pageIndex + 1,
          lastPage: table.getPageCount() || 1,
          perPage: pagination.pageSize,
          next: null,
          prev: null,
        }}
        perPage={pagination.pageSize}
      />
    </div>
  );
}
