'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { useGroupInkindAllocations, useBeneficiaryGroups } from '@rahat-ui/query';
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

// ─── Types ────────────────────────────────────────────────────────────────────
type AllocationRow = {
  uuid: string;
  groupId: string;
  groupName: string;
  inkindId: string;
  inkindName: string;
  inkindType?: string;
  quantityAllocated: number;
  quantityRedeemed: number;
  beneficiaryCount: number;
  createdAt?: string;
  updatedAt?: string;
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

// ─── DUMMY DATA ───────────────────────────────────────────────────────────────
const DUMMY_ROWS: AllocationRow[] = [
  {
    uuid: 'alloc-1',
    groupId: 'group-1',
    groupName: 'AA DEMO 2',
    inkindId: 'ink-1',
    inkindName: 'GAMCHA',
    inkindType: 'PRE_DEFINED',
    quantityAllocated: 6,
    quantityRedeemed: 0,
    beneficiaryCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    uuid: 'alloc-2',
    groupId: 'group-2',
    groupName: 'Flood Relief Group',
    inkindId: 'ink-3',
    inkindName: 'Blanket',
    inkindType: 'WALK_IN',
    quantityAllocated: 10,
    quantityRedeemed: 5,
    beneficiaryCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    uuid: 'alloc-3',
    groupId: 'group-3',
    groupName: 'Shelter Support Group',
    inkindId: 'ink-4',
    inkindName: 'Tarpaulin Sheet',
    inkindType: 'PRE_DEFINED',
    quantityAllocated: 20,
    quantityRedeemed: 20,
    beneficiaryCount: 0,
    createdAt: new Date().toISOString(),
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
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

  const rows: AllocationRow[] = useMemo(() => {
    const d = data?.data ?? data?.response?.data ?? data;
    if (Array.isArray(d) && d.length > 0) {
      return d
        .map((item: any) => {
          const gId = item.groupId ?? item.group?.uuid ?? '';
          const matchedGroup = Array.isArray(groupsList)
            ? groupsList.find((g: any) => g.uuid === gId)
            : null;
          const beneficiaryCount =
            matchedGroup?._count?.groupedBeneficiaries ??
            item.group?._count?.groupedBeneficiaries ??
            0;
          return {
            uuid: item.uuid,
            groupId: gId,
            groupName: item.group?.name ?? item.groupName ?? 'N/A',
            inkindId: item.inkindId ?? item.inkind?.uuid ?? '',
            inkindName: item.inkind?.name ?? item.inkindName ?? 'N/A',
            inkindType: item.inkind?.type ?? item.inkindType ?? 'N/A',
            quantityAllocated: item.quantityAllocated ?? 0,
            quantityRedeemed: item.quantityRedeemed ?? 0,
            beneficiaryCount,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          };
        })
        .sort((a: AllocationRow, b: AllocationRow) => {
          const aTime = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
          const bTime = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
          return bTime - aTime;
        });
    }
    return DUMMY_ROWS;
  }, [data, groupsList]);

  const columns: ColumnDef<AllocationRow>[] = [
    {
      accessorKey: 'inkindName',
      header: 'In-Kind Name',
      cell: ({ row }) => (
        <TruncatedCell text={row.original.inkindName || 'N/A'} maxLength={20} />
      ),
    },
    {
      accessorKey: 'groupName',
      header: 'Assigned Group',
      cell: ({ row }) => (
        <TruncatedCell text={row.original.groupName || 'N/A'} maxLength={20} />
      ),
    },
    {
      accessorKey: 'inkindType',
      header: 'Inkind Type',
      cell: ({ row }) => {
        const t = row.original.inkindType || 'N/A';
        const label = t
          .toLowerCase()
          .split('_')
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        return <Badge className="bg-gray-200 text-gray-600">{label}</Badge>;
      },
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const { quantityAllocated, quantityRedeemed } = row.original;
        const status = deriveStatus(quantityAllocated, quantityRedeemed);
        return <Badge className={STATUS_STYLE[status]}>{status}</Badge>;
      },
    },
    {
      accessorKey: 'quantityRedeemed',
      header: 'Total Redeemed',
      cell: ({ row }) => {
        const redeemed = row.getValue('quantityRedeemed') as number;
        const totalBenef = row.original.beneficiaryCount;
        return (
          <span className="font-semibold text-primary">
            {redeemed}{' '}
            <span className="text-xs font-normal text-muted-foreground">
              / {totalBenef}
            </span>
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
          tip="View Details"
          iconStyle="hover:text-primary cursor-pointer"
          handleOnClick={() => {
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
            router.push(
              `/projects/aa/${id}/inkind-management/${
                r.uuid
              }?${params.toString()}`,
            );
          }}
        />
      ),
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
        onSearch={(event) =>
          table.getColumn('inkindName')?.setFilterValue(event.target.value)
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
