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
import { Coins, Home, Search, Settings2, Users } from 'lucide-react';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

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
      <div className="p-4 bg-white ">
        <div className="mb-4">
          <h1 className="font-semibold text-2xl mb-">Health Workers</h1>
          <p className="text-muted-foreground">
            Track all the health workers here.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-7">
          <DataCard
            title="Home Visits"
            number="1,235"
            Icon={Home}
            className="rounded-lg border-solid "
          />
          <DataCard
            title="Sales Count"
            number="36,598"
            Icon={Coins}
            className="rounded-lg border-solid "
          />
          <DataCard
            title="Leads Provided"
            number="325"
            Icon={Users}
            className="rounded-lg border-solid"
          />
        </div>
        <div className="rounded-lg border bg-card p-4 ">
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <Settings2 className="mr-2 h-4 w-5" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <CambodiaTable table={table} tableHeight="h-[calc(100vh-460px)] " />
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