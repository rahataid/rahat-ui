'use client';

import {
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import {
  useCommunitySettingList,
  useListAllTransports,
} from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { CircleEllipsisIcon, Settings2 } from 'lucide-react';
import CustomPagination from '../../components/customPagination';
import { useDebounce } from '../../utils/debounceHooks';
import { useSettingTableColumns } from './useSettingColumns';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';

export default function ListSetting() {
  const columns = useSettingTableColumns();

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [flag, setFlag] = useState('all');
  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    filters,
    setFilters,
    setPagination,
  } = usePagination();
  const debouncedFilters = useDebounce(filters, 500) as any;
  const { isLoading, data } = useCommunitySettingList({
    ...pagination,
    ...(debouncedFilters as any),
  });

  const table = useReactTable({
    manualPagination: true,
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility,
      rowSelection,
    },
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
    setPagination({
      ...pagination,
      page: 1,
    });
  };

  const handleSwitchChange = (value: string) => {
    const newFilters = { ...filters };

    if (value === 'private') {
      newFilters.private = 'true';
      newFilters.readOnly = '';
    } else if (value === 'public') {
      newFilters.private = 'false';
      newFilters.readOnly = '';
    } else if (value === 'all') {
      newFilters.private = '';
      newFilters.readOnly = '';
    } else if (value === 'read') {
      newFilters.readOnly = 'true';
      newFilters.private = '';
    }

    setFilters(newFilters);
    setPagination({
      ...pagination,
      page: 1,
    });
    setFlag(value);
  };

  return (
    <div className="w-full mt-1 p-1 bg-secondary">
      <div className="flex items-center mb-2">
        <Input
          placeholder="Search by name..."
          name="name"
          value={
            (table.getColumn('name')?.getFilterValue() as string) ??
            filters?.name
          }
          onChange={(event) => handleFilterChange(event)}
          className="rounded mr-2"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <Settings2 className="mr-2 h-4 w-5" />
              Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={flag}
              onValueChange={handleSwitchChange}
            >
              <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="private">
                Private
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="public">
                Public
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="read">
                ReadOnly
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded border bg-white">
        <ScrollArea className="h-[calc(100vh-190px)]">
          <TableComponent>
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
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center mt-4">
                        <div className="text-center">
                          <CircleEllipsisIcon className="animate-spin h-8 w-8 ml-4" />
                          <Label className="text-base">Loading ...</Label>
                        </div>
                      </div>
                    ) : (
                      'No result found'
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <CustomPagination
              meta={data?.response?.meta || { total: 0, currentPage: 0 }}
              handleNextPage={setNextPage}
              handlePrevPage={setPrevPage}
              handlePageSizeChange={setPerPage}
              currentPage={pagination.page}
              perPage={pagination.perPage}
              total={data?.response?.meta.total || 0}
            />
          </TableComponent>
        </ScrollArea>
      </div>
    </div>
  );
}
