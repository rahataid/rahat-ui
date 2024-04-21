'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { FieldDefinition } from '@rahataid/community-tool-sdk/fieldDefinitions';
import { humanizeString } from '../../utils';

export const useFieldDefinitionsTableColumns = () => {
  const columns: ColumnDef<FieldDefinition>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{humanizeString(row.getValue('name'))}</div>,
    },
    {
      accessorKey: 'fieldType',
      header: 'Field Type',
      cell: ({ row }) => <div>{row.getValue('fieldType')}</div>,
    },
    {
      accessorKey: 'isActive',
      header: 'Is Active',
      cell: ({ row }) => <div>{row.getValue('isActive') ? 'Yes' : 'No'}</div>,
    },
    // {
    //   accessorKey: 'isTargeting',
    //   header: 'isTargeting',
    //   cell: ({ row }) => (
    //     <div>{row.getValue('isTargeting') ? 'True' : 'False'}</div>
    //   ),
    // },
    {
      id: 'actions',
      enableHiding: false,
      header: 'Actions',
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
