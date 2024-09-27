import { usePagination, useProjectBeneficiaries } from '@rahat-ui/query';
import {
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { useElkenyaVendorsTableColumns } from './columns/use.vendors.table.columns';
import React from 'react';
import ElkenyaTable from '../table.component';
import SearchInput from '../../components/search.input';

export default function VendorsView() {
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

  const columns = useElkenyaVendorsTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: [
      { phone: '123', name: 'A1' },
      { phone: '456', name: 'B1' },
    ],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });
  return (
    <>
      <div className="p-4 bg-secondary h-[calc(100vh-65px)]">
        <div className="mb-4">
          <h1 className="font-semibold text-2xl mb-">Vendors</h1>
          <p className="text-muted-foreground">
            Track all the vendor reports here
          </p>
        </div>
        <div className="rounded border bg-card p-4">
          <div className="flex justify-between space-x-2 mb-2">
            <SearchInput
              className="w-full"
              name=""
              onSearch={() => { }}
            />
          </div>
          <ElkenyaTable table={table} />
        </div>
      </div>
    </>
  );
}
