'use client';

import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  type ColumnDef,
} from '@tanstack/react-table';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { Copy } from 'lucide-react';
import { ClientSidePagination, DemoTable } from 'apps/rahat-ui/src/common';

export type Beneficiary = {
  id: string;
  name: string;
  phoneNumber: string;
  walletAddress: string;
};

interface BeneficiaryTableProps {
  data: Beneficiary[];
  selectedBeneficiaries: string[];
  onSelectionChange: (selected: string[]) => void;
}

export function BeneficiaryTable({
  data,
  selectedBeneficiaries,
  onSelectionChange,
}: BeneficiaryTableProps) {
  const [pageSize, setPageSize] = useState(10);

  const handleRowSelection = (beneficiaryId: string, isSelected: boolean) => {
    if (isSelected) {
      onSelectionChange([...selectedBeneficiaries, beneficiaryId]);
    } else {
      onSelectionChange(
        selectedBeneficiaries.filter((id) => id !== beneficiaryId),
      );
    }
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      onSelectionChange(data.map((beneficiary) => beneficiary.id));
    } else {
      onSelectionChange([]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const columns: ColumnDef<Beneficiary>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            selectedBeneficiaries.length === data.length && data.length > 0
          }
          onCheckedChange={(value) => handleSelectAll(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedBeneficiaries.includes(row.original.id)}
          onCheckedChange={(value) =>
            handleRowSelection(row.original.id, !!value)
          }
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
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Phone Number',
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.getValue('phoneNumber')}
        </div>
      ),
    },
    {
      accessorKey: 'walletAddress',
      header: 'Wallet Address',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground font-mono text-sm">
            {row.getValue('walletAddress')}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(row.getValue('walletAddress'))}
            className="h-6 w-6 p-0"
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return (
    <div className="space-y-4">
      <DemoTable table={table} tableHeight="h-[calc(100vh-530px)]" />
      <ClientSidePagination table={table} />
    </div>
  );
}
