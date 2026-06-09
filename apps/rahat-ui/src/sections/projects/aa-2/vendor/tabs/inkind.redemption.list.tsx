import {
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  CustomPagination,
  DemoTable,
  SearchInput,
  SpinnerLoader,
} from 'apps/rahat-ui/src/common';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import React from 'react';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import { UUID } from 'crypto';
import { usePagination, useGetInkindRedemptionLogs } from '@rahat-ui/query';
import { useInkindRedemptionColumn } from '../columns/useInkindRedemptionColumn';
import { InkindType } from '../../inkindManagement/schemas/inkind.validation';

export type InkindRedemptionData = {
  uuid: UUID;
  vendor: {
    name: string;
  };
  beneficiaryName: string;
  beneficiaryWallet: string;
  inkind: {
    name: string;
    type: InkindType;
  };
  quantity: number;
  approvedAt: Date;
  approvedBy: string;
  redemptionStatus: string;
  redeemedAt: string;
  transactionHash: string | null;
};

export const InkindRedemptionList = ({
  id,
  vendorId,
  showActions = true,
}: {
  id: UUID;
  vendorId?: UUID;
  showActions?: boolean;
}) => {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const {
    filters,
    setFilters,
    pagination,
    setPerPage,
    setNextPage,
    setPrevPage,
    setPagination,
  } = usePagination();

  const debounceSearch = useDebounce(filters, 500);

  const { data, isPending } = useGetInkindRedemptionLogs({
    projectUuid: id,
    ...pagination,
    ...(vendorId ? { vendorUuid: vendorId } : {}),
    vendorName: debounceSearch.vendorName,
    inkindName: debounceSearch.inkindName,
    status: filters.status,
    inkindType: filters.inkindType,
  });

  const queryData = data as any;

  const meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  } = queryData?.response?.meta || {
    total: 0,
    lastPage: 0,
    currentPage: 0,
    perPage: 0,
    prev: null,
    next: null,
  };

  const columns = useInkindRedemptionColumn(id, showActions);

  const table = useReactTable({
    manualPagination: true,
    data: queryData?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | null, key: string) => {
      const value = event?.target?.value ?? '';
      setFilters({ ...filters, [key]: value });
      setPagination({ ...pagination, page: 1 });
    },
    [filters, pagination, setFilters, setPagination],
  );

  const handleFilterChange = React.useCallback(
    (filterName: string, value: string) => {
      const filterValue = value === 'ALL' ? '' : value;
      setFilters({ ...filters, [filterName]: filterValue });
      setPagination({ ...pagination, page: 1 });
    },
    [filters, pagination, setFilters, setPagination],
  );

  if (isPending) {
    return <SpinnerLoader />;
  }
  return (
    <div className="rounded border bg-card p-4">
      <div className="flex justify-between space-x-2 mb-2">
        <SearchInput
          className="w-full flex-[4]"
          name="vendor name"
          onSearch={(e) => handleSearch(e, 'vendorName')}
          value={filters?.vendorName || ''}
        />
        <SearchInput
          className="w-full flex-[4]"
          name="inkind name"
          onSearch={(e) => handleSearch(e, 'inkindName')}
          value={filters?.inkindName || ''}
        />
        <SelectComponent
          name="Status"
          options={['ALL', 'APPROVED', 'REQUESTED']}
          onChange={(value) => handleFilterChange('status', value)}
          value={
            ['REQUESTED', 'APPROVED'].includes(filters?.status)
              ? filters.status
              : ''
          }
          className="flex-[1]"
        />
        <SelectComponent
          name="Inkind Type"
          options={['ALL', 'PRE_DEFINED', 'WALK_IN']}
          onChange={(value) => handleFilterChange('inkindType', value)}
          value={
            ['PRE_DEFINED', 'WALK_IN'].includes(filters?.inkindType)
              ? filters.inkindType
              : ''
          }
          className="flex-[1]"
        />
      </div>
      <DemoTable
        table={table}
        tableHeight="h-[500px]"
        message="No In-kind Redemption Records"
        // loading={isPending}
      />
      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        setPagination={setPagination}
        meta={meta}
        perPage={pagination.perPage}
        total={queryData?.response?.meta?.total || 0}
      />
    </div>
  );
};
