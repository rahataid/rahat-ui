'use client';
import {
  ColumnDef,
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
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import * as React from 'react';

import { useProjectAction } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import { Input } from '@rahat-ui/shadcn/components/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { MS_ACTIONS } from '@rahataid/sdk';
import { useParams, useRouter } from 'next/navigation';
import { useVendorTable } from './useVendorTable';

export type Transaction = {
  id: string;
  topic: string;
  beneficiary: number;
  voucherId: string;
  timestamp: string;
  txHash: string;
};

export default function VendorsList() {
  const router = useRouter();
  const uuid = useParams().id;

  const handleViewClick = (rowData: any) => {
    router.push(
      `/projects/el/${uuid}/vendors/${rowData.walletaddress}?phone=${rowData.phone}&&name=${rowData.name}&&walletAddress=${rowData.walletaddress} &&vendorId=${rowData.vendorId}`,
    );
  };

  const columns = useVendorTable({ handleViewClick });
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState([]);

  const getVendors = useProjectAction();

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const [perPage, setPerPage] = React.useState<number>(5);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const fetchVendors = async () => {
    const result = await getVendors.mutateAsync({
      uuid,
      data: {
        action: MS_ACTIONS.VENDOR.LIST_BY_PROJECT,
        payload: {
          page: currentPage,
          perPage,
        },
      },
    });

    const filteredData = result?.data.map((row: any) => {
      return {
        name: row.User.name,
        walletaddress: row.User.wallet,
        phone: row.User.phone,
        vendorId: row.User.uuid,
      };
    });
    setData(filteredData);
  };

  // const fetchBeneficiary = React.useCallback(() => {
  //   // const querRes = queryService.useProjectTransaction();

  //   const querRes = queryService.useBeneficiaryTransaction(walletAddress);

  //   querRes.then((res) => {
  //     const claimedAssigned = res?.claimAssigneds;
  //     const claimProcessed = res?.projectClaimProcesseds;
  //     const beneficiaryReferred = res?.beneficiaryReferreds;
  //     const beneficiaryAdded = res?.beneficiaryAddeds;
  //     const claimCreated = res?.claimCreateds;
  //     const tokenBudgetIncrease = res?.tokenBudgetIncreases;
  //     const data: any = [];

  //     claimedAssigned?.map((trans) => {
  //       data.push({
  //         beneficiary: trans.beneficiary,
  //         topic: trans.eventType,
  //         timestamp: formatDate(trans.blockTimestamp),
  //         txHash: trans.transactionHash,
  //         voucherId: trans.tokenAddress,
  //       });
  //       // const claimRes = queryService?.useClaimAssigned(trans.id);
  //     });
  //     claimProcessed?.map((trans) => {
  //       data.push({
  //         beneficiary: trans.beneficiary,
  //         topic: trans.eventType,
  //         timestamp: formatDate(trans.blockTimestamp),
  //         txHash: trans.transactionHash,
  //         voucherId: trans.token,
  //       });
  //     });
  //     beneficiaryReferred?.map((trans) => {
  //       data.push({
  //         beneficiary: trans.referrerBeneficiaries,
  //         topic: trans.eventType,
  //         timestamp: formatDate(trans.blockTimestamp),
  //         txHash: trans.transactionHash,
  //       });
  //     });

  //     claimCreated?.map((trans) => {
  //       data.push({
  //         beneficiary: trans.claimer,
  //         txHash: trans.transactionHash,
  //         timestamp: formatDate(trans.blockTimestamp),
  //         topic: trans?.eventType,
  //         voucherId: trans.token,
  //       });
  //     });

  //     beneficiaryAdded?.map((trans) => {
  //       data.push({
  //         topic: trans.eventType,
  //         timestamp: formatDate(trans.blockTimestamp),
  //         txHash: trans.transactionHash,
  //         beneficiary: trans.beneficiaryAddress,
  //       });
  //     });

  //     tokenBudgetIncrease?.map((trans) => {
  //       data.push({
  //         topic: trans.eventType,
  //         txHash: trans.transactionHash,
  //         timestamp: formatDate(trans.blockTimestamp),
  //         voucherId: trans?.tokenAddress,
  //       });
  //     });
  //     setData(data);
  //   });
  // }, [queryService]);

  React.useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="w-full h-full p-2 bg-secondary">
      <div className="flex items-center mb-2">
        <Input
          placeholder="Filter Vendors..."
          value={
            (table.getColumn('beneficiary')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('beneficiary')?.setFilterValue(event.target.value)
          }
          className="w-full"
        />
      </div>
      <div className="rounded  h-[calc(100vh-180px)] bg-card">
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ScrollArea>
        </Table>
      </div>
      <div className="sticky bottom-0 flex items-center justify-end space-x-4 px-4 py-1 border-t-2 bg-card">
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
      </div>
    </div>
  );
}
