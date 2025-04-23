'use client';
import { usePagination } from '@rahat-ui/query';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';

import {
  Back,
  CustomPagination,
  DataCard,
  Heading,
  SearchInput,
} from 'apps/rahat-ui/src/common';

import SelectComponent from 'apps/rahat-ui/src/common/select.component';
import useBeneficiaryGroupDetailsLogColumns from './useBeneficiaryGroupDetailsLogColumns';
import BeneficiariesGroupTable from './beneficiariesGroupTable';
import data from './dummy.json';
import { Ticket, Users } from 'lucide-react';
export default function BeneficiaryGroupTransactionDetailsList() {
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

  const columns = useBeneficiaryGroupDetailsLogColumns();
  const isLoading = false;
  const table = useReactTable({
    manualPagination: true,
    data: data || [],
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

  const payoutStats = [
    {
      label: 'Total Beneficiaries',
      value: '23000',
      icon: Users,
    },
    {
      label: 'Total Tokens',
      value: '10000',
      icon: Ticket,
    },
  ];
  return (
    <div className="p-4">
      <div className="flex flex-col space-y-0">
        <Back path={`/projects/aa/${projectID}/payout/list`} />

        <div className="mt-4 flex justify-between items-center">
          <div>
            <Heading
              title={`Group Name`}
              description="List of all the payout transaction logs of selected group"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {payoutStats?.map((item) => (
            <DataCard
              key={item.label}
              title={item.label}
              Icon={item.icon}
              number={item.value}
              className="rounded-sm h-24"
            />
          ))}
          <DataCard
            title="Payout Mode"
            Icon={Ticket}
            smallNumber="Offline"
            className="rounded-sm h-24"
          />
        </div>
      </div>

      <div className="rounded-sm border border-gray-100 space-y-2 p-4 mt-2">
        <div className="flex gap-2">
          <SearchInput
            name="walletAddress"
            className="w-full flex-[4]"
            value={
              (table.getColumn('walletAddress')?.getFilterValue() as string) ??
              filters?.walletAddress
            }
            onSearch={(event) => handleFilterChange(event)}
          />
          <SelectComponent
            name="Status"
            options={['ALL', 'COMPLETED', 'PENDING', 'REJECTED']}
            onChange={(value) =>
              handleFilterChange({
                target: { name: 'status', value },
              })
            }
            value={filters?.status || ''}
            className="flex-[1]"
          />
        </div>
        <BeneficiariesGroupTable table={table} loading={isLoading} />
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
