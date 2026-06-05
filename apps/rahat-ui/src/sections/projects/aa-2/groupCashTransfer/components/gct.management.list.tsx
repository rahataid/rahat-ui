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
import { TooltipProvider } from '@rahat-ui/shadcn/src/components/ui/tooltip';
import * as XLSX from 'xlsx';
import { ChevronDown, Download, Eye, Loader2, Plus } from 'lucide-react';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { DemoTable, SearchInput, CustomPagination, Heading } from 'apps/rahat-ui/src/common';
import { usePagination, useGctRecords, useProjectAction } from '@rahat-ui/query';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import { TruncatedCell } from '../../stakeholders/component/TruncatedCell';
import GctActionBtn from './gct.action-btn';
import { GctFundRecord, GCT_STATUS_STYLE, GCT_RECORD_STATUSES } from '../types/gct.types';

export default function GctManagementList() {
  const { id } = useParams();
  const projectUUID = id as UUID;
  const router = useRouter();

  const { pagination, setNextPage, setPrevPage, setPerPage, setPagination } =
    usePagination();

  const [titleSearch, setTitleSearch] = useState('');
  const [groupSearch, setGroupSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const debouncedFilters = useDebounce(
    { title: titleSearch, group: groupSearch },
    500,
  );

  useEffect(() => {
    setPagination((prev: typeof pagination) => ({ ...prev, page: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters.title, debouncedFilters.group, statusFilter]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [downloading, setDownloading] = useState(false);
  const q = useProjectAction();

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const result = await q.mutateAsync({
        uuid: projectUUID as `${string}-${string}-${string}-${string}-${string}`,
        data: {
          action: 'aaProject.groupCashTransfer.getRecords',
          payload: {
            perPage: 10000,
            sort: 'createdAt',
            order: 'desc',
            ...(statusFilter ? { status: statusFilter } : {}),
          },
        },
      });
      const records: GctFundRecord[] = result?.data ?? [];
      const rows = records.map((r) => ({
        'Record Name': r.title ?? '',
        'Amount': r.amount ?? '',
        'Group Cash Transfer Name': r.groupCashTransfer?.name ?? '',
        'Status': r.status ?? '',
        'Payout Processor ID': (r as any).payoutProcessorId ?? '',
        'Disbursed At': (r as any).disbursedAt ?? '',
      }));
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Logs');
      const date = new Date().toISOString().split('T')[0];
      const suffix = statusFilter ? `_${statusFilter.toLowerCase()}` : '';
      XLSX.writeFile(wb, `group_cash_transfer_logs${suffix}_${date}.xlsx`);
    } finally {
      setDownloading(false);
    }
  };

  const { data, isLoading } = useGctRecords(projectUUID, {
    page: pagination.page,
    perPage: pagination.perPage,
    sort: 'createdAt',
    order: 'desc',
    ...(debouncedFilters.title ? { search: debouncedFilters.title } : {}),
    ...(debouncedFilters.group ? { groupCashTransferName: debouncedFilters.group } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
  });

  const rows = useMemo<GctFundRecord[]>(() => data?.data ?? [], [data]);
  const meta = data?.meta ?? data?.response?.meta;

  const filtered = rows;

  const columns: ColumnDef<GctFundRecord>[] = useMemo(
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
          const s = row.original.status;
          return (
            <Badge
              className={`text-xs ${GCT_STATUS_STYLE[s] ?? 'bg-gray-100 text-gray-600'}`}
            >
              {s?.replace(/_/g, ' ') ?? '—'}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => (
          <TooltipProvider>
            <div className="flex items-center gap-1">
              <GctActionBtn
                label="View"
                icon={<Eye size={16} strokeWidth={1.8} />}
                hoverClass="hover:bg-gray-100 text-gray-600"
                onClick={() =>
                  router.push(
                    `/projects/aa/${id}/group-cash-transfer/records/${row.original.uuid}`,
                  )
                }
              />
            </div>
          </TooltipProvider>
        ),
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
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="rounded-sm gap-1.5"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Download size={14} />
            )}
            Download Logs
          </Button>
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
      </div>

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
            {GCT_RECORD_STATUSES.map((s) => (
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
