import { ColumnDef } from '@tanstack/react-table';

export const useElkenyaTransactionsTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'beneficiary',
      header: 'Wallet Address',
      cell: ({ row }) => <div>{row.getValue('beneficiary')}</div>,
    },
    {
      accessorKey: 'topic',
      header: 'Topic',
      cell: ({ row }) => <div>{row.getValue('topic')}</div>,
    },
    {
      accessorKey: 'txHash',
      header: 'TxHash',
      cell: ({ row }) => <div>{row.getValue('txHash')}</div>,
    },
    {
      accessorKey: 'timeStamp',
      header: 'Timestamp',
      cell: ({ row }) => <div>{row.getValue('timeStamp')}</div>,
    },
  ];
  return columns;
};
