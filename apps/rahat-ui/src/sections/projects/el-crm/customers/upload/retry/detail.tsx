import { useSingleFailedBatch } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useFailedCustomersTableColumn } from './useFailedCustomersTableColumn';
import DemoTable from 'apps/rahat-ui/src/components/table';
import Link from 'next/link';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

export default function BatchDetailView() {
  const { id: projectUUID, batchId } = useParams() as {
    id: UUID;
    batchId: UUID;
  };

  const { failedBatch, isLoading } = useSingleFailedBatch(projectUUID, {
    batchUUID: batchId,
  });

  const [cellEdits, setCellEdits] = useState<
    Record<number, Record<string, string>>
  >({});

  const [resetKey, setResetKey] = useState(0);

  const tableData = useMemo(
    () =>
      failedBatch?.batch?.map((b) => {
        const errorEntry = failedBatch?.errorDetails?.error?.find(
          (v) => v[b.customerCode],
        );
        const errors = errorEntry?.[b.customerCode];
        return { ...b, error: errors ?? '' };
      }),
    [failedBatch],
  );

  // useCallback keeps the reference stable so useMemo([onCellChange]) in the
  // hook never rebuilds the columns array — cells stay mounted while typing.
  const handleCellChange = useCallback(
    (rowIndex: number, field: string, value: string) => {
      setCellEdits((prev) => ({
        ...prev,
        [rowIndex]: { ...prev[rowIndex], [field]: value },
      }));
    },
    [],
  );

  // Merged data for retry submission
  const editedData = useMemo(() => {
    if (!tableData) return [];
    return tableData.map((row, index) => ({
      ...row,
      ...(cellEdits[index] ?? {}),
    }));
  }, [tableData, cellEdits]);

  const hasEdits = Object.keys(cellEdits).length > 0;

  // No cellEdits passed — columns are fully independent of parent state
  const columns = useFailedCustomersTableColumn(handleCellChange, resetKey);

  const table = useReactTable({
    manualPagination: true,
    data: tableData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleReset = () => {
    setCellEdits({});
    setResetKey((k) => k + 1);
  };

  const handleRetryWithEdits = () => {
    console.log('Retrying with edited data:', editedData);
    // retryImport({ projectUUID, batchId, customers: editedData });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/projects/el-crm/${projectUUID}/customers/upload/retry`}
            >
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

          {hasEdits && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {Object.keys(cellEdits).length} row(s) edited
              </span>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button size="sm" onClick={handleRetryWithEdits}>
                Retry Import
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="text-sm p-6 pb-0">
        <strong>Status:</strong> {failedBatch?.status?.split('_').join(' ')}
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
