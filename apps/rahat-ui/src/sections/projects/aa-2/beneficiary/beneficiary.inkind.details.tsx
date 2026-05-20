import { DemoTable } from 'apps/rahat-ui/src/common';
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
} from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/components/badge';

interface InKindItem {
  inkindName: string;
  availableAmount: number;
  assignedAmount?: number;
  inkindType: string;
  redeemedAmount: number;
  status: string;
}

const InkindDetails = ({
  filteredInkinds,
}: {
  filteredInkinds: InKindItem[];
}) => {
  const columns: ColumnDef<InKindItem>[] = [
    {
      header: 'Items',
      accessorKey: 'inkindName',
    },
    {
      header: 'Type',
      accessorKey: 'inkindType',
      cell: ({ row }) => {
        const type = row.original.inkindType.replace('_', ' ');
        return <div className="capitalize text-sm">{type}</div>;
      },
    },
    {
      header: 'Assigned',
      accessorKey: 'assignedAmount',
      cell: ({ row }) => {
        const assigned = row.original.assignedAmount ?? '-';
        return <>{assigned}</>;
      },
    },
    {
      header: 'Redeemed',
      accessorKey: 'redeemedAmount',
    },
    {
      header: 'Available',
      accessorKey: 'availableAmount',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge className="text-xs w-full">
            {status === 'REDEEMED' ? 'Redeemed' : ' Not Redeemed'}
          </Badge>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredInkinds,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <h3 className="text-md font-semibold mb-3">In-kind Benefits</h3>
      <DemoTable table={table} tableHeight="h-[calc(100vh-600px)]" />
    </>
  );
};

export default InkindDetails;
