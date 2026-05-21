'use client';

import React, { useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useGroupInkindAllocations, usePagination } from '@rahat-ui/query';
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  VisibilityState,
} from '@tanstack/react-table';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import {
  DemoTable,
  Heading,
  SearchInput,
  CustomPagination,
} from 'apps/rahat-ui/src/common';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Eye, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  INKIND_TYPES,
  INKIND_TYPE_LABELS,
  InkindType,
} from '../schemas/inkind.validation';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';

type ModeTab = 'ONLINE' | 'OFFLINE';

type AllocationRow = {
  uuid: string;
  groupId: string;
  groupName: string;
  inkindId: string;
  inkindName: string;
  inkindType: string;
  inkindAvailableStock: number;
  quantityAllocated: number;
  quantityRedeemed: number;
  beneficiaryCount: number;
  mode: string | null;
  vendor?: string | null;
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

export function formatLabel(value: string) {
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
  const searchParams = useSearchParams();

  const { pagination, setPagination, setNextPage, setPrevPage, setPerPage } =
    usePagination();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [modeTab, setModeTab] = useState<ModeTab>(
    () =>
      ((searchParams.get('mode') ?? '').toUpperCase() as ModeTab) || 'ONLINE',
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useGroupInkindAllocations(projectUUID, {
    inkindType: typeFilter,
    mode: modeTab,
    search: debouncedSearch || undefined,
    page: pagination.page,
    perPage: pagination.perPage,
  });

  const meta: any = data?.response?.meta ?? null;

  const rows = useMemo<AllocationRow[]>(() => {
    const d = data?.data ?? data?.response?.data ?? data;
    if (!Array.isArray(d) || d.length === 0) return [];

    return d
      .map((item: any) => {
        const groupId = item.groupId ?? item.group?.uuid ?? '';

        return {
          uuid: item.uuid,
          groupId,
          groupName: item.group?.name ?? item.groupName ?? 'N/A',
          inkindId: item.inkindId ?? item.inkind?.uuid ?? '',
          inkindName: item.inkind?.name ?? item.inkindName ?? 'N/A',
          inkindType: item.inkind?.type ?? item.inkindType ?? 'N/A',
          inkindAvailableStock: item.inkind?.availableStock ?? 0,
          quantityAllocated: item.quantityAllocated ?? 0,
          quantityRedeemed: item.quantityRedeemed ?? 0,
          beneficiaryCount: item.group?._count?.beneficiaries ?? 0,
          mode: item.mode ?? null,
          vendor: item.vendor ?? null,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt ?? b.createdAt ?? 0).getTime() -
          new Date(a.updatedAt ?? a.createdAt ?? 0).getTime(),
      );
  }, [data]);

  const columns: ColumnDef<AllocationRow>[] = useMemo(
    () => [
      {
        accessorKey: 'inkindName',
        header: 'Inkind Name',
        cell: ({ row }) => (
          <TruncatedCell text={row.original.inkindName} maxLength={20} />
        ),
      },
      {
        accessorKey: 'groupName',
        header: 'Beneficiary Group',
        cell: ({ row }) => (
          <TruncatedCell text={row.original.groupName} maxLength={20} />
        ),
      },
      ...(modeTab === 'OFFLINE'
        ? [
            {
              accessorKey: 'vendor',
              header: 'Vendor',
              cell: ({ row }: { row: { original: AllocationRow } }) => (
                <span>{row.original.vendor ?? 'N/A'}</span>
              ),
            } as ColumnDef<AllocationRow>,
          ]
        : []),
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
          const isWalkIn = row.original.inkindType === 'WALK_IN';
          const status = isWalkIn
            ? deriveStatus(
                row.original.inkindAvailableStock +
                  row.original.quantityRedeemed,
                row.original.quantityRedeemed,
              )
            : deriveStatus(
                row.original.quantityAllocated,
                row.original.quantityRedeemed,
              );
          return <Badge className={STATUS_STYLE[status]}>{status}</Badge>;
        },
      },
      {
        accessorKey: 'quantityRedeemed',
        header: 'Total Redeemed',
        cell: ({ row }) => {
          const isWalkIn = row.original.inkindType === 'WALK_IN';
          return (
            <span className="font-semibold">
              {row.original.quantityRedeemed}{' '}
              <span className="text-xs font-normal">
                /{' '}
                {isWalkIn
                  ? row.original.inkindAvailableStock +
                    row.original.quantityRedeemed
                  : row.original.beneficiaryCount}
              </span>
            </span>
          );
        },
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
            inkindType: r.inkindType,
            inkindAvailableStock: String(r.inkindAvailableStock),
            quantityAllocated: String(r.quantityAllocated),
            quantityRedeemed: String(r.quantityRedeemed),
            beneficiaryCount: String(r.beneficiaryCount),
            from: modeTab.toLowerCase(),
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
    ],
    [modeTab],
  );

  const table = useReactTable({
    data: rows,
    columns,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualFiltering: true,
    state: { columnVisibility },
  });

  return (
    <div>
      <Heading
        title="Allocation List"
        titleStyle="font-medium text-lg"
        description="Inkind items assigned to beneficiary groups"
      />
      <div className="flex border-b mb-4">
        {(['ONLINE', 'OFFLINE'] as ModeTab[]).map((tab) => {
          const label = tab === 'ONLINE' ? 'Online' : 'Offline';
          const isActive = modeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                setModeTab(tab);
                setPagination({ ...pagination, page: 1 });
              }}
              className={`py-2 px-4 text-sm font-medium flex items-center gap-2 ${
                isActive
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {label}
              {isActive && (
                <Badge className="h-5 min-w-[20px] justify-center text-white px-2 py-0 bg-[#297AD6]">
                  {meta?.total ?? rows.length}
                </Badge>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2 mb-2">
        <SearchInput
          className="flex-1"
          name="Inkind Name"
          value={search}
          onSearch={(e) => {
            setSearch(e.target.value);
            setPagination({ ...pagination, page: 1 });
          }}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1 shrink-0">
              {typeFilter
                ? INKIND_TYPE_LABELS[typeFilter as InkindType]
                : 'All Types'}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => {
                setTypeFilter(undefined);
                setPagination({ ...pagination, page: 1 });
              }}
            >
              All Types
            </DropdownMenuItem>
            {INKIND_TYPES.map((t) => (
              <DropdownMenuItem
                key={t}
                onSelect={() => {
                  setTypeFilter(t);
                  setPagination({ ...pagination, page: 1 });
                }}
              >
                {INKIND_TYPE_LABELS[t]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DemoTable table={table} loading={isLoading} />
      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        setPagination={setPagination}
        meta={meta || { total: 0, currentPage: 0 }}
        perPage={pagination.perPage}
        total={meta?.total}
      />
    </div>
  );
}
