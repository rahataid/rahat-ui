import { useSingleFailedBatch } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useFailedCustomersTableColumn } from './useFailedCustomersTableColumn';
import DemoTable from 'apps/rahat-ui/src/components/table';
import Link from 'next/link';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function BatchDetailView() {
  const { id: projectUUID, batchId } = useParams() as {
    id: UUID;
    batchId: UUID;
  };

  const { failedBatch, isLoading } = useSingleFailedBatch(projectUUID, {
    batchUUID: batchId,
  });

  const tableData = failedBatch?.batch?.map((b) => {
    const errorEntry = failedBatch?.errorDetails?.error?.find(
      (v) => v[b.customerCode],
    );
    const errors = errorEntry?.[b.customerCode];
    return {
      ...b,
      error: errors ?? '',
    };
  });

  const columns = useFailedCustomersTableColumn();

  const table = useReactTable({
    manualPagination: true,
    data: tableData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card/50 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href={`/projects/el-crm/${projectUUID}/customers/upload/retry`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Failed Customers
            </h1>
            <p className="text-muted-foreground">List of failed customers</p>
          </div>
        </div>
      </div>
      <div className="text-sm p-6 pb-0">
        <strong>Status:</strong> {failedBatch?.status}
      </div>
      <Card className="m-6">
        <CardContent className="mt-6">
          <DemoTable
            table={table}
            tableHeight="h-[calc(100vh-360px)]"
            loading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
