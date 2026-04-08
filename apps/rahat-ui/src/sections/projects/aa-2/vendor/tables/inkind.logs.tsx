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

const mockData = {
  success: true,
  data: [
    {
      uuid: '1',
      walletAddress: '1A1zP1eP5Q...Gefi2',
      groupName: 'Aashman Group',
      inKindName: 'Aashman In-kind',
      inKindQuantity: '1,000',
      txHash: '1A1zP1eP5Q...Gefi2',
      timestamp: '2024-01-01 12:00:00',
    },
    {
      uuid: '2',
      walletAddress: '1B1zP1eP5Q...Gefi2',
      groupName: 'Akash Group',
      inKindName: 'Akash In-kind',
      inKindQuantity: '1,000',
      txHash: '1B1zP1eP5Q...Gefi2',
      timestamp: '2024-01-01 12:00:00',
    },
  ],
  meta: {
    total: 2,
    lastPage: 1,
    currentPage: 1,
    perPage: 10,
    prev: null,
    next: null,
  },
};

const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'groupName',
    header: 'Group Name',
  },

  {
    accessorKey: 'walletAddress',
    header: 'Beneficiary Wallet Address',
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        {row.original.walletAddress}
        <CopyTooltip
          value={row.getValue('walletAddress')}
          uniqueKey={row.original?.uuid}
        />
      </div>
    ),
  },
  { accessorKey: 'inKindName', header: 'In-kind Name' },
  { accessorKey: 'inKindQuantity', header: 'In-kind Quantity' },
  {
    accessorKey: 'txHash',
    header: 'TxHash',
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        {row.original.txHash}
        <CopyTooltip
          value={row.getValue('txHash')}
          uniqueKey={row.original?.uuid}
        />
      </div>
    ),
  },
  { accessorKey: 'timestamp', header: 'Timestamp' },
];

export default function InKindLogs() {
  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    filters,
    setFilters,
    setPagination,
  } = usePagination();

  const [search, setSearch] = React.useState('');
  const filteredData = React.useMemo(
    () =>
      mockData.data.filter((row) =>
        row.walletAddress.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );
  const table = useReactTable({
    data: filteredData,
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

      <SearchInput
        name="walletAddress"
        value={search}
        onSearch={(e) => setSearch(e.target.value)}
        placeholder="Search wallet"
      />
      <DemoTable table={table} />
      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        meta={mockData.meta || { total: 0, currentPage: 0 }}
        perPage={pagination?.perPage}
        total={mockData.meta?.total || 0}
      />
    </div>
  );
}
