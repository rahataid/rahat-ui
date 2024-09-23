import { usePagination, useProjectBeneficiaries } from '@rahat-ui/query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { useElkenyaBeneficiaryTableColumns } from './use.beneficiary.table.columns';
import React from 'react';
import ElkenyaTable from '../table.component';
import SearchInput from '../../components/search.input';
import AddButton from '../../components/add.btn';
import SelectComponent from '../select.component';

export default function BeneficiaryView() {
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

  const beneficiaries = useProjectBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: id,
    ...filters,
  });
  const meta = beneficiaries.data.response?.meta;

  const columns = useElkenyaBeneficiaryTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: beneficiaries?.data?.data || [
      { uuid: '123', name: 'A1' },
      { uuid: '456', name: 'B1' },
    ],
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
      <div className="p-4 bg-secondary h-[calc(100vh-65px)]">
        <div className="mb-4">
          <h1 className="font-semibold text-2xl mb-">Beneficiaries</h1>
          <p className="text-muted-foreground">
            Track all the beneficiaries reports here.
          </p>
        </div>
        <div className="rounded border bg-card p-4">
          <div className="flex justify-between space-x-2 mb-2">
            <SearchInput
              className="w-full"
              name="beneficiary"
              onSearch={() => {}}
            />
            <AddButton
              path={`/projects/el-kenya/${id}/beneficiary/add`}
              name="Beneficiary"
            />
          </div>
          <div className="flex justify-between gap-2 mb-4">
            <SelectComponent name="Voucher Type" />
            <SelectComponent name="Beneficiary Type" />
            <SelectComponent name="Eye Checkup Status" />
            <SelectComponent name="Glasses Status" />
            <SelectComponent name="Voucher Status" />
          </div>
          <ElkenyaTable table={table} />
        </div>
      </div>
    </>
  );
}
