'use client';

import {
  usePagination,
  useProjectBeneficiaries,
  useProjectSettingsStore,
} from '@rahat-ui/query';
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
import { ChevronDown, Settings2 } from 'lucide-react';

import * as React from 'react';

import { Button } from '@rahat-ui/shadcn/components/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
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
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { useProjectBeneficiaryTableColumns } from './use-table-column';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { useBulkAssignVoucher } from 'apps/rahat-ui/src/hooks/el/contracts/el-contracts';
import { useBoolean } from '../../../../hooks/use-boolean';
import TokenAssingnConfirm from './token.assign.confirm';
import TableLoader from '../../../../components/table.loader';
import { useRouter } from 'next/navigation';

// import { useBeneficiaryTransaction } from '../../hooks/el/subgraph/querycall';

export type Transaction = {
  name: string;
  beneficaryType: string;
  timeStamp: string;
  transactionHash: string;
  amount: string;
};

const benType = [
  {
    key: 'ALL',
    value: 'ALL',
  },
  {
    key: 'ENROLLED',
    value: 'ENROLLED',
  },
  {
    key: 'REFERRED',
    value: 'REFERRED',
  },
];

function BeneficiaryDetailTableView() {
  const tokenAssignModal = useBoolean();
  const route = useRouter();
  const id = useParams();
  // TODO: Refactor it
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const handleTokenAssignModal = () => {
    tokenAssignModal.onTrue();
  };

  const handleTokenAssignModalClose = () => {
    tokenAssignModal.onFalse();
  };

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const uuid = useParams().id as UUID;
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
  const assignVoucher = useBulkAssignVoucher();

  const projectBeneficiaries = useProjectBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'updatedAt',
    projectUUID: uuid,
    ...filters,
  });

  const contractAddress = useProjectSettingsStore(
    (state) => state.settings?.[uuid],
  );

  const columns = useProjectBeneficiaryTableColumns();

  const handleBenType = React.useCallback(
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
  // const assignToken =

  const selectedRowAddresses = Object.keys(selectedListItems);

  const handleBulkAssign = async () => {
    await assignVoucher.mutateAsync({
      addresses: selectedRowAddresses as `0x${string}`[],
      noOfTokens: 1,
      contractAddress: contractAddress.elproject.address,
    });
  };

  React.useEffect(() => {
    if (assignVoucher.isSuccess) {
      route.push(`/projects/el/${id}`);
    }
  }, []);

  return (
    <>
      <div className="p-2 bg-secondary">
        <div className="flex items-center mb-2">
          <Input
            placeholder="Filter name..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
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
              {selectedRowAddresses.length ? (
                <Button
                  disabled={assignVoucher.isPending}
                  className="h-10 ml-2"
                >
                  {selectedRowAddresses.length} - Beneficiary Selected
                  <ChevronDown strokeWidth={1.5} />
                </Button>
              ) : null}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleTokenAssignModal}>
                Assign Tokens To All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded border bg-card">
          <Table>
            <ScrollArea className="h-[calc(100vh-182px)]">
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
        meta={projectBeneficiaries.data?.response?.meta || {}}
        perPage={pagination.perPage}
      />
      <TokenAssingnConfirm
        tokens={selectedRowAddresses.length}
        open={tokenAssignModal.value}
        handleClose={handleTokenAssignModalClose}
        handleSubmit={handleBulkAssign}
      />
    </>
  );
}

export default React.memo(BeneficiaryDetailTableView);
