import { useInkindDetails } from '@rahat-ui/query';
import { DemoTable } from 'apps/rahat-ui/src/common';
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { Badge } from '@rahat-ui/shadcn/components/badge';

interface InKindItem {
  inkindName: string;
  availableAmount: number;
  assignedAmount?: number;
  inkindType: string;
  redeemedAmount: number;
  status: string;
}
const InkindDetails = () => {
  const params = useParams();
  const projectId = params.id as UUID;
  const beneficiaryId = params.uuid as UUID;

  const { data: inKindData, isPending: isInKindPending } = useInkindDetails({
    projectUUID: projectId,
    beneficiaryUUID: beneficiaryId,
  });

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
    data: inKindData?.inkinds || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <h3 className="text-md font-semibold mb-3">In-kind Benefits</h3>
      <DemoTable
        table={table}
        loading={isInKindPending}
        tableHeight="h-[calc(100vh-600px)]"
      />
    </>
  );
};

export default InkindDetails;
