import {
  useCHWList,
  usePagination,
  useProjectBeneficiaries,
  useVendorList,
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
import SearchInput from '../../components/search.input';
import AddButton from '../../components/add.btn';
// import { useCambodiaChwTableColumns } from './use.chw.table.columns';
import SelectComponent from '../select.component';
import CambodiaTable from '../table.component';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { filter } from 'lodash';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Search } from 'lucide-react';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import { useCambodiaVendorsTableColumns } from './use.vendors.table.columns';

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
    setPagination,
    resetSelectedListItems,
  } = usePagination();

  const debouncedSearch = useDebounce(filters, 500);

  const [refetch, setRefetch] = React.useState(false);

  const { data: vendors } = useVendorList(pagination, refetch);
  console.log(vendors);
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
  const columns = useCambodiaVendorsTableColumns();
  const table = useReactTable({
    manualPagination: true,

    data: [
      {
        id: 'a12f4a5d-4f36-4c73-8f9e-19b82a8b5403',
        name: 'Vision Center',
        phone: '9857023857',
        wallet: '0014xx...7555525',
        isVerified: 'Approved',
      },
      {
        id: 'b74c9f8e-2e5a-4b5f-9949-7042e8b3b089',
        name: 'Optical Hub',
        phone: '9123456789',
        wallet: '0012yy...7589634',
        isVerified: 'Not Approved',
      },
      {
        id: 'c85dfe64-995b-4c39-858b-d1e80db3e372',
        name: 'Eye Care Plus',
        phone: '9876543210',
        wallet: '0023zz...2345874',
        isVerified: 'Approved',
      },
      {
        id: 'd9f875bc-488b-4f67-8b8d-75a4d2f88d5d',
        name: 'Clear Vision Clinic',
        phone: '9234567890',
        wallet: '0056bb...9823415',
        isVerified: 'Not Approved',
      },
      {
        id: 'e73c3cb4-917a-4ef1-9dd4-930f2c5f8941',
        name: 'LensPro Center',
        phone: '9988776655',
        wallet: '0044cc...1234567',
        isVerified: 'Approved',
      },
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
      <div className="p-4">
        <div className="mb-4">
          <h1 className="font-semibold text-2xl">Vision Centers</h1>
          <p className="text-muted-foreground text-base">
            Track all the vision center reports here.
          </p>
        </div>
        <div className="rounded border bg-card p-4">
          <div className="flex justify-between space-x-2 mb-2">
            <SearchInput
              name="name"
              className="w-full"
              value={
                (table.getColumn('name')?.getFilterValue() as string) ??
                filters?.name
              }
              onSearch={(event) => handleFilterChange(event)}
            />
          </div>
          <CambodiaTable table={table} tableHeight="h-[calc(100vh-294px)]" />
        </div>
      </div>
      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        meta={(vendors?.response?.meta as any) || { total: 0, currentPage: 0 }}
        perPage={pagination?.perPage}
        total={vendors?.response?.meta?.total || 0}
      />
    </>
  );
}
