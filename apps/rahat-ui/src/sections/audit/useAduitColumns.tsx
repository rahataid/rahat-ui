import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import React from 'react';

const useAduitColumns = () => {
  const columns = [
    {
      accessorKey: 'image',
      header: 'Image',
      cell: ({ row }) => (
        <div className="capitalize">
          <Image
            className="rounded-lg"
            src={'/profile.png'}
            height={24}
            width={24}
            alt="profile pic"
          />
        </div>
      ),
    },
    {
      accessorKey: 'user.name',
      header: 'User',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('user.name')}</div>
      ),
    },
    {
      accessorKey: 'tableName',
      header: 'Table Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('tableName')}</div>
      ),
    },
    {
      accessorKey: 'operation',
      header: 'Operation',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('operation')}</div>
      ),
    },
    {
      accessorKey: 'fieldName',
      header: 'Field Name',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('fieldName')}</div>
      ),
    },
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('timestamp')}</div>
      ),
    },
  ];

  return columns;
};

export default useAduitColumns;
