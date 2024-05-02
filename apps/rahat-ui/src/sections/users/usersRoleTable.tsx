'use client';

import * as React from 'react';
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
import { Trash2 } from 'lucide-react';
import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { useUserRoleList, useUserRolesRemove } from '@rumsan/react-query';
import { UUID } from 'crypto';
import { UserRole } from '@rumsan/sdk/types';
import DeleteConfirmModal from './confirm.delete.role';
import { useBoolean } from '../../hooks/use-boolean';

export function UsersRoleTable({
  uuid,
  isAdmin,
}: {
  uuid: UUID;
  isAdmin: boolean;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const removeUserRole = useUserRolesRemove();
  const { data } = useUserRoleList(uuid);

  const RoleDeleteModal = useBoolean();
  const [selectedRow, setSelectedRow] = React.useState<UserRole | null>(null);

  const handleRoleDeleteModalOpen = (row: UserRole) => {
    setSelectedRow(row);
    RoleDeleteModal.onTrue();
  };

  const handleRoleDeleteModalClose = () => {
    setSelectedRow(null);
    RoleDeleteModal.onFalse();
  };

  const handleRemoveRole = (data: any) => {
    if (isAdmin && selectedRow)
      removeUserRole.mutateAsync({ uuid: uuid, roles: [data?.name] });
  };

  const columns: ColumnDef<UserRole>[] = [
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
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Role',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('name')}</div>
      ),
    },

    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Trash2
            className="cursor-pointer"
            onClick={() => handleRoleDeleteModalOpen(row.original)}
            strokeWidth={1.6}
            size={16}
          />
        );
      },
    },
  ];

  const tableData = React.useMemo(() => {
    return data?.data;
  }, [data]);

  const table = useReactTable({
    data: tableData || [],
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

  return (
    <div className="w-full">
      <DeleteConfirmModal
        open={RoleDeleteModal.value}
        handleClose={handleRoleDeleteModalClose}
        handleSubmit={handleRemoveRole}
        data={selectedRow}
      />
      <div className="rounded border">
        <Table>
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
        </Table>
      </div>
    </div>
  );
}
