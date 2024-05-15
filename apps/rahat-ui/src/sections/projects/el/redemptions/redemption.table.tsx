'use client';
import { usePagination } from '@rahat-ui/query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
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
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import * as React from 'react';

import { useProjectAction, useUpdateElRedemption } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Input } from '@rahat-ui/shadcn/components/input';
import {
  Select,
  SelectContent,
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { ChevronDown } from 'lucide-react';

import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import { useParams, useRouter } from 'next/navigation';
import { useTableColumns } from './useTableColumns';

export type Redemption = {
  id: string;
  topic: string;
  beneficiary: number;
  voucherId: string;
  timestamp: string;
  txHash: string;
};

export const redType = [
  {
    key: 'ALL',
    value: 'ALL',
  },
  {
    key: 'REQUESTED',
    value: 'REQUESTED',
  },
  {
    key: 'APPROVED',
    value: 'APPROVED',
  },
];

export default function RedemptionTable({}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const projectModal = useBoolean();

  const [selectedRow, setSelectedRow] = React.useState(null);

  const handleAssignModalClick = (row: any) => {
    setSelectedRow(row);
    projectModal.onTrue();
  };

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

  const columns = useTableColumns(handleAssignModalClick);

  // const [perPage, setPerPage] = React.useState<number>(10);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState([]);
  const [meta, setMeta] = React.useState();

  const uuid = useParams().id;
  const id = useParams();
  const route = useRouter();

  const handleRedType = React.useCallback(
    (type: string) => {
      resetSelectedListItems();
      if (type === 'ALL') {
        setFilters({ ...filters, status: undefined });
        return;
      }
      setFilters({ ...filters, status: type });
    },
    [filters, setFilters],
  );

  const table = useReactTable({
    manualPagination: true,
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getRowId: (row) => row.uuid,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  const getRedemption = useProjectAction();
  const updateRedemption = useUpdateElRedemption();

  const selectedRowAddresses = Object.keys(selectedListItems);
  const handleTokenAssignModal = () => {
    projectModal.onTrue();
  };

  const getRedemptionList = async () => {
    const result = await getRedemption.mutateAsync({
      uuid,
      data: {
        action: 'elProject.listRedemption',
        payload: {
          page: pagination.page,
          perPage: pagination.perPage,
          ...filters,
        },
      },
    });

    setMeta(result?.httpReponse?.data?.meta);

    const filterData = result?.data.map((row: any) => {
      return {
        name: row.Vendor.name,
        walletAddress: row.Vendor.walletAddress,
        tokenAmount: row.voucherNumber,
        status: row.status,
        uuid: row.uuid,
        name: row.Vendor.name,
        voucherType: row.voucherType,
      };
    });
    setData(filterData);
  };

  React.useEffect(() => {
    getRedemptionList();
  }, [pagination.page, pagination.perPage, filters]);

  const handleApprove = async () => {
    await updateRedemption.mutateAsync({
      projectUUID: uuid,
      redemptionUUID: selectedRowAddresses,
    });
    getRedemptionList();
    setSelectedListItems([]);
    projectModal.onFalse();
  };

  React.useEffect(() => {
    if (updateRedemption.isSuccess) {
      route.push(`/projects/el/${id}/redemptions`);
    }
  }, []);

  React.useEffect(() => {
    getRedemptionList();
  }, []);

  return (
    <>
      <div className="w-full h-full p-2 bg-secondary">
        <div className="flex items-center mb-2">
          <Input
            placeholder="Filter Redemptions..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="max-w-sm rounded mr-2"
          />
          <div className="max-w-sm rounded mr-2">
            <Select
              onValueChange={handleRedType}
              // defaultValue={filters?.status || 'ALL'}
            >
              <SelectTrigger>
                <SelectValue placeholder="REDEMPTION TYPE" />
              </SelectTrigger>
              <SelectContent>
                {redType.map((item) => {
                  return (
                    <SelectItem key={item.key} value={item.value}>
                      {item.key}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {selectedRowAddresses.length ? (
                <Button disabled={false} className="h-10 ml-2">
                  {selectedRowAddresses.length} - Items Selected
                  <ChevronDown strokeWidth={1.5} />
                </Button>
              ) : null}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleTokenAssignModal}>
                Approve Redemption
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="rounded border h-[calc(100vh-180px)] bg-card">
          <Table>
            <ScrollArea className="h-table1">
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
                      {getRedemption.isPending ? (
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
        <CustomPagination
          currentPage={pagination.page}
          handleNextPage={setNextPage}
          // handlePageSizeChange={setPerPage}
          handlePrevPage={setPrevPage}
          meta={meta || {}}
          perPage={pagination.perPage}
        />
        {/* <div className="sticky bottom-0 flex items-center justify-end space-x-4 px-4 py-1 border-t-2 bg-card">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div> */}
      </div>

      <Dialog open={projectModal.value} onOpenChange={projectModal.onToggle}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Redemption</DialogTitle>
            <DialogDescription>
              <p className="text-orange-500">
                Are you sure you want to approve the redemption?
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Close
              </Button>
            </DialogClose>
            <Button
              onClick={handleApprove}
              type="button"
              variant="ghost"
              className="text-primary"
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
