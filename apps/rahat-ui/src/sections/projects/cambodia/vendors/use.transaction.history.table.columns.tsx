import { ColumnDef } from '@tanstack/react-table';

export const useTransactionHistoryTableColumns = () => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'topic',
      header: 'Topic',
      cell: ({ row }) => <div>{row?.original?.topic}</div>,
    },
    {
      accessorKey: 'beneficiary',
      header: 'Beneficiary',
      cell: ({ row }) => <div>{row?.original?.beneficiary}</div>,
    },
    {
      accessorKey: 'txHash',
      header: 'TxHash',
      cell: ({ row }) => <div>{row?.original?.txHash}</div>,
    },
    {
      accessorKey: 'timeStamp',
      header: 'Time Stamp',
      cell: ({ row }) => <div>{row?.original?.timeStamp}</div>,
    },
  ];
  return columns;
};
