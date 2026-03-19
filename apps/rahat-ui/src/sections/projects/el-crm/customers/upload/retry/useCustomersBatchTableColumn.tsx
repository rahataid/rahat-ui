import { useRetryCustomerImport } from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { ColumnDef } from '@tanstack/react-table';
import { UUID } from 'crypto';
import { Eye, RotateCcw } from 'lucide-react';
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
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Job ID
        </span>
      ),
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm font-mono truncate max-w-[260px] block cursor-default">
              {row.getValue('jobId')}
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="font-mono text-xs">{row.getValue('jobId')}</p>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      accessorKey: 'failedVendors',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Failed Customers
        </span>
      ),
      cell: ({ row }) => {
        const vendors = row.getValue('failedVendors') as string[];
        const text = Array.isArray(vendors) ? vendors.join(', ') : '';
        if (!text) return <span className="text-muted-foreground/60">—</span>;
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm truncate max-w-[220px] block cursor-default">
                {text}
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[320px]">
              <p className="text-xs">{text}</p>
            </TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: 'status',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Status
        </span>
      ),
      cell: ({ row }) => (
        <Badge variant="destructive">
          {(row.getValue('status') as string)?.split('_').join(' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'retryCount',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Retries
        </span>
      ),
      cell: ({ row }) => (
        <span className="text-sm tabular-nums font-medium">
          {row.getValue('retryCount')}
        </span>
      ),
    },
    {
      accessorKey: 'lastRetryAt',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Last Retry
        </span>
      ),
      cell: ({ row }) => {
        const value = row.getValue('lastRetryAt');
        if (!value) return <span className="text-muted-foreground/60">—</span>;
        return (
          <span className="text-sm tabular-nums">
            {new Date(value as string).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Actions
        </span>
      ),
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() =>
                    router.push(
                      `/projects/el-crm/${projectUUID}/customers/upload/retry/${row.original.uuid}`,
                    )
                  }
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View failed customers and fix errors</p>
              </TooltipContent>
            </Tooltip>
            {row.original.status !== 'CRM_VALIDATION_FAILED' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5"
                    onClick={() => handleRetryImport(row.original.uuid)}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Retry
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Retry importing this batch as-is</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];
  return columns;
};
