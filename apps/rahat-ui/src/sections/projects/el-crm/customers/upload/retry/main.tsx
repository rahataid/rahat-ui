import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import DemoTable from 'apps/rahat-ui/src/components/table';
import { useCustomersBatchTableColumn } from './useCustomersBatchTableColumn';
import { useFailedBatch } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import Link from 'next/link';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card/50 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href={`/projects/el-crm/${projectUUID}/customers/upload`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Failed Customers Batch
            </h1>
            <p className="text-muted-foreground">
              Retry failed customer imports
            </p>
          </div>
        </div>
      </div>
      <Card className="m-6">
        <CardContent className="mt-6">
          <DemoTable
            table={table}
            tableHeight="h-[calc(100vh-260px)]"
            loading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
