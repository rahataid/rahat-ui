'use client';

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';
import * as React from 'react';

import { Button } from '@rahat-ui/shadcn/components/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import { Input } from '@rahat-ui/shadcn/components/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { CAMPAIGN_TYPES } from '@rahat-ui/types';
import { useCampaignStore, useListCampaign } from '@rumsan/communication-query';
import useTextTableColumn from './useTextTableColumn';
import { ICampaignItemApiResponse } from '@rumsan/communication/types';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { usePagination, useProjectList } from '@rahat-ui/query';

export default function TextTableView() {
  const columns = useTextTableColumn();
  const campaignStore = useCampaignStore();
  const projectsList = useProjectList({});

  const {
    pagination,
    filters,
    setFilters,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
  } = usePagination();
  const filterBenByProjectId = React.useCallback(
    (id: string) => {
      console.log(id);
      if (id !== 'ALL') {
        setFilters({ ...filters, projectId: id });
        return;
      }
      setFilters({ ...filters, projectId: undefined });
    },
    [filters, setFilters],
  );
  console.log(pagination, filters);

  const { data, isSuccess } = useListCampaign({
    ...pagination,
    ...filters,
  });

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const tableData = React.useMemo(() => {
    const result = Array.isArray(data?.data?.rows)
      ? data?.data?.rows.filter(
          (campaign: any) => campaign.type !== CAMPAIGN_TYPES.PHONE,
        )
      : [];

    campaignStore.setTotalTextCampaign(data?.response?.meta?.total || 0);
    return result as ICampaignItemApiResponse[];
  }, [isSuccess, data?.data]);

  const table = useReactTable({
    manualPagination: true,
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getRowId: (row) => row.uuid,
    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  return (
    <div className="p-2 bg-secondary">
      <div className="flex items-center mb-2">
        <Input
          placeholder="Filter campaigns..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="mr-3"
        />
        <Select onValueChange={filterBenByProjectId}>
          <SelectTrigger className="max-w-32">
            <SelectValue placeholder="Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={'ALL'}>ALL</SelectItem>

            {projectsList.data?.data.length &&
              projectsList.data.data.map((project) => {
                return (
                  <SelectItem key={project.uuid} value={project.uuid || ''}>
                    {project.name}
                  </SelectItem>
                );
              })}
          </SelectContent>
        </Select>

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
      <div className="rounded border bg-white">
        <Table>
          <ScrollArea className="h-table1">
            <TableHeader>
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ScrollArea>
        </Table>
      </div>
      <CustomPagination
        meta={data?.response?.meta || { total: 0, currentPage: 0 }}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        currentPage={pagination.page}
        perPage={pagination.perPage}
        total={data?.response?.meta?.lastPage || 0}
      />
    </div>
  );
}
