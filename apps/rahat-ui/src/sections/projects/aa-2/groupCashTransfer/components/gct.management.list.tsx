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
import {
  ChevronDown,
  Download,
  Eye,
  Loader2,
  Plus,
  TriangleAlert,
} from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@rahat-ui/shadcn/src/components/ui/hover-card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@rahat-ui/shadcn/src/components/ui/collapsible';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import {
  DemoTable,
  SearchInput,
  CustomPagination,
  Heading,
} from 'apps/rahat-ui/src/common';
import {
  usePagination,
  useGctRecords,
  useProjectAction,
} from '@rahat-ui/query';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import { TruncatedCell } from '../../stakeholders/component/TruncatedCell';
import GctActionBtn from './gct.action-btn';
import {
  GctFundRecord,
  GCT_STATUS_STYLE,
  GCT_RECORD_STATUSES,
} from '../types/gct.types';
import { CIPS_BANKS } from '../types/cips-banks';
import { useTranslations } from 'next-intl';

export default function GctManagementList() {
  const t = useTranslations('AA Project with Cash Tracker');
  const tGlobal = useTranslations('GLOBAL');
  const { id } = useParams();
  const projectUUID = id as UUID;
  const router = useRouter();

  const { pagination, setNextPage, setPrevPage, setPerPage, setPagination } =
    usePagination();

  const [titleSearch, setTitleSearch] = useState('');
  const [groupSearch, setGroupSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );

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
        [t('GCT_RECORD_TITLE')]: r.title ?? '',
        [t('AMOUNT_COL')]: r.amount ?? '',
        [t('GROUP_CASH_TRANSFER_NAME')]: r.groupCashTransfer?.name ?? '',
        [t('STATUS_COL')]: r.status ?? '',
        [t('PAYOUT_PROCESSOR_ID')]: (r as any).payoutProcessorId ?? '',
        [t('DISBURSED_AT')]: (r as any).disbursedAt ?? '',
        [t('BATCH_ID')]:
          (r as any).disbursementInfo?.result?.transaction?.cipsBatchResponse
            .batchId ?? '',
        [t('BANK_ACCOUNT_NUMBER')]:
          r.disbursementInfo?.result?.offrampRequest?.paymentDetails
            ?.creditorAccount ?? '',

        [t('ACCOUNT_HOLDER_NAME')]:
          r.disbursementInfo?.result?.offrampRequest?.paymentDetails
            ?.creditorName ?? '',

        [t('BANK_NAME')]: (() => {
            const agentId = r.disbursementInfo?.result?.offrampRequest?.paymentDetails?.creditorAgent;
            return CIPS_BANKS.find((b) => b.bankId === agentId)?.bankName ?? agentId ?? '';
          })(),
        [t('TRANSACTION_HASH')]:
          (r as any).disbursementInfo.result?.offrampRequest?.transactionHash ??
          '',
        [t('REMARKS')]:
          (r as any).disbursementInfo?.error ??
          (r as any).disbursementInfo?.result?.transaction?.cipsTxnResponseList?.[0]
            ?.responseMessage ?? '',
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
    ...(debouncedFilters.title.trim()
      ? { search: debouncedFilters.title.trim() }
      : {}),
    ...(debouncedFilters.group.trim()
      ? { groupCashTransferName: debouncedFilters.group.trim() }
      : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
  });

  const rows = useMemo<GctFundRecord[]>(() => data?.data ?? [], [data]);
  const meta = data?.meta ?? data?.response?.meta;

  const filtered = rows;

  const columns: ColumnDef<GctFundRecord>[] = useMemo(
    () => [
      {
        id: 'title',
        header: t('GCT_FUND_TITLE'),
        cell: ({ row }) => (
          <TruncatedCell text={row.original.title || '—'} maxLength={20} />
        ),
      },
      {
        id: 'groupName',
        header: t('GCT_GROUP_NAME_COL'),
        cell: ({ row }) => (
          <TruncatedCell
            text={row.original.groupCashTransfer?.name || '—'}
            maxLength={20}
          />
        ),
      },
      {
        id: 'amount',
        header: t('AMOUNT_COL'),
        cell: ({ row }) => (
          <span className="font-semibold">
            {row.original.amount?.toLocaleString() ?? '—'}
          </span>
        ),
      },
      {
        id: 'createdBy',
        header: t('CREATED_BY_COL'),
        cell: ({ row }) => (
          <TruncatedCell text={row.original.createdBy || '—'} maxLength={18} />
        ),
      },
      {
        id: 'status',
        header: t('STATUS_COL'),
        cell: ({ row }) => {
          const s = row.original.status;
          return (
            <Badge
              className={`text-xs ${
                GCT_STATUS_STYLE[s] ?? 'bg-gray-100 text-gray-600'
              }`}
            >
              {s?.replace(/_/g, ' ') ?? '—'}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        header: t('ACTION_COL'),
        cell: ({ row }) => {
          const s = row.original.status;
          const isFailed = s === 'FAILED';
          const isRejected = s === 'REJECTED';
          const errorMsg = row.original.disbursementInfo?.error;
          return (
            <TooltipProvider>
              <div className="flex items-center gap-1">
                <GctActionBtn
                  label={tGlobal('VIEW')}
                  icon={<Eye size={16} strokeWidth={1.8} />}
                  hoverClass="hover:bg-gray-100 text-gray-600"
                  onClick={() =>
                    router.push(
                      `/projects/aa/${id}/group-cash-transfer/records/${row.original.uuid}`,
                    )
                  }
                />
                {(isFailed || isRejected) && (
                  <HoverCard openDelay={100}>
                    <HoverCardTrigger>
                      <TriangleAlert size={16} strokeWidth={1.5} color="red" />
                    </HoverCardTrigger>
                    <HoverCardContent side="left" className="rounded-sm w-72">
                      <div className="flex space-x-2 items-center">
                        <TriangleAlert
                          size={16}
                          strokeWidth={1.5}
                          color="red"
                        />
                        <span className="font-semibold text-sm/6">
                          {isRejected
                            ? t('CONTACT_ADMIN_FOR_ASSISTANCE')
                            : t('DISBURSEMENT_FAILED')}
                        </span>
                      </div>
                      {errorMsg && (
                        <Collapsible className="mt-2">
                          <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                            <ChevronDown size={12} />
                            {t('VIEW_TECHNICAL_DETAILS')}
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <p className="text-gray-500 text-xs mt-2 break-words">
                              {errorMsg}
                            </p>
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                    </HoverCardContent>
                  </HoverCard>
                )}
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
          title={t('GROUP_CASH_TRANSFER_MANAGEMENT')}
          titleStyle="font-medium text-lg"
          description={t('LIST_OF_ALL_THE_RECORDS')}
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
            {t('DOWNLOAD_LOGS')}
          </Button>
          <RoleAuth
            roles={[AARoles.ADMIN, AARoles.Municipality]}
            hasContent={false}
          >
            <Button
              size="sm"
              className="rounded-sm gap-1.5"
              onClick={() =>
                router.push(
                  `/projects/aa/${id}/group-cash-transfer/assign-cash`,
                )
              }
            >
              <Plus size={14} />
              {t('ASSIGN_CASH')}
            </Button>
          </RoleAuth>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <SearchInput
          className="flex-1 min-w-[160px]"
          name={tGlobal('TITLE')}
          value={titleSearch}
          onSearch={(e) => setTitleSearch(e.target.value)}
        />
        <SearchInput
          className="flex-1 min-w-[160px]"
          name={tGlobal('GROUP_NAME')}
          value={groupSearch}
          onSearch={(e) => setGroupSearch(e.target.value)}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1 shrink-0">
              {statusFilter ? statusFilter.replace(/_/g, ' ') : t('ALL_STATUSES')}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setStatusFilter(undefined)}>
              {t('ALL_STATUSES')}
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
