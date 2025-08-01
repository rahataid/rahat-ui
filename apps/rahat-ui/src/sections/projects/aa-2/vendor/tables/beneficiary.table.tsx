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
import { useParams } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { useVendorsBeneficiaryTableColumns } from '../columns/useBeneficiaryColumns';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';

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
  console.log(debounceSearch, 'xxxx');

  const [mode, setMode] = useState<'online' | 'offline'>('offline');

  const { data, isLoading } = useGetVendorBeneficiaries({
    projectUUID: id,
    vendorUuid: vendorId,
    payoutMode: mode === 'online' ? PayoutMode.ONLINE : PayoutMode.OFFLINE,
    ...pagination,
    name: debounceSearch.name,
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
  const columns = useVendorsBeneficiaryTableColumns();
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

  const handleModeChange = (newMode: 'online' | 'offline') => {
    setMode(newMode);
    setPagination({ ...pagination, page: 1 });
  };

  return (
    <div className="space-y-4">
      <div className="flex border-b mb-4">
        <button
          onClick={() => handleModeChange('online')}
          className={`py-2 px-4 text-sm font-medium ${
            mode === 'online'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          }`}
        >
          Online
        </button>
        <button
          onClick={() => handleModeChange('offline')}
          className={`py-2 px-4 text-sm font-medium ${
            mode === 'offline'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          }`}
        >
          Offline
        </button>
      </div>
      <Heading
        title={`${mode === 'online' ? 'Online' : 'Offline'} Beneficiaries`}
        titleStyle="text-lg"
        description={`List of all the ${mode} beneficiaries`}
      />
      <SearchInput
        className="w-full flex-[4]"
        name="name"
        onSearch={(e) => handleSearch(e, 'name')}
        value={filters?.name || ''}
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
