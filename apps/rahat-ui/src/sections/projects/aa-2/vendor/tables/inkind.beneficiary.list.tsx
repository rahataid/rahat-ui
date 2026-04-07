import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
} from '@tanstack/react-table';
import { DemoTable } from 'apps/rahat-ui/src/common/table';
import { SearchInput } from 'apps/rahat-ui/src/common/search.input';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useActiveTabDynamicKey } from 'apps/rahat-ui/src/utils/useActiveTabDynamicKey';
import { usePagination } from '@rahat-ui/query/utils/use-pagination';
import { CustomPagination, Heading } from 'apps/rahat-ui/src/common';
import { Copy, Eye } from 'lucide-react';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import CopyTooltip from 'apps/rahat-ui/src/common/copyTooltip';

const mockData = {
  success: true,
  data: [
    {
      uuid: '1',
      walletAddress: '1A1zP1eP5Q...Gefi2',
      groupName: 'Akash Group',
      inKindName: 'Akash In-kind',
      inKindQuantity: '1,000',
      txHash: '1A1zP1eP5Q...Gefi2',
    },
    {
      uuid: '2',
      walletAddress: '1B1zP1eP5Q...Gefi2',
      groupName: 'Aashman Group',
      inKindName: 'Aashman In-kind',
      inKindQuantity: '1,000',
      txHash: '1B1zP1eP5Q...Gefi2',
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

type BeneficiaryType = 'predefined' | 'walkin';

const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'walletAddress',
    header: 'Wallet Address',
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
  { accessorKey: 'groupName', header: 'Group Name' },
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
  {
    id: 'action',
    header: 'Action',
    cell: () => (
      <div className="flex items-center gap-2">
        <TooltipComponent
          Icon={Eye}
          tip="View Details"
          iconStyle="hover:text-primary cursor-pointer"
        />
      </div>
    ),
  },
];

export default function InKindBeneficiaryList() {
  const { activeTab, setActiveTab } = useActiveTabDynamicKey(
    'subTab',
    'predefined',
  );
  const [search, setSearch] = React.useState('');

  const { pagination, setNextPage, setPrevPage, setPerPage, setPagination } =
    usePagination();

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

  const handleModeChange = (newMode: BeneficiaryType) => {
    setActiveTab(newMode);
    setPagination({ ...pagination, page: 1 });
  };

  return (
    <div className="space-y-4">
      <div className="flex border-b mb-4 ">
        <button
          onClick={() => handleModeChange('predefined')}
          className={`py-2 px-4 text-sm font-medium flex items-center gap-2 ${
            activeTab === 'predefined'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          }`}
        >
          Pre-defined Beneficiary List
          <Badge
            className={`h-5 min-w-[20px] justify-center text-white px-2 py-0 ${
              activeTab === 'predefined' ? 'bg-[#297AD6]' : 'bg-[#8390A2]'
            }`}
          >
            {/* {totalOnlineBenefciary} */}
            10
          </Badge>
        </button>
        <button
          onClick={() => handleModeChange('walkin')}
          className={`py-2 px-4 text-sm font-medium flex items-center gap-2 ${
            activeTab === 'walkin'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          }`}
        >
          Walk-in Beneficiary List
          <Badge
            className={`h-5 min-w-[20px] justify-center text-white px-2 py-0 ${
              activeTab === 'walkin' ? 'bg-[#297AD6]' : 'bg-[#8390A2]'
            }`}
          >
            5
          </Badge>
        </button>
      </div>
      <Heading
        title={`${
          activeTab === 'predefined' ? 'Pre-defined' : 'Walk-in'
        } Beneficiary List`}
        titleStyle="text-lg"
        description={`List of all the ${
          activeTab === 'predefined' ? 'Pre-defined' : 'Walk-in'
        } beneficiaries`}
      />
      <SearchInput
        name="wallet"
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
