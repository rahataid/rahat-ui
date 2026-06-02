import {
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  CustomPagination,
  DemoTable,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import React from 'react';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import { UUID } from 'crypto';
import { usePagination, useGetInkindRedemptionLogs } from '@rahat-ui/query';
import { useInkindRedemptionColumn } from '../columns/useInkindRedemptionColumn';
import { InkindType } from '../../inkindManagement/schemas/inkind.validation';
import SpinnerLoader from '../../../components/spinner.loader';

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
}: {
  id: UUID;
  vendorId?: UUID;
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

  // const data = {
  //   success: true,
  //   data: [
  //     {
  //       id: 2,
  //       uuid: '123fd8f6-a14d-4234-afa5-fb3f6e66e74b',
  //       redemptionStatus: 'APPROVED',
  //       quantity: 20,
  //       transactionHash:
  //         '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  //       approvedBy: 'Rumsan',
  //       approvedAt: '2026-05-22T09:41:00.151Z',
  //       inkindUuid: 'c95160e3-12ea-491d-af51-6aa579046516',
  //       vendorUuid: '8f8328c4-7164-4c75-ba8e-9a9f63e74fee',
  //       createdAt: '2026-05-22T07:02:55.489Z',
  //       updatedAt: '2026-05-22T07:02:55.489Z',
  //       inkind: {
  //         uuid: 'c95160e3-12ea-491d-af51-6aa579046516',
  //         name: 'CHHATA',
  //         type: 'WALK_IN',
  //       },
  //       vendor: {
  //         uuid: '8f8328c4-7164-4c75-ba8e-9a9f63e74fee',
  //         name: 'Mohit Rajbhandari',
  //       },
  //     },
  //     {
  //       id: 1,
  //       uuid: '32ab7cbe-71a2-4ea7-a3b5-2c5ae864d727',
  //       redemptionStatus: 'REQUESTED',
  //       quantity: 20,
  //       transactionHash: null,
  //       approvedBy: null,
  //       approvedAt: '2026-05-22T06:32:07.269Z',
  //       inkindUuid: '6b90233a-1976-4826-b6cb-20a6a93c3fcb',
  //       vendorUuid: '8f8328c4-7164-4c75-ba8e-9a9f63e74fee',
  //       createdAt: '2026-05-22T06:32:07.269Z',
  //       updatedAt: '2026-05-22T06:32:07.269Z',
  //       inkind: {
  //         uuid: '6b90233a-1976-4826-b6cb-20a6a93c3fcb',
  //         name: 'GLASS',
  //         type: 'PRE_DEFINED',
  //       },
  //       vendor: {
  //         uuid: '8f8328c4-7164-4c75-ba8e-9a9f63e74fee',
  //         name: 'Mohit Rajbhandari',
  //       },
  //     },
  //   ],
  //   meta: {
  //     total: 2,
  //     lastPage: 1,
  //     currentPage: 1,
  //     perPage: 10,
  //     prev: null,
  //     next: null,
  //   },
  // };
  const { data, isPending } = useGetInkindRedemptionLogs({
    projectUuid: id,
    ...pagination,
    ...(vendorId ? { vendorUuid: vendorId } : {}),
    search: debounceSearch.name,
    status: debounceSearch.status,
    inkindType: debounceSearch.inkindType,
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

  const columns = useInkindRedemptionColumn(id);

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
          onSearch={(e) => handleSearch(e, 'name')}
          value={filters?.name || ''}
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
