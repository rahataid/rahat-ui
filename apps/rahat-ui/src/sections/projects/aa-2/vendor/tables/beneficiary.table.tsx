import {
  PayoutMode,
  useGetVendorBeneficiaries,
  usePagination,
} from '@rahat-ui/query';
import {
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { DemoTable, Heading, SearchInput } from 'apps/rahat-ui/src/common';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { useActiveTabDynamicKey } from 'apps/rahat-ui/src/utils/useActiveTabDynamicKey';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import { useParams } from 'next/navigation';
import React, { useMemo } from 'react';
import { useVendorsBeneficiaryTableColumns } from '../columns/useBeneficiaryColumns';

interface VendorsBeneficiaryListProps {
  beneficiaryData?: {
    success: boolean;
    data: any[];
    meta: any;
  };
  loading?: boolean;
}

export default function VendorsBeneficiaryList({
  beneficiaryData,
  loading,
}: VendorsBeneficiaryListProps) {
  const { id, vendorId } = useParams();
  const { activeTab, setActiveTab } = useActiveTabDynamicKey(
    'subTab',
    PayoutMode.ONLINE,
  );

  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
    filters,
    setFilters,
    setPagination,
    resetSelectedListItems,
  } = usePagination();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | null, key: string) => {
      const value = event?.target?.value ?? '';
      setFilters({ ...filters, [key]: value });
    },
    [filters],
  );

  const debounceSearch = useDebounce(filters, 500);

  const { data, isLoading } = useGetVendorBeneficiaries({
    projectUUID: id,
    vendorUuid: vendorId,
    payoutMode:
      activeTab === PayoutMode.ONLINE ? PayoutMode.ONLINE : PayoutMode.OFFLINE,
    ...pagination,
    walletAddress: debounceSearch.walletAddress,
  });

  const tableData = useMemo(() => {
    if (data?.response?.data?.length > 0) {
      return data?.response?.data?.map((beneficiary: any) => {
        return {
          name: beneficiary?.name,
          benTokens: beneficiary?.benTokens,
          walletAddress: beneficiary?.walletAddress,
          uuid: beneficiary?.uuid,
        };
      });
    } else {
      return [];
    }
  }, [data?.response?.data]);
  const columns = useVendorsBeneficiaryTableColumns(activeTab as PayoutMode);
  const table = useReactTable({
    manualPagination: true,
    data: tableData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });

  const handleModeChange = (newMode: PayoutMode) => {
    setActiveTab(newMode);
    setPagination({ ...pagination, page: 1 });
  };

  return (
    <div className="space-y-4">
      <div className="flex border-b mb-4">
        <button
          onClick={() => handleModeChange(PayoutMode.ONLINE)}
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === PayoutMode.ONLINE
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          }`}
        >
          Online
        </button>
        <button
          onClick={() => handleModeChange(PayoutMode.OFFLINE)}
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === PayoutMode.OFFLINE
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          }`}
        >
          Offline
        </button>
      </div>
      <Heading
        title={`${
          activeTab === PayoutMode.ONLINE ? 'Online' : 'Offline'
        } Beneficiaries`}
        titleStyle="text-lg"
        description={`List of all the ${activeTab} beneficiaries`}
      />
      <SearchInput
        className="w-full flex-[4]"
        name="walletAddress"
        onSearch={(e) => handleSearch(e, 'walletAddress')}
        value={filters?.walletAddress || ''}
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
        meta={data?.response?.meta || { total: 0, currentPage: 0 }}
        perPage={pagination?.perPage}
        total={data?.response?.meta?.total || 0}
      />
    </div>
  );
}
