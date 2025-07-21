'use client';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/src/components/ui/table';
import { Table, flexRender } from '@tanstack/react-table';
import Pagination from 'apps/rahat-ui/src/components/pagination';
import { Payment } from './1-disbursement-plan';
import { initialStepData } from './fund-management-flow';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import BenBulkDisbursementAssignModel from './ben-bulk-assign-disbursement-amount.modal';

interface DisburseTableProps {
  table: Table<Payment>;
  handleStepDataChange: (e: any) => void;
  stepData: typeof initialStepData;
  bulkAssignDisbursement: any;
  pagination: any;
  setNextPage: () => void;
  setPrevPage: () => void;
  setPerPage: (value: string | number) => void;
  meta: any;
}

export function DisburseTable({
  table,
  handleStepDataChange,
  stepData,
  bulkAssignDisbursement,
  pagination,
  setNextPage,
  setPrevPage,
  setPerPage,
  meta,
}: DisburseTableProps) {
  const handleBulkAssign = async (amount: string) => {
    await bulkAssignDisbursement.mutateAsync({
      amount,
      beneficiaries: table
        .getSelectedRowModel()
        .rows.map((row) => row.original.walletAddress),
    });
  };

  return (
    <div className="mt-3 bg-secondary">
      <div className="flex justify-between items-center mb-2">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-full"
        />
        <BenBulkDisbursementAssignModel handleSubmit={handleBulkAssign} />
      </div>
      {table.getSelectedRowModel().rows.length ? (
        <div
          className="flex items-end justify-end mb-2"
          style={{ maxWidth: '300px' }}
        >
          <Input
            name="bulkInputAmount"
            placeholder="Enter disbursement amount."
            value={stepData?.bulkInputAmount ?? ''}
            onChange={(e) => handleStepDataChange(e)}
          />
          {/* <Button
            onClick={async () => {
              await bulkAssignDisbursement.mutateAsync({
                amount: stepData.bulkInputAmount,
                beneficiaries: table
                  .getSelectedRowModel()
                  .rows.map((row) => row.original.walletAddress),
              });
            }}
            variant="outline"
            disabled={
              !stepData.bulkInputAmount ||
              !table.getSelectedRowModel().rows.length ||
              bulkAssignDisbursement.isPending
            }
          >
            Bulk Assign
          </Button> */}
        </div>
      ) : null}
      <div className="rounded border bg-card">
        <TableComponent>
          <ScrollArea className="h-[calc(100vh-582px)]">
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ScrollArea>
          <CustomPagination
            currentPage={pagination.page}
            handleNextPage={setNextPage}
            handlePageSizeChange={setPerPage}
            handlePrevPage={setPrevPage}
            perPage={pagination.perPage}
            meta={meta || { total: 0, currentPage: 0 }}
          />
        </TableComponent>
      </div>
    </div>
  );
}
