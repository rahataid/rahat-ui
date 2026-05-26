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
import { usePagination } from '@rahat-ui/query';
import { useInkindRedemptionColumn } from '../columns/useInkindRedemptionColumn';

export type DummyInkindRedemption = {
  uuid: string;
  vendor: {
    name: string;
  };
  beneficiaryName: string;
  beneficiaryWallet: string;
  inkind: {
    name: string;
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

  console.log('vendor id', vendorId);
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

  // const { data, isPending } = useGetInkindRedemptionLogs({
  //   projectUuid: id,
  //   ...pagination,
  //   ...(vendorId ? { vendorUuid: vendorId } : {}),
  //   search: debounceSearch.name,
  // });

  const data = {
    success: true,
    data: [
      {
        id: 2,
        uuid: '123fd8f6-a14d-4234-afa5-fb3f6e66e74b',
        redemptionStatus: 'APPROVED',
        quantity: 20,
        transactionHash:
          '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        approvedBy: 'Rumsan',
        approvedAt: '2026-05-22T09:41:00.151Z',
        inkindUuid: 'c95160e3-12ea-491d-af51-6aa579046516',
        vendorUuid: '8f8328c4-7164-4c75-ba8e-9a9f63e74fee',
        createdAt: '2026-05-22T07:02:55.489Z',
        updatedAt: '2026-05-22T07:02:55.489Z',
        inkind: {
          uuid: 'c95160e3-12ea-491d-af51-6aa579046516',
          name: 'CHHATA',
          type: 'WALK_IN',
        },
        vendor: {
          uuid: '8f8328c4-7164-4c75-ba8e-9a9f63e74fee',
          name: 'Mohit Rajbhandari',
        },
      },
      {
        id: 1,
        uuid: '32ab7cbe-71a2-4ea7-a3b5-2c5ae864d727',
        redemptionStatus: 'REQUESTED',
        quantity: 20,
        transactionHash: null,
        approvedBy: null,
        approvedAt: '2026-05-22T06:32:07.269Z',
        inkindUuid: '6b90233a-1976-4826-b6cb-20a6a93c3fcb',
        vendorUuid: '8f8328c4-7164-4c75-ba8e-9a9f63e74fee',
        createdAt: '2026-05-22T06:32:07.269Z',
        updatedAt: '2026-05-22T06:32:07.269Z',
        inkind: {
          uuid: '6b90233a-1976-4826-b6cb-20a6a93c3fcb',
          name: 'GLASS',
          type: 'PRE_DEFINED',
        },
        vendor: {
          uuid: '8f8328c4-7164-4c75-ba8e-9a9f63e74fee',
          name: 'Mohit Rajbhandari',
        },
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

  const meta = {
    total: data?.meta?.total || 0,
    lastPage: data?.meta?.lastPage || 0,
    currentPage: pagination.page,
    perPage: pagination.perPage,
  };

  const columns = useInkindRedemptionColumn(id);

  const table = useReactTable({
    manualPagination: true,
    data: data?.data || [],
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
    },
    [],
  );

  const handleFilterChange = (value: string) => {
    const filterValue = value === 'ALL' ? '' : value;
    setFilters({ ...filters, status: filterValue });
    setPagination({ ...pagination, page: 1 });
  };

  return (
    <div className="rounded border bg-card p-4">
      <div className="flex justify-between space-x-2 mb-2">
        <SearchInput
          className="w-full flex-[4]"
          name="name"
          onSearch={(e) => handleSearch(e, 'name')}
          value={filters?.name || ''}
        />
        <SelectComponent
          name="Status"
          options={['ALL', 'APPROVED', 'REQUESTED']}
          onChange={(value) => handleFilterChange(value)}
          value={
            ['REQUESTED', 'APPROVED'].includes(filters?.status)
              ? filters.status
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
        total={data?.meta?.total || 0}
      />
    </div>
  );
};
