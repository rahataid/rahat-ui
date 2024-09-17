import { ColumnDef } from '@tanstack/react-table';

export const useElkenyaVendorsTransactionsTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'topic',
      header: 'Topic',
      cell: ({ row }) => <div>{row.getValue('topic')}</div>,
    },
    {
      accessorKey: 'hash',
      header: 'TxHash',
      cell: ({ row }) => <div>{row.getValue('hash')}</div>,
    },
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: ({ row }) => <div>{row.getValue('TimeStamp')}</div>,
    },
  ];
  return columns;
};
