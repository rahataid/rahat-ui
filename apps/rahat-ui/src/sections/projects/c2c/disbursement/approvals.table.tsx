'use client';
import {
  PROJECT_SETTINGS_KEYS,
  useGetDisbursementApprovals,
  useMultiSigDisburseToken,
  useProjectSettingsStore,
} from '@rahat-ui/query';
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
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { parseEther, parseUnits } from 'viem';
import { useApprovalTable } from './useApprovalTable';
import Image from 'next/image';
import { DataTablePagination } from '../transactions/dataTablePagination';

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
  const columns = useApprovalTable();
  const { id: projectUUID, uuid } = useParams() as {
    id: UUID;
    uuid: UUID;
  };
  const { data, isLoading, isFetching, isError } = useGetDisbursementApprovals({
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

  const disburseMultiSig = useMultiSigDisburseToken({
    disbursementId: disbursement?.id,
    projectUUID,
    rahatTokenAddress: contractSettings?.rahattoken?.address,
  });

  const handleMigSigTransaction = async () => {
    const amountString = disbursement?.DisbursementBeneficiary[0]?.amount
      ? disbursement?.DisbursementBeneficiary[0]?.amount.toString()
      : '0';

    await disburseMultiSig.mutateAsync({
      amount: amountString,
      beneficiaryAddresses: disbursement?.DisbursementBeneficiary?.map(
        (d: any) => d.beneficiaryWalletAddress,
      ) as `0x${string}`[],
      rahatTokenAddress: contractSettings?.rahattoken?.address,
      safeAddress: safeWallet,
      c2cProjectAddress: contractSettings?.c2cproject?.address,
    });
  };

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
      <div className="rounded h-[calc(100vh-360px)] bg-card">
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
              {isLoading || isFetching ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex items-center justify-center space-x-2 h-full">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.13s]"></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
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
                    <div className="w-full h-[calc(100vh-140px)]">
                      <div className="flex flex-col items-center justify-center">
                        <Image
                          src="/noData.png"
                          height={250}
                          width={250}
                          alt="no data"
                        />
                        <p className="text-medium text-base mb-1">
                          No Data Available
                        </p>
                        <p className="text-sm mb-4 text-gray-500">
                          There are no approvals to display at the moment.
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ScrollArea>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
