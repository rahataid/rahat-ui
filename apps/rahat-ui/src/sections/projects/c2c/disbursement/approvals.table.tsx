'use client';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/src/components/ui/table';
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
import * as React from 'react';
import { useApprovalTable } from './useApprovalTable';
import {
  PROJECT_SETTINGS_KEYS,
  useDisburseTokenUsingMultisig,
  useGetDisbursementApprovals,
  useMultiSigDisburseToken,
  useProject,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';

export function ApprovalTable({ disbursement }: { disbursement: any }) {
  const { id } = useParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );
  const safeWallet = useProjectSettingsStore(
    (state) => state?.settings?.[id]?.['SAFE_WALLET']?.address,
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  // const [data, setData] = React.useState([]);
  const columns = useApprovalTable();
  const { id: projectUUID, uuid } = useParams() as {
    id: UUID;
    uuid: UUID;
  };
  const { data, isLoading } = useGetDisbursementApprovals({
    disbursementUUID: uuid,
    projectUUID: projectUUID,
    page: 1,
    perPage: 10,
    transactionHash: disbursement?.transactionHash,
  });
  console.log(disbursement);
  const table = useReactTable({
    data: data?.approvals || [],
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

  const disburseMultiSig = useMultiSigDisburseToken();

  const handleMigSigTransaction = async () => {
    await disburseMultiSig.mutateAsync({
      amount: disbursement?.DisbursementBeneficiary[0]?.amount,
      beneficiaryAddresses: disbursement?.DisbursementBeneficiary?.map(
        (d: any) => d.beneficiaryWalletAddress,
      ) as `0x${string}`[],
      rahatTokenAddress: contractSettings?.rahattoken?.address,
      safeAddress: safeWallet,
      c2cProjectAddress: contractSettings?.c2cproject?.address,
    });
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between px-4 py-2 border-b-2 bg-card">
          Loading...
        </div>
      </div>
    );
  }
  return (
    <div className="w-full">
      {data?.isExecuted && (
        <div className="flex items-center justify-end px-4 py-2 border-b-2 bg-card">
          <Button
            disabled={disburseMultiSig.isPending}
            variant="outline"
            size="sm"
            onClick={handleMigSigTransaction}
          >
            Execute Transaction
          </Button>
        </div>
      )}
      <div className="rounded h-[calc(100vh-320px)] bg-card">
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
