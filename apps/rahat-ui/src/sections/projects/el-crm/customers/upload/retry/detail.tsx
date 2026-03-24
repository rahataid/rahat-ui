import { useRetryCustomerImport, useSingleFailedBatch } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useFailedCustomersTableColumn } from './useFailedCustomersTableColumn';
import DemoTable from 'apps/rahat-ui/src/components/table';
import Link from 'next/link';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ArrowLeft, RotateCcw, AlertCircle, AlertTriangle, Pencil } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

export default function BatchDetailView() {
  const { id: projectUUID, batchId: batchUUID } = useParams() as {
    id: UUID;
    batchId: UUID;
  };
  const router = useRouter();

  const { failedBatch, isLoading } = useSingleFailedBatch(projectUUID, {
    batchUUID,
  });

  const retryImport = useRetryCustomerImport();

  const [cellEdits, setCellEdits] = useState<
    Record<number, Record<string, string>>
  >({});

  const [resetKey, setResetKey] = useState(0);

  const isValidationError = failedBatch?.status === 'CRM_VALIDATION_FAILED';

  const tableData = useMemo(
    () =>
      failedBatch?.batch?.map((b: any) => {
        // Flatten legacy `extras` into top-level so table accessorKeys
        // (email, channel) resolve correctly for both old and new data.
        const { extras, ...flat } = b;
        const row = { ...flat, ...extras };

        if (!isValidationError) {
          // Non-validation error — no per-field errors available
          return { ...row, error: '' };
        }

        // Validation error — look up per-vendor field-level errors
        const errorArray = failedBatch?.errorDetails?.error;
        const errorEntry = Array.isArray(errorArray)
          ? errorArray.find((v: any) => v[b.customerCode])
          : undefined;
        const errors = errorEntry?.[b.customerCode];
        return { ...row, error: errors ?? '' };
      }),
    [failedBatch, isValidationError],
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

  // Merged data for retry submission — strips the transient `error`
  // property so stale validation info isn't sent back to the server.
  const editedData = useMemo(() => {
    if (!tableData) return [];
    return tableData.map((row: any, index: number) => {
      const { error, ...clean } = { ...row, ...(cellEdits[index] ?? {}) };
      return clean;
    });
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

  const handleRetryWithEdits = async () => {
    if (retryImport.isPending) return;
    const result = await retryImport.mutateAsync({
      projectUUID,
      payload: {
        batchUUID,
        // Only send edited data for validation errors; other errors retry as-is
        ...(isValidationError ? { vendors: editedData } : {}),
      },
    });

    // If vendors still have errors after edit-and-retry, stay on page
    const responseData = (result as any)?.data;
    const stillFailed = responseData?.failedVendors ?? 0;

    if (isValidationError && stillFailed > 0) {
      // Refresh data and reset edits so user sees updated errors
      handleReset();
      return;
    }

    router.push(`/projects/el-crm/${projectUUID}/customers`);
  };

  const editCount = Object.keys(cellEdits).length;
  const statusText = failedBatch?.status?.split('_').join(' ');

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full">
        {/* Page Header */}
        <div className="border-b border-border bg-card px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/projects/el-crm/${projectUUID}/customers/upload/retry`}
                  >
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
                  <p>Back to Failed Batches</p>
                </TooltipContent>
              </Tooltip>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                    Failed Customers
                  </h1>
                  {statusText && (
                    <Badge variant="destructive" className="text-xs">
                      {statusText}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {isValidationError
                    ? 'Review and fix validation errors before retrying'
                    : 'Review the data and retry when ready'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isValidationError && hasEdits && (
                <>
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Pencil className="h-3.5 w-3.5" />
                    {editCount} row{editCount !== 1 ? 's' : ''} edited
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
                        onClick={handleReset}
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reset
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Discard all edits and restore original values</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    className="h-8 gap-1.5"
                    onClick={handleRetryWithEdits}
                    disabled={retryImport.isPending}
                  >
                    {retryImport.isPending ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Retrying...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="h-3.5 w-3.5" />
                        Retry Import
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {hasEdits
                      ? 'Retry import with your corrections applied'
                      : 'Retry importing this batch as-is'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto space-y-4">
          {/* Error Context Banner */}
          {!isLoading && (
            <>
              {isValidationError ? (
                <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
                  <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Fields with errors are highlighted in red and editable. Fix the
                    values directly in the table, then click{' '}
                    <strong className="text-foreground">Retry Import</strong> to
                    re-submit with your corrections.
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-lg border border-warning/20 bg-warning/10 px-4 py-3">
                  <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-warning">
                      {failedBatch?.status === 'CORE_SYNC_FAILED'
                        ? 'Core platform sync failed'
                        : 'Database processing failed'}
                    </p>
                    <p className="text-sm text-warning/80 mt-0.5">
                      {typeof failedBatch?.errorCause === 'string' &&
                      failedBatch.errorCause !== '[object Object]'
                        ? failedBatch.errorCause
                        : 'This batch encountered a system error during processing.'}{' '}
                      The data itself is valid — click{' '}
                      <strong className="text-warning">Retry Import</strong> to
                      re-process.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Table Card */}
          <Card className="flex flex-col">
            <CardContent className="p-0">
              <DemoTable
                table={table}
                tableHeight="h-[calc(100vh-360px)]"
                loading={isLoading}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
