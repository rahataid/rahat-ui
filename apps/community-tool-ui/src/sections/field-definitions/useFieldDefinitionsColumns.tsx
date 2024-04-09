'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { FieldDefinition } from '@rahataid/community-tool-sdk/fieldDefinitions';

export const useFieldDefinitionsTableColumns = () => {
  const columns: ColumnDef<FieldDefinition>[] = [
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
