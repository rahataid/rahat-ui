'use client';

import { useState } from 'react';
import { Users, Plus, Info, Banknote, Calendar } from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
  flexRender,
} from '@tanstack/react-table';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/src/components/ui/table';
import {
  ClientSidePagination,
  Heading,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

interface Beneficiary {
  id: string;
  name: string;
  phoneNumber: string;
  walletAddress: string;
}

const columns: ColumnDef<Beneficiary>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
  {
    accessorKey: 'walletAddress',
    header: 'Wallet Address',
  },
];

export default function BeneficiaryGroupPage() {
  const [globalFilter, setGlobalFilter] = useState('');

  // Mock data - empty for now to show empty state
  const [data] = useState<Beneficiary[]>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const cardData = [
    {
      title: 'Total Beneficiaries',
      value: 0,
      label: 'Total Count',
      icon: <Users size={18} />,
      color: 'blue',
    },
    {
      title: 'Total Disbursed',
      value: '$0',
      label: 'Sum of amounts sent to group members',
      icon: <Banknote size={18} />,
      color: 'green',
    },
    {
      title: 'Last Updated',
      value: 'August 19, 2025, 1:38:14 PM',
      label: 'Date & Time',
      icon: <Calendar size={18} />,
      color: 'purple',
    },
  ];

  return (
    <div className="p-4 space-y-4 bg-gray-50">
      {/* Header */}
      <Heading
        title="Rumsan Beneficiary Group"
        description="Detailed view of the selected beneficiary group"
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {cardData?.map((card, index) => (
          <div
            key={`${index}-${card.title}`}
            className={`border rounded-sm p-4 space-y-4 bg-${card.color}-50  border-${card.color}-100 text-${card.color}-500`}
          >
            <div className="flex justify-between items-center">
              <p className="text-sm/6 font-medium">{card.title}</p>
              {card.icon}
            </div>
            <div className="space-y-1">
              <p className="text-lg/7 font-bold">{card.value}</p>
              <p className="text-sm/4">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-sm border p-4 space-y-4">
        {/* Search */}
        <SearchInput
          name="name"
          onSearch={(event) => setGlobalFilter(String(event.target.value))}
        />

        {/* Table */}
        <ScrollArea className="h-[calc(100vh-458px)]">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="font-semibold">
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
                    colSpan={columns.length}
                    className="h-96 text-center"
                  >
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="rounded-full bg-muted p-3">
                        <Info className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-medium">
                          No beneficiary added
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Beneficiaries will appear here once they are added to
                          this group
                        </p>
                      </div>
                      <Button className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Beneficiary
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        {/* Pagination */}
        <ClientSidePagination table={table} />
      </div>
    </div>
  );
}
