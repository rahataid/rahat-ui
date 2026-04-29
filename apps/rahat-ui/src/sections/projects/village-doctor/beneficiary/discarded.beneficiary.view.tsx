'use client';
import {
  useCambodiaDiscardedBeneficiaries,
  usePagination,
} from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import React from 'react';
import HeaderWithBack from '../../components/header.with.back';
import SearchInput from '../../components/search.input';
import SelectComponent from '../select.component';
import CambodiaTable from '../table.component';
import {
  useCambodiaBeneficiaryTableColumns,
  useDiscardedCambodiaBeneficiaryTableColumns,
} from './use.beneficiary.table.columns';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';

export default function DiscardedBeneficiaryView() {
  const { id } = useParams() as { id: UUID };
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const {
    pagination,
    filters,
    setFilters,
    setNextPage,
    setPrevPage,
    setPerPage,
    selectedListItems,
    setSelectedListItems,
    resetSelectedListItems,
  } = usePagination();

  const debouncedSearch = useDebounce(filters, 500);
  const { data, isLoading } = useCambodiaDiscardedBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: id,
    ...debouncedSearch,
  });

  const handleFilterChange = (event: any) => {
    if (event && event.target) {
      const { name, value } = event.target;
      table.getColumn(name)?.setFilterValue(value);
      setFilters({
        ...filters,
        [name]: value,
      });
    }
  };
  const columns = useDiscardedCambodiaBeneficiaryTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId(originalRow) {
      return originalRow.walletAddress;
    },

    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });
  return (
    <>
      <div className="p-4 bg-white ">
        <div className="flex justify-between items-center mb-4">
          <HeaderWithBack
            title="Discarded Beneficiaries"
            subtitle="Here is the list of all discarded beneficiaries"
            path={`/projects/el-cambodia/${id}/beneficiary`}
          />
        </div>

        <div className="rounded-lg border bg-card p-4 ">
          <div className="flex justify-between space-x-2 mb-2">
            <SearchInput
              name="name"
              className="w-[100%]"
              value={
                (table.getColumn('name')?.getFilterValue() as string) ??
                filters?.name
              }
              onSearch={(event) => handleFilterChange(event)}
            />
          </div>
          <CambodiaTable table={table} loading={isLoading} />
        </div>
      </div>
      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        meta={(data?.response?.meta as any) || { total: 0, currentPage: 0 }}
        perPage={pagination?.perPage}
        total={data?.response?.meta?.total || 0}
      />
    </>
  );
}
