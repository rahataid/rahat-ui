import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
} from '@tanstack/react-table';
import { DemoTable } from 'apps/rahat-ui/src/common/table';
import { SearchInput } from 'apps/rahat-ui/src/common/search.input';
import { CustomPagination, Heading } from 'apps/rahat-ui/src/common';
import { usePagination } from '@rahat-ui/query/utils/use-pagination';
import CopyTooltip from 'apps/rahat-ui/src/common/copyTooltip';
import { useParams } from 'next/navigation';
import { useLogsDetailsByVendor } from '@rahat-ui/query';
import { UUID } from 'crypto';
import Loader from 'apps/community-tool-ui/src/components/Loader';
import { TruncatedCell } from '../../stakeholders/component/TruncatedCell';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { useDebounce } from '@rahat-ui/shadcn/src/components/custom/multi-select';

interface InKindLog {
  uuid: UUID;
  beneficiaryWallet: string;
  groupInkindId: UUID;
  quantity: number;
  redeemedAt: string;
  txHash: string | null;
  vendorUid: UUID;
  beneficiary: {
    uuid: UUID;
    walletAddress: string;
    phone: string | null;
    extras: {
      phone: string;
      validPhoneNumber: boolean;
    };
  };
  groupInkind: {
    uuid: UUID;
    inkind: {
      uuid: UUID;
      name: string;
      type: string;
    };
    group: {
      uuid: UUID;
      name: string;
    };
  };
}

const columns: ColumnDef<InKindLog>[] = [
  {
    accessorKey: 'groupName',
    header: 'Group Name',
    cell: ({ row }) => (
      <TruncatedCell
        text={row.original.groupInkind.group.name}
        maxLength={20}
      />
    ),
  },

  {
    accessorKey: 'beneficiaryWallet',
    header: 'Beneficiary Wallet Address',
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <TruncatedCell text={row.original.beneficiaryWallet} maxLength={10} />
        <CopyTooltip
          value={row.getValue('beneficiaryWallet')}
          uniqueKey={row.original?.uuid}
        />
      </div>
    ),
  },
  {
    accessorKey: 'inKindName',
    header: 'In-kind Name',
    cell: ({ row }) => (
      <TruncatedCell
        text={row.original.groupInkind.inkind.name}
        maxLength={15}
      />
    ),
  },
  {
    accessorKey: 'quantity',
    header: 'In-kind Quantity',
  },
  {
    accessorKey: 'txHash',
    header: 'TxHash',
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <TruncatedCell text={row.original.txHash || 'N/A'} maxLength={10} />
        <CopyTooltip
          value={row.getValue('txHash')}
          uniqueKey={row.original?.uuid}
        />
      </div>
    ),
  },
  {
    accessorKey: 'redeemedAt',
    header: 'Timestamp',
    cell: ({ row }) => (
      <TruncatedCell
        text={
          row?.original?.redeemedAt ? dateFormat(row?.original?.redeemedAt) : ''
        }
        maxLength={10}
      />
    ),
  },
];

export default function InKindLogs() {
  const { id, vendorId }: { id: UUID; vendorId: UUID } = useParams();

  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    filters,
    setFilters,
  } = usePagination();

  const debounceSearch = useDebounce(filters, 500);

  const { data: logsData, isLoading } = useLogsDetailsByVendor({
    projectUuid: id,
    vendorId: vendorId,
    walletAddress: debounceSearch.walletAddress,
    page: pagination.page,
    perPage: pagination.perPage,
    search: debounceSearch.walletAddress,
  });

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | null, key: string) => {
      const value = event?.target?.value ?? '';
      setFilters({ ...filters, [key]: value });
    },
    [filters],
  );

  const table = useReactTable({
    manualPagination: true,
    data: logsData?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="space-y-4">
      <Heading
        title="In-kind Logs"
        titleStyle="text-lg"
        description="List of all in-kind transactions"
      />

      {isLoading ? (
        <div className="w-full">
          <Loader />
        </div>
      ) : (
        <>
          <SearchInput
            name="walletAddress"
            onSearch={(e) => handleSearch(e, 'walletAddress')}
            value={filters?.walletAddress || ''}
            placeholder="Search wallet"
          />
          <DemoTable
            table={table}
            tableHeight={'h-[calc(400px)]'}
            loading={isLoading}
          />
          <CustomPagination
            currentPage={pagination.page}
            handleNextPage={setNextPage}
            handlePrevPage={setPrevPage}
            handlePageSizeChange={setPerPage}
            meta={
              (logsData?.meta as any) || {
                total: 0,
                lastPage: 0,
                currentPage: 0,
                perPage: 0,
                prev: null,
                next: null,
              }
            }
            perPage={pagination?.perPage}
            total={logsData?.meta?.total || 0}
          />
        </>
      )}
    </div>
  );
}
