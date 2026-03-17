import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import DemoTable from 'apps/rahat-ui/src/components/table';
import { useCustomersBatchTableColumn } from './useCustomersBatchTableColumn';
import { useFailedBatch } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import Link from 'next/link';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ArrowLeft, AlertTriangle, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

export default function CustomersUploadRetryView() {
  const { id: projectUUID } = useParams() as { id: UUID };

  const { failedBatch, isLoading } = useFailedBatch(projectUUID, {});

  const columns = useCustomersBatchTableColumn();

  const table = useReactTable({
    manualPagination: true,
    data: failedBatch || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const batchCount = failedBatch?.length || 0;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full">
        {/* Page Header */}
        <div className="border-b border-border bg-card px-6 py-5">
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/projects/el-crm/${projectUUID}/customers`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Back to Customers</p>
              </TooltipContent>
            </Tooltip>
            <div className="flex-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Failed Batches
                </h1>
                {batchCount > 0 && (
                  <span className="inline-flex items-center justify-center h-6 min-w-[24px] rounded-full bg-destructive/10 px-2 text-xs font-semibold text-destructive">
                    {batchCount}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Review and retry failed customer imports
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto space-y-4">
          {/* Info Banner */}
          <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">
              These batches failed during import due to some errors. You
              can view the details of each batch and retry the import, or fix
              the issues in the detail view before retrying.
            </p>
          </div>

          {/* Table Card */}
          <Card className="flex flex-col">
            <CardContent className="p-0">
              <DemoTable
                table={table}
                tableHeight="h-[calc(100vh-320px)]"
                loading={isLoading}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
