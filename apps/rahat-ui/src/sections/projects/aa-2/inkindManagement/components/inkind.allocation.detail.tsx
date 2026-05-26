'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { UUID } from 'crypto';
import {
  useGetGroupInkindLogs,
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  VisibilityState,
} from '@tanstack/react-table';
import {
  DemoTable,
  SearchInput,
  CustomPagination,
  HeaderWithBack,
  DataCard,
  SpinnerLoader,
  IconLabelBtn,
} from 'apps/rahat-ui/src/common';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { Eye, Package, ArrowUpDown, CloudDownloadIcon } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { format } from 'date-fns';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import { getExplorerUrl } from 'apps/rahat-ui/src/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

type LogRow = {
  uuid: string;
  beneficiaryUuid: string;
  beneficiaryWalletAddress: string;
  beneficiaryPhone: string | null;
  beneficiaryName: string | null;
  vendorUuid: string;
  vendorName: string;
  vendorWalletAddress: string;
  quantity: number;
  txHash: string | null;
  redeemedAt?: string;
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

function formatLogs(raw: any[]): LogRow[] {
  return raw.map((r) => ({
    uuid: r.uuid ?? r.id ?? '',
    beneficiaryUuid: r.beneficiary?.uuid ?? '',
    beneficiaryWalletAddress:
      r.beneficiary?.walletAddress ?? r.walletAddress ?? 'N/A',
    beneficiaryPhone: r.beneficiary?.phone ?? null,
    beneficiaryName: r.beneficiary?.name ?? null,
    vendorUuid: r.vendor?.uuid ?? '',
    vendorName: r.vendor?.name ?? 'N/A',
    vendorWalletAddress: r.vendor?.walletAddress ?? 'N/A',
    quantity: r.quantity ?? r.quantityDisbursed ?? 0,
    txHash: r.txHash ?? null,
    redeemedAt: r.redeemedAt ?? r.createdAt,
  }));
}

export default function InkindAllocationDetail() {
  const { id, allocationId } = useParams();
  const projectUUID = id as UUID;
  const router = useRouter();
  const sp = useSearchParams();

  const { settings } = useProjectSettingsStore((s) => ({
    settings: s.settings,
  }));

  const qGroupName = sp.get('groupName') ?? 'N/A';
  const qInkindType = sp.get('inkindType') ?? '';
  const qInkindAvailableStock = Number(sp.get('inkindAvailableStock') ?? 0);

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'redeemedAt' | 'quantity'>('redeemedAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const debouncedSearch = useDebounce(search, 500);

  const { data: logsData, isLoading: logsLoading } = useGetGroupInkindLogs(
    projectUUID,
    allocationId as string,
    {
      search: debouncedSearch || undefined,
      sort,
      order,
      page,
      perPage,
    },
  );

  const groupInkind = logsData?.data?.groupInkind ?? null;
  const meta = logsData?.meta ?? null;

  const groupName = groupInkind?.groupName ?? qGroupName;
  const inkindName = groupInkind?.inkindName ?? 'N/A';
  const inkindType = groupInkind?.inkindType ?? qInkindType;
  const inkindAvailableStock =
    inkindType === 'WALK_IN'
      ? qInkindAvailableStock
      : groupInkind?.inkindAvailableStock ?? qInkindAvailableStock;
  const quantityAllocated = groupInkind?.quantityAllocated ?? 0;
  const quantityRedeemed = groupInkind?.quantityRedeemed ?? 0;
  const totalBeneficiaries = groupInkind?.totalBeneficiaries ?? 0;

  const isWalkIn = inkindType === 'WALK_IN';
  const totalAvailableInkinds = isWalkIn
    ? inkindAvailableStock + quantityRedeemed
    : quantityAllocated;

  const {
    isFetching: isDownloading,
    refetch: fetchEntireLogs,
    data: entireLogsData,
  } = useGetGroupInkindLogs(
    projectUUID,
    allocationId as string,
    { sort, order },
    true,
    { enabled: false },
  );

  // console.log('entireLogsData', entireLogsData);
  useEffect(() => {
    if (!entireLogsData) return;
    const raw = (entireLogsData as any)?.data?.logs;
    if (!Array.isArray(raw) || raw.length === 0) return;

    const groupInkindMeta = (entireLogsData as any)?.data?.groupInkind;
    const csvInkindName = groupInkindMeta?.inkindName ?? inkindName;
    const csvGroupName = groupInkindMeta?.groupName ?? groupName;

    const flattenEntry = (
      entry: Record<string, any>,
    ): Record<string, string> => {
      const result: Record<string, string> = {};
      for (const [key, value] of Object.entries(entry)) {
        if (
          value !== null &&
          typeof value === 'object' &&
          !Array.isArray(value)
        ) {
          for (const [nestedKey, nestedVal] of Object.entries(value)) {
            result[`${key} ${nestedKey}`] =
              nestedVal == null ? 'N/A' : String(nestedVal);
          }
        } else {
          result[key] = value == null ? 'N/A' : String(value);
        }
      }
      return result;
    };

    const flatRows = raw.map(flattenEntry);
    const headers = Object.keys(flatRows[0]);

    const escape = (val: string) =>
      val.includes(',') || val.includes('"') || val.includes('\n')
        ? `"${val.replace(/"/g, '""')}"`
        : val;

    const csvLines = [
      headers.join(','),
      ...flatRows.map((r: Record<string, string>) =>
        headers.map((h) => escape(r[h] ?? 'N/A')).join(','),
      ),
    ];

    const blob = new Blob([csvLines.join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${csvInkindName}-${csvGroupName}.csv`
      .replace(/\s+/g, '-')
      .toLowerCase();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [entireLogsData]);

  const handleDownloadReport = () => {
    fetchEntireLogs();
  };

  const inklindAllocationStats = [
    { name: 'Inkind Name', amount: inkindName },
    { name: 'No of Beneficiaries', amount: totalBeneficiaries },
    { name: 'Total Inkinds', amount: totalAvailableInkinds },
    { name: 'Total Redeemed', amount: quantityRedeemed },
  ];

  const status = isWalkIn
    ? deriveStatus(totalAvailableInkinds, quantityRedeemed)
    : deriveStatus(quantityAllocated, quantityRedeemed);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const getTxUrl = (txHash?: string | null) =>
    getExplorerUrl({
      chainSettings:
        settings?.[projectUUID]?.[PROJECT_SETTINGS_KEYS.CHAIN_SETTINGS],
      target: 'tx',
      value: txHash || '',
    });

  const logRows = useMemo<LogRow[]>(() => {
    const raw = logsData?.data?.logs;
    return Array.isArray(raw) && raw.length > 0 ? formatLogs(raw) : [];
  }, [logsData]);

  const columns: ColumnDef<LogRow>[] = [
    {
      accessorKey: 'beneficiaryWalletAddress',
      header: 'Beneficiary Wallet',
      cell: ({ row }) => (
        <TruncatedCell
          text={row.original.beneficiaryWalletAddress}
          maxLength={18}
        />
      ),
    },
    {
      accessorKey: 'txHash',
      header: 'Transaction Hash',
      cell: ({ row }) => {
        const txHash = row.original.txHash;
        const txnUrl = getTxUrl(txHash);

        return txHash ? (
          <a
            href={txnUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline cursor-pointer"
          >
            <TruncatedCell text={txHash} maxLength={18} />
          </a>
        ) : (
          <TruncatedCell text="N/A" maxLength={18} />
        );
      },
    },
    {
      accessorKey: 'vendorName',
      header: 'Vendor',
      cell: ({ row }) => (
        <TruncatedCell text={row.original.vendorName} maxLength={20} />
      ),
    },
    {
      accessorKey: 'quantity',
      header: 'Qty',
      cell: ({ row }) => (
        <span className="font-semibold">{row.original.quantity}</span>
      ),
    },
    {
      accessorKey: 'redeemedAt',
      header: 'Redeemed At',
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.redeemedAt
            ? format(new Date(row.original.redeemedAt), 'MMM dd, yyyy, hh:mm a')
            : '—'}
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
          beneficiaryWalletAddress: r.beneficiaryWalletAddress,
          beneficiaryPhone: r.beneficiaryPhone ?? '',
          beneficiaryName: r.beneficiaryName ?? '',
          vendorName: r.vendorName,
          vendorWalletAddress: r.vendorWalletAddress,
          txHash: r.txHash ?? '',
          quantity: String(r.quantity),
          redeemedAt: r.redeemedAt ?? '',
          inkindName,
          groupName,
          inkindType,
          inkindAvailableStock: String(inkindAvailableStock),
        });
        return (
          <TooltipComponent
            Icon={Eye}
            tip="View Transaction Details"
            iconStyle="hover:text-primary cursor-pointer"
            handleOnClick={() =>
              router.push(
                `/projects/aa/${id}/inkind-management/${allocationId}/transactions/${r.uuid}?${params}`,
              )
            }
          />
        );
      },
    },
  ];

  const table = useReactTable({
    data: logRows,
    columns,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualFiltering: true,
    state: { columnVisibility },
  });

  if (logsLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <SpinnerLoader />
      </div>
    );
  }
  return (
    <div className="p-4">
      <div className="flex items-center justify-between ">
        <HeaderWithBack
          path={`/projects/aa/${id}/inkind-management?tab=inkindAllocation&mode=${
            sp.get('from') ?? 'online'
          }`}
          title={groupName}
          subtitle="Disbursement information for this group allocation"
          status={status}
          badgeClassName={STATUS_STYLE[status]}
        />
        <div className="flex gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <IconLabelBtn
                  Icon={CloudDownloadIcon}
                  handleClick={handleDownloadReport}
                  name={isDownloading ? 'Exporting...' : 'Export In-kind Logs'}
                  variant="outline"
                  disabled={isDownloading || logRows.length === 0}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Export In-kind Logs</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {inklindAllocationStats.map((card) => (
          <DataCard
            key={card.name}
            title={card.name}
            number={String(card.amount)}
            className="border-solid rounded-sm"
            iconStyle="bg-white text-secondary-muted"
          />
        ))}
      </div>

      <Card className="rounded-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Package className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm">Inkind logs</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            List of all beneficiaries who received this inkind
          </p>

          <div className="flex items-center gap-2 mb-3">
            <SearchInput
              className="flex-1"
              name="Search by wallet / name / phone"
              value={search}
              onSearch={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1 text-sm"
              onClick={() => {
                setOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
                setPage(1);
              }}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              {order === 'desc' ? 'Desc' : 'Asc'}
            </Button>
          </div>

          <DemoTable
            table={table}
            tableHeight="h-[calc(100vh-520px)]"
            loading={logsLoading}
          />
          <CustomPagination
            currentPage={page}
            handleNextPage={() => setPage((p) => p + 1)}
            handlePrevPage={() => setPage((p) => Math.max(1, p - 1))}
            handlePageSizeChange={(size) => {
              setPerPage(size as number);
              setPage(1);
            }}
            meta={{
              total: meta?.total ?? logRows.length,
              currentPage: page,
              lastPage: meta?.lastPage ?? 1,
              perPage,
              next: meta?.next ?? null,
              prev: meta?.prev ?? null,
            }}
            perPage={perPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
