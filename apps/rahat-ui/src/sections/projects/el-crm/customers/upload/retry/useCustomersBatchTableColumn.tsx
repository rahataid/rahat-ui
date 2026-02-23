import { useRetryCustomerImport } from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';

export const useCustomersBatchTableColumn = () => {
  const { id: projectUUID } = useParams() as { id: UUID };
  const router = useRouter();

  const retryImport = useRetryCustomerImport();

  const handleRetryImport = async (batchUUID: UUID) => {
    await retryImport.mutateAsync({
      projectUUID,
      payload: {
        batchUUID,
      },
    });
    router.push(`/projects/el-crm/${projectUUID}/customers`);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'jobId',
      header: 'Job ID',
      cell: ({ row }) => <div>{row.getValue('jobId')}</div>,
    },
    {
      accessorKey: 'failedVendors',
      header: 'Failed Vendors',
      cell: ({ row }) => <div>{row.getValue('failedVendors')}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <Badge>{row.getValue('status')}</Badge>,
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleRetryImport(row.original.uuid)}
          >
            Retry
          </Button>
        );
      },
    },
  ];
  return columns;
};
