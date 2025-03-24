'use client';
import {
  PROJECT_SETTINGS_KEYS,
  useGetDisbursementApprovals,
  useMultiSigDisburseToken,
  useProjectAction,
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
import Image from 'next/image';
import { useParams } from 'next/navigation';
import * as React from 'react';
import Swal from 'sweetalert2';
import { useWaitForTransactionReceipt } from 'wagmi';
import { config } from '../../../../../wagmi.config';
import { DataTablePagination } from '../transactions/dataTablePagination';
import { useApprovalTable } from './useApprovalTable';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';

// Define transaction steps
type TransactionStep =
  | 'idle'
  | 'initiating'
  | 'waiting'
  | 'updating'
  | 'success'
  | 'error';

// Props for the TransactionModal component
interface TransactionModalProps {
  transactionStep: TransactionStep;
  errorMessage: string | null;
  onClose: () => void;
}

// TransactionModal component to display transaction progress
function TransactionModal({
  transactionStep,
  errorMessage,
  onClose,
}: TransactionModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction Status</DialogTitle>
        </DialogHeader>
        <div>
          {transactionStep === 'initiating' && <p>Initiating transaction...</p>}
          {transactionStep === 'waiting' && <p>Waiting for confirmation...</p>}
          {transactionStep === 'updating' && <p>Updating status...</p>}
          {transactionStep === 'success' && (
            <p>Transaction executed successfully!</p>
          )}
          {transactionStep === 'error' && <p>Error: {errorMessage}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main ApprovalTable component
export function ApprovalTable({ disbursement }: { disbursement: any }) {
  console.log('data', disbursement);
  const { id } = useParams();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [txHash, setTxHash] = React.useState<string | undefined>(undefined);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [transactionStep, setTransactionStep] =
    React.useState<TransactionStep>('idle');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const columns = useApprovalTable();
  const { id: projectUUID, uuid } = useParams() as { id: UUID; uuid: UUID };

  // Fetch project settings
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );
  const safeWallet = useProjectSettingsStore(
    (state) => state?.settings?.[id]?.['SAFE_WALLET']?.address,
  );

  // Fetch disbursement approvals data
  const { data, isLoading, isFetching } = useGetDisbursementApprovals({
    disbursementUUID: uuid,
    projectUUID: projectUUID,
    page: 1,
    perPage: 10,
    transactionHash: disbursement?.transactionHash,
  });

  // Initialize project action and transaction hooks
  const projectAction = useProjectAction(['c2c', 'disburseToken']);
  const waitedReceiptData = useWaitForTransactionReceipt({
    hash: txHash,
    enabled: !!txHash,
  });

  const disburseMultiSig = useMultiSigDisburseToken({
    disbursementId: disbursement?.id,
    projectUUID,
    rahatTokenAddress: contractSettings?.rahattoken?.address,
    config: config,
  });

  // Set up the table using Tanstack React Table
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

  const approved = data?.approvals?.filter(
    (approval: any) => approval?.hasApproved,
  );

  // Handle multi-signature transaction execution
  const handleMigSigTransaction = async () => {
    setTransactionStep('initiating');
    setIsModalOpen(true); // Open the modal
    try {
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
    } catch (error) {
      setTransactionStep('error');
      setErrorMessage(error.message || 'An error occurred during initiation');
      setIsModalOpen(false); // Close the modal on error
    }
  };

  // Update transaction hash and step when transaction is successful
  React.useEffect(() => {
    if (disburseMultiSig.isSuccess) {
      setTxHash(disburseMultiSig.data);
      setTransactionStep('waiting');
    }
  }, [disburseMultiSig.isSuccess, disburseMultiSig.data]);

  // Track whether status has been updated to prevent infinite loops
  const hasUpdatedStatus = React.useRef(false);

  // Handle transaction receipt and update status
  React.useEffect(() => {
    if (waitedReceiptData.isSuccess && !hasUpdatedStatus.current) {
      setTransactionStep('updating');
      hasUpdatedStatus.current = true;
      projectAction
        .mutateAsync({
          uuid: projectUUID,
          data: {
            action: 'c2cProject.disbursement.update',
            payload: {
              id: disbursement?.id,
              status: 'COMPLETED',
            },
          },
        })
        .then(() => {
          setTransactionStep('success');
          hasUpdatedStatus.current = false;
          Swal.fire({
            title: 'Transaction Executed',
            text: 'The transaction has been executed successfully.',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          setTxHash(undefined); // Prevents infinite loop by clearing txHash
          setIsModalOpen(false); // Close the modal on success
        })
        .catch((error) => {
          setTransactionStep('error');
          setErrorMessage('Failed to update disbursement status');
          hasUpdatedStatus.current = false;
          setIsModalOpen(false); // Close the modal on error
        });
    }
  }, [waitedReceiptData.isSuccess, projectAction, projectUUID, disbursement]);

  return (
    <div className="w-full">
      {data?.isExecuted && (
        <div className="flex items-center justify-end px-4 py-2 border-b-2 bg-card">
          <div className="flex flex-col sm:flex-row items-center mr-4 justify-between space-y-2 sm:space-y-0 text-sm font-medium text-gray-500">
            <div className="flex items-center">
              <span className="mr-2">Approvals:</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                {approved?.length || 0}
              </span>
              <span className="mx-1">/</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                {data?.approvals?.length || 0}
              </span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">Required:</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                {data?.confirmationsRequired || 0}
              </span>
            </div>
          </div>
          <Button
            disabled={
              disburseMultiSig.isPending ||
              (approved?.length || 0) < (data?.confirmationsRequired || 0)
            }
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
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
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

      {isModalOpen && (
        <TransactionModal
          transactionStep={transactionStep}
          errorMessage={errorMessage}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
