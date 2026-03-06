import { useRetryCustomerImport } from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { UUID } from 'crypto';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export const useCustomersBatchTableColumn = () => {
  const { id: projectUUID } = useParams() as {
    id: UUID;
  };
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
      cell: ({ row }) => {
        const vendors = row.getValue('failedVendors');
        return <div>{Array.isArray(vendors) ? vendors.join(', ') : ''}</div>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <Badge>{row.getValue('status')}</Badge>,
    },
    {
      accessorKey: 'retryCount',
      header: 'Retry Count',
      cell: ({ row }) => <div>{row.getValue('retryCount')}</div>,
    },
    {
      accessorKey: 'lastRetryAt',
      header: 'Last Retry At',
      cell: ({ row }) => {
        const value = row.getValue('lastRetryAt');
        if (!value) return <div>-</div>;
        return <div>{new Date(value as string).toLocaleDateString()}</div>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                router.push(
                  `/projects/el-crm/${projectUUID}/customers/upload/retry/${row.original.uuid}`,
                )
              }
            >
              <Eye />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRetryImport(row.original.uuid)}
            >
              Retry
            </Button>
          </div>
        );
      },
    },
  ];
  return columns;
};
