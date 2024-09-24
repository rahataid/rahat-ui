import {
  useCHWList,
  usePagination,
  useProjectBeneficiaries,
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
import { useCambodiaChwTableColumns } from './use.chw.table.columns';
import SelectComponent from '../select.component';
import CambodiaTable from '../table.component';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { filter } from 'lodash';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Search } from 'lucide-react';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';

export default function CHWView() {
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
  const { data } = useCHWList({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: id,
    ...(debouncedSearch as any),
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
  const columns = useCambodiaChwTableColumns();
  const table = useReactTable({
    manualPagination: true,

    data: data?.data || [
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
          <h1 className="font-semibold text-2xl mb-">
            Community Health Worker
          </h1>
          <p className="text-muted-foreground">
            Track all the community health worker here.
          </p>
        </div>
        <div className="rounded border bg-card p-4">
          <div className="flex justify-between space-x-2 mb-2">
            <SearchInput
              name="koboUsername"
              className="w-full"
              value={
                (table.getColumn('koboUsername')?.getFilterValue() as string) ??
                filters?.koboUsername
              }
              onSearch={(event) => handleFilterChange(event)}
            />

            {/* <AddButton
              path={`/projects/el-kenya/${id}/beneficiary/add`}
              name="Beneficiary"
            /> */}
          </div>

          <CambodiaTable table={table} />
          <CustomPagination
            currentPage={pagination.page}
            handleNextPage={setNextPage}
            handlePrevPage={setPrevPage}
            handlePageSizeChange={setPerPage}
            meta={(data?.response?.meta as any) || { total: 0, currentPage: 0 }}
            perPage={pagination?.perPage}
            total={data?.response?.meta?.total || 0}
          />
        </div>
      </div>
    </>
  );
}
