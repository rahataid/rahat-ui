import React from 'react';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { DemoTable } from 'apps/rahat-ui/src/common/table';
import { SearchInput } from 'apps/rahat-ui/src/common/search.input';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useActiveTabDynamicKey } from 'apps/rahat-ui/src/utils/useActiveTabDynamicKey';
import { usePagination } from '@rahat-ui/query/utils/use-pagination';
import { CustomPagination, Heading } from 'apps/rahat-ui/src/common';
import { Eye } from 'lucide-react';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import { useParams, useRouter } from 'next/navigation';
import { useLogsDetailsByVendor } from '@rahat-ui/query';
import { useDebounce } from '@rahat-ui/shadcn/src/components/custom/multi-select';
import { UUID } from 'crypto';
import { useInkindLogsColumn } from '../columns/useInkindlogsColumn';
import { BeneficiaryType } from '../types';

const INKIND_TYPE_MAP: Record<BeneficiaryType, string> = {
  predefined: 'PRE_DEFINED',
  walkin: 'WALK_IN',
};

export default function InKindBeneficiaryList() {
  const { id, vendorId }: { id: UUID; vendorId: UUID } = useParams();

  const { activeTab, setActiveTab } = useActiveTabDynamicKey(
    'subTab',
    'predefined',
  );

  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    filters,
    setFilters,
  } = usePagination();

  const debounceSearch = useDebounce(filters, 500);
  const router = useRouter();
  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | null, key: string) => {
      const value = event?.target?.value ?? '';
      setFilters({ ...filters, [key]: value });
    },
    [filters],
  );

  const inkindType =
    INKIND_TYPE_MAP[activeTab as BeneficiaryType] ?? 'PRE_DEFINED';

  const { data: logsData, isLoading } = useLogsDetailsByVendor({
    projectUuid: id,
    vendorId: vendorId,
    walletAddress: debounceSearch.walletAddress,
    inkindType,
    page: pagination.page,
    perPage: pagination.perPage,
    search: debounceSearch.walletAddress,
  });

  // Fetch counts for both tabs (no pagination / search filter)
  const { data: predefinedData } = useLogsDetailsByVendor({
    projectUuid: id,
    vendorId: vendorId,
    inkindType: 'PRE_DEFINED',
    perPage: 1,
    page: 1,
    search: debounceSearch.walletAddress,
  });

  const { data: walkinData } = useLogsDetailsByVendor({
    projectUuid: id,
    vendorId: vendorId,
    inkindType: 'WALK_IN',
    perPage: 1,
    page: 1,
  });

  const handleModeChange = (newMode: BeneficiaryType) => {
    setActiveTab(newMode);
    setPagination({ ...pagination, page: 1 });
    setFilters({});
  };

  const actionColumn = {
    id: 'action',
    header: 'Action',
    cell: ({ row }: { row: any }) => (
      <div className="flex items-center gap-2">
        <TooltipComponent
          Icon={Eye}
          tip="View Details"
          iconStyle="hover:text-primary cursor-pointer"
          handleOnClick={() => {
            router.push(
              `/projects/aa/${id}/beneficiary/${row.original.beneficiary.uuid}`,
            );
          }}
        />
      </div>
    ),
  };

  const baseColumns = useInkindLogsColumn();
  const columns = [...baseColumns, actionColumn];

  const table = useReactTable({
    manualPagination: true,
    data: logsData?.data || [],

    columns,

    getCoreRowModel: getCoreRowModel(),
  });

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
            {predefinedData?.meta?.total ?? 0}
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
            {walkinData?.meta?.total ?? 0}
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
        name="walletAddress"
        value={filters?.walletAddress || ''}
        onSearch={(e) => handleSearch(e, 'walletAddress')}
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
    </div>
  );
}
