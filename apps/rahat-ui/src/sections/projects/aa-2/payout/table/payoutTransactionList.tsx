import { usePagination, usePayouts } from '@rahat-ui/query';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useParams } from 'next/navigation';
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
import { UUID } from 'crypto';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
export default function PayoutTransactionList() {
  const { id: projectID } = useParams();

  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setFilters,
    filters,
  } = usePagination();

  const debounceSearch = useDebounce(filters, 500);
  const { data: payouts, isLoading } = usePayouts(projectID as UUID, {
    page: pagination.page,
    perPage: pagination.perPage,
    payoutType: debounceSearch.payoutType,
    groupName: debounceSearch.groupName,
  });

  const columns = usePayoutTransactionLogTableColumn();

  const tableData = React.useMemo(
    () =>
      payouts?.length
        ? payouts?.map((d: any) => ({
            uuid: d?.uuid,
            groupName: d?.beneficiaryGroupToken?.beneficiaryGroup?.name,
            totalBeneficiaries:
              d?.beneficiaryGroupToken?.beneficiaryGroup?._count?.beneficiaries,
            totalTokenAssigned: d?.beneficiaryGroupToken?.numberOfTokens,
            payoutType: d?.type,
            payoutMode:
              d?.type === 'FSP'
                ? d?.extras?.paymentProviderName || '-'
                : d?.mode,
            status: d?.status ?? 'N/A',
            timeStamp: d?.updatedAt,
          }))
        : [],
    [payouts],
  );

  const table = useReactTable({
    manualPagination: true,
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  console.log(payouts);
  const handleFilterChange = (event: any) => {
    if (event && event.target) {
      const { name, value } = event.target;
      const filterValue =
        value === 'ALL' ? '' : value === 'CVA' ? 'VENDOR' : value;

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
  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | null, key: string) => {
      const value = event?.target?.value ?? '';
      setFilters({ ...filters, [key]: value });
    },
    [filters],
  );
  return (
    <div className="p-4">
      <div className="flex flex-col space-y-0">
        <Back path={`/projects/aa/${projectID}/payout`} />

        <div className="mt-4 flex justify-between items-center">
          <div>
            <Heading
              title={`Payout List`}
              description="List of all the payouts available"
            />
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-gray-100 space-y-2 p-4">
        <div className="flex gap-2">
          <SearchInput
            className="w-full flex-[4]"
            name="group name"
            onSearch={(e) => handleSearch(e, 'groupName')}
            value={filters?.groupName || ''}
          />
          <SelectComponent
            name="Payout Type"
            options={['ALL', 'FSP', 'CVA']}
            onChange={(value) =>
              handleFilterChange({
                target: { name: 'payoutType', value },
              })
            }
            value={
              filters?.payoutType === 'VENDOR'
                ? 'CVA'
                : filters?.payoutType || ''
            }
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
