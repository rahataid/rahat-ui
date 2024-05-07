'use client';

import * as React from 'react';
import { usePagination, useProjectBeneficiaries } from '@rahat-ui/query';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { useProjectBeneficiaryTableColumns } from './use-table-column';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

import { Button } from '@rahat-ui/shadcn/components/button';
import { ChevronDown, Settings2 } from 'lucide-react';
import { assign, filter } from 'lodash';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';

import { benType } from '../../el/beneficiary/beneficiary.table';

const BeneficiaryDetailTableView = () => {
  const tokenAssignModal = useBoolean();
  const uuid = useParams().id as UUID;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
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
  const selectedRowAddresses = Object.keys(selectedListItems);
  const columns = useProjectBeneficiaryTableColumns();
  const projectBeneficiaries = useProjectBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'updatedAt',
    projectUUID: uuid,
    ...filters,
  });
  const table = useReactTable({
    manualPagination: true,
    data: projectBeneficiaries?.data?.data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (row) => row.wallet,
    onRowSelectionChange: setSelectedListItems,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });
  const handleBenType = React.useCallback(
    (type: string) => {
      resetSelectedListItems();
      if (type === 'ALL') {
        setFilters({ ...filters, status: undefined });
        return;
        setFilters({ ...filters, status: type });
      }
    },
    [filters, setFilters],
  );
  return (
    <>
      <div className="p-2 bg-secondary">
        <div className="flex items-center mb-2">
          <Input
            placeholder="Filter name..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => {
              table.getColumn('name')?.setFilterValue(event.target.value);
            }}
            className="max-w-sm rounded mr-2"
          />
          <div className="max-w-sm rounded mr-2">
            <Select
              onValueChange={handleBenType}
              defaultValue={filters?.status || 'ALL'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Beneficiary Type" />
              </SelectTrigger>
              <SelectContent>
                {benType.map((item) => {
                  return (
                    <SelectItem key={item.value} value={item.value}>
                      {item.key}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {selectedRowAddresses.length > 0 ? (
                <Button disabled className='"h-10 ml-2'>
                  {selectedRowAddresses.length} - Beneficiary Selected
                  <ChevronDown strokeWidth={1.5} />
                </Button>
              ) : null}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end"></DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded border bg-card">
          <Table>
            <ScrollArea className="h-[cal(100vh-182px)]">
              <TableHeader className="bg-card sticky top-0">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {projectBeneficiaries.isFetching ? (
                        <TableLoader />
                      ) : (
                        'No data available.'
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </ScrollArea>
          </Table>
        </div>
      </div>
      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePageSizeChange={setPerPage}
        handlePrevPage={setPrevPage}
        meta={projectBeneficiaries?.data?.response?.meta || {}}
        perPage={pagination.perPage}
      />
    </>
  );
};

export default BeneficiaryDetailTableView;
