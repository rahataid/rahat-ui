import { usePagination } from '@rahat-ui/query';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import usePayoutTransactionLogTableColumn from './usePayoutTransactionLogTableColumn';

import {
  Back,
  CustomPagination,
  Heading,
  SearchInput,
} from 'apps/rahat-ui/src/common';

import PayoutTable from './payoutTable';
import SelectComponent from 'apps/rahat-ui/src/common/select.component';

export default function PayoutTransactionList() {
  const { id: projectID } = useParams();
  const searchParams = useSearchParams();

  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setFilters,
    filters,
  } = usePagination();

  const router = useRouter();

  const columns = usePayoutTransactionLogTableColumn();
  const isLoading = false;
  const table = useReactTable({
    manualPagination: true,
    data: [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleFilterChange = (event: any) => {
    if (event && event.target) {
      const { name, value } = event.target;
      const filterValue = value === 'ALL' ? '' : value;
      table.getColumn(name)?.setFilterValue(filterValue);
      setFilters({
        ...filters,
        [name]: filterValue,
      });
    }
    setPagination({
      ...pagination,
      page: 1,
    });
  };

  return (
    <div className="p-4">
      <div className="flex flex-col space-y-0">
        <Back path={`/projects/aa/${projectID}/payout`} />

        <div className="mt-4 flex justify-between items-center">
          <div>
            <Heading
              title={`Transaction Logs`}
              description="List of all the payout transaction logs"
            />
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-gray-100 space-y-2 p-4">
        <div className="flex gap-2">
          <SearchInput
            name="groupName"
            className="w-full flex-[4]"
            value={
              (table.getColumn('groupName')?.getFilterValue() as string) ??
              filters?.groupName
            }
            onSearch={(event) => handleFilterChange(event)}
          />
          <SelectComponent
            name="Status"
            options={[
              'ALL',
              'NOT_STARTED',
              'WORK_IN_PROGRESS',
              'COMPLETED',
              'DELAYED',
            ]}
            onChange={(value) =>
              handleFilterChange({
                target: { name: 'status', value },
              })
            }
            value={filters?.status || ''}
            className="flex-[1]"
          />
        </div>
        <PayoutTable table={table} loading={isLoading} />
        <CustomPagination
          meta={{
            total: 0,
            currentPage: 0,
            lastPage: 0,
            perPage: 0,
            next: null,
            prev: null,
          }}
          handleNextPage={setNextPage}
          handlePrevPage={setPrevPage}
          handlePageSizeChange={setPerPage}
          currentPage={pagination.page}
          perPage={pagination.perPage}
          total={0}
        />
      </div>
    </div>
  );
}
