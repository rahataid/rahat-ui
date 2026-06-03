'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { ChevronDown, Eye, Plus } from 'lucide-react';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { DemoTable, SearchInput, CustomPagination, Heading } from 'apps/rahat-ui/src/common';
import { usePagination, useGctRecords } from '@rahat-ui/query';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import { TruncatedCell } from '../../stakeholders/component/TruncatedCell';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUSES = ['NOT_STARTED', 'PENDING', 'STARTED', 'COMPLETED'] as const;
type GctRecordStatus = (typeof STATUSES)[number];

const STATUS_STYLE: Record<string, string> = {
  NOT_STARTED: 'bg-gray-100 text-gray-600',
  PENDING: 'bg-yellow-100 text-yellow-700',
  STARTED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
};

// ─── Types ────────────────────────────────────────────────────────────────────

type GctRecord = {
  uuid: string;
  title?: string;
  amount: number;
  status: string;
  groupCashTransfer?: { uuid: string; name: string };
  createdBy?: string;
};

// ─── Action button ────────────────────────────────────────────────────────────

function ActionBtn({
  label,
  icon,
  hoverClass,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  hoverClass: string;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={`p-1.5 rounded transition-colors ${hoverClass}`}
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GctManagementList() {
  const { id } = useParams();
  const projectUUID = id as UUID;
  const router = useRouter();

  // Pagination
  const { pagination, setNextPage, setPrevPage, setPerPage, setPagination } =
    usePagination();

  // Filter state
  const [titleSearch, setTitleSearch] = useState('');
  const [groupSearch, setGroupSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<GctRecordStatus | undefined>(undefined);

  const debouncedFilters = useDebounce({ title: titleSearch, group: groupSearch }, 500);

  // Reset page on filter change
  useEffect(() => {
    setPagination((prev: typeof pagination) => ({ ...prev, page: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters.title, debouncedFilters.group, statusFilter]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { data, isLoading } = useGctRecords(projectUUID, {
    page: pagination.page,
    perPage: pagination.perPage,
    sort: 'createdAt',
    order: 'desc',
  });

  const rows = useMemo<GctRecord[]>(() => data?.data ?? [], [data]);
  const meta = data?.meta ?? data?.response?.meta;

  // Client-side filter (server DTO only has groupCashTransferId + sort/page)
  const filtered = useMemo(() => {
    let result = rows;
    if (debouncedFilters.title) {
      const lower = debouncedFilters.title.toLowerCase();
      result = result.filter((r) => r.title?.toLowerCase().includes(lower));
    }
    if (debouncedFilters.group) {
      const lower = debouncedFilters.group.toLowerCase();
      result = result.filter((r) =>
        r.groupCashTransfer?.name?.toLowerCase().includes(lower),
      );
    }
    if (statusFilter) {
      result = result.filter((r) => r.status === statusFilter);
    }
    return result;
  }, [rows, debouncedFilters, statusFilter]);

  const columns: ColumnDef<GctRecord>[] = useMemo(
    () => [
      {
        id: 'title',
        header: 'GCT Fund Title',
        cell: ({ row }) => (
          <TruncatedCell text={row.original.title || '—'} maxLength={20} />
        ),
      },
      {
        id: 'groupName',
        header: 'GCT Group Name',
        cell: ({ row }) => (
          <TruncatedCell
            text={row.original.groupCashTransfer?.name || '—'}
            maxLength={20}
          />
        ),
      },
      {
        id: 'amount',
        header: 'Amount',
        cell: ({ row }) => (
          <span className="font-semibold">
            {row.original.amount?.toLocaleString() ?? '—'}
          </span>
        ),
      },
      {
        id: 'createdBy',
        header: 'Created By',
        cell: ({ row }) => (
          <TruncatedCell text={row.original.createdBy || '—'} maxLength={18} />
        ),
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <Badge
              className={`text-xs ${STATUS_STYLE[status] ?? 'bg-gray-100 text-gray-600'}`}
            >
              {status?.replace(/_/g, ' ') ?? '—'}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => {
          const item = row.original;
          return (
            <TooltipProvider>
              <div className="flex items-center gap-1">
                <ActionBtn
                  label="View"
                  icon={<Eye size={16} strokeWidth={1.8} />}
                  hoverClass="hover:bg-gray-100 text-gray-600"
                  onClick={() =>
                    router.push(
                      `/projects/aa/${id}/group-cash-transfer/records/${item.uuid}`,
                    )
                  }
                />
              </div>
            </TooltipProvider>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id],
  );

  const table = useReactTable({
    data: filtered,
    columns,
    manualPagination: true,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { columnVisibility, columnFilters },
  });

  return (
    <div>
      <div className="flex justify-between items-center">
        <Heading
          title="Group Cash Transfer Management"
          titleStyle="font-medium text-lg"
          description="List of all the Group Cash Transfer Records"
        />
        <RoleAuth roles={[AARoles.ADMIN, AARoles.Municipality]} hasContent={false}>
          <Button
            size="sm"
            className="rounded-sm gap-1.5"
            onClick={() =>
              router.push(`/projects/aa/${id}/group-cash-transfer/assign-cash`)
            }
          >
            <Plus size={14} />
            Assign Cash
          </Button>
        </RoleAuth>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <SearchInput
          className="flex-1 min-w-[160px]"
          name="title"
          value={titleSearch}
          onSearch={(e) => setTitleSearch(e.target.value)}
        />
        <SearchInput
          className="flex-1 min-w-[160px]"
          name="group name"
          value={groupSearch}
          onSearch={(e) => setGroupSearch(e.target.value)}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1 shrink-0">
              {statusFilter ? statusFilter.replace(/_/g, ' ') : 'All Statuses'}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setStatusFilter(undefined)}>
              All Statuses
            </DropdownMenuItem>
            {STATUSES.map((s) => (
              <DropdownMenuItem key={s} onSelect={() => setStatusFilter(s)}>
                {s.replace(/_/g, ' ')}
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
        meta={meta || { total: 0, currentPage: 0, lastPage: 1 }}
        perPage={pagination.perPage}
        total={meta?.total ?? 0}
      />
    </div>
  );
}
