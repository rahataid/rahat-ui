'use client';

import { useState } from 'react';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { Payment } from './disburse-table';
import { Pencil, Check } from 'lucide-react'; // Importing Check icon from lucide-react
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';

export const useDibsursementList1Columns = (
  rowData: Payment[],
  setRowData: (data: Payment[]) => void,
) => {
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>('');

  const columns: ColumnDef<Payment>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        const isEditing = editRowId === row.original.walletAddress;
        const amount = parseFloat(row.getValue('amount'));

        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount);

        return (
          <div className="flex items-center">
            {isEditing ? (
              <div className="flex items-center">
                <Input
                  type="text"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="border border-gray-300 p-1 rounded"
                  autoFocus
                />
                <Check
                  className="w-4 h-4 ml-2 cursor-pointer"
                  onClick={() => {
                    const updatedRowData = rowData.map((r) =>
                      r.walletAddress === row.original.walletAddress
                        ? { ...r, amount: editAmount }
                        : r,
                    );
                    setRowData(updatedRowData);
                    setEditRowId(null);
                  }}
                />
              </div>
            ) : (
              <>
                <div>{formatted}</div>
                <Pencil
                  className="w-4 h-4 ml-2 cursor-pointer"
                  onClick={() => {
                    setEditRowId(row.original.walletAddress);
                    setEditAmount(row.getValue('amount'));
                  }}
                />
              </>
            )}
          </div>
        );
      },
    },
  ];
  return columns;
};
