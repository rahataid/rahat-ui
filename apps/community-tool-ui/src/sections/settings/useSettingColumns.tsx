'use client';

import { ColumnDef } from '@tanstack/react-table';

interface SettingData {
  name: string;
  dataType: string;
  isPrivate: boolean;
  isReadOnly: boolean;
  requiredFields: [];
}
export const usesettingTableColumns = () => {
  const columns: ColumnDef<SettingData>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      header: 'DataType',
      accessorKey: 'dataType',
      cell: ({ row }) => <div>{row.getValue('dataType')}</div>,
    },
    {
      header: 'IsPrivate',
      accessorKey: 'isPrivate',
      cell: ({ row }) => <div>{row.original.isPrivate ? 'Yes' : 'No'}</div>,
    },
    {
      header: 'IsReadOnly',
      accessorKey: 'isReadOnly',
      cell: ({ row }) => <div>{row.original.isReadOnly ? 'Yes' : 'No'}</div>,
    },
    {
      header: 'RequiredFields',
      accessorKey: 'requiredFields',
      cell: ({ row }) => {
        return (
          <div>
            {row.original.requiredFields.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </div>
        );
      },
    },
  ];

  return columns;
};
