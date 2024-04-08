'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import { Eye } from 'lucide-react';
import { FieldDefinition } from '@rahataid/community-tool-sdk/fieldDefinitions';

export const useFieldDefinitionsTableColumns = () => {
  const columns: ColumnDef<FieldDefinition>[] = [
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
          disabled={!row.getCanSelect()}
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
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'fieldType',
      header: 'Field Type',
      cell: ({ row }) => <div>{row.getValue('fieldType')}</div>,
    },
    {
      accessorKey: 'isActive',
      header: 'isActive',
      cell: ({ row }) => (
        <div>{row.getValue('isActive') ? 'True' : 'False'}</div>
      ),
    },
    {
      accessorKey: 'fieldPopulate',
      header: 'Field Populate',
      cell: ({ row }) => {
        const fieldPopulate =
          row?.original?.fieldPopulate &&
          row?.original?.fieldPopulate?.length > 0
            ? Object.values(row.original.fieldPopulate)
            : [];

        return (
          <div>
            {fieldPopulate?.map(
              (field: any, index: number) =>
                field && <li key={index}>{field}</li>,
            )}
          </div>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: () => {
        return (
          <Eye
            size={20}
            strokeWidth={1.5}
            className="cursor-pointer hover:text-primary"
          />
        );
      },
    },
  ];

  return columns;
};
