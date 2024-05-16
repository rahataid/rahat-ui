import { cn } from '@rahat-ui/shadcn/src';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import React from 'react';

const useAduitColumns = () => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toISOString().split('T')[0];
    const formattedTime = date.toISOString().split('T')[1].split('.')[0];
    return { formattedDate, formattedTime };
  };

  const getOperationBadge = (operation: string) => {
    let badgeVariant = '';
    switch (operation) {
      case 'CREATE':
        badgeVariant = 'bg-green-200 text-green-700';
        break;
      case 'UPDATE':
        badgeVariant = 'bg-orange-200 text-orange-700';
        break;
      default:
        badgeVariant = 'bg-red-200 text-red-700';
        break;
    }
    return badgeVariant;
  };

  const columns = [
    {
      accessorKey: 'user',
      header: 'User',
      cell: ({ row }) => (
        <div className="capitalize flex items-center gap-4">
          <Image
            className="rounded-full"
            src={'/profile.png'}
            height={30}
            width={30}
            alt="profile pic"
          />
          {row.original.user.name}
        </div>
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
        <div className="capitalize">
          <Badge
            className={getOperationBadge(row.original.operation)}
            variant="secondary"
          >
            {row.original.operation}
          </Badge>
          <br />
          <p className="text-muted-foreground text-sm mt-1">
            {' '}
            {row.original.fieldName}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ row }) => {
        const { formattedDate, formattedTime } = formatDate(
          row.original.timestamp,
        );
        return (
          <div>
            <div>{formattedDate}</div>
            <div className="text-muted-foreground">{formattedTime}</div>
          </div>
        );
      },
    },
  ];

  return columns;
};

export default useAduitColumns;
