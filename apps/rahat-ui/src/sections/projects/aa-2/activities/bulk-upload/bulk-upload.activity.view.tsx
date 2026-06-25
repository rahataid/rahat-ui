'use client';

import React, { useCallback, useRef, useState } from 'react';
import { UUID } from 'crypto';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useUserList } from '@rumsan/react-query';
import {
  useActivitiesCategories,
  useActivitiesStore,
  useBulkAddActivities,
  usePhases,
  usePhasesStore,
  useValidateBulkAddActivities,
} from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/src/components/ui/table';
import { CloudDownload, FileWarning, Repeat2, Share } from 'lucide-react';
import { toast } from 'react-toastify';
import { HeaderWithBack } from 'apps/rahat-ui/src/common';
import {
  RowResult,
  buildActivityPayload,
  checkPhaseSupport,
  downloadBlob,
  downloadErrorsSheet,
  generateSampleWorkbook,
  parseUploadedSheet,
} from './bulk-upload.utils';

export default function BulkUploadActivities() {
  const { id: projectID } = useParams() as { id: UUID };
  const router = useRouter();
  const searchParams = useSearchParams();
  const showLeadTime = searchParams.get('isRequiredLeadTime') === 'true';
  const showType = searchParams.get('isAutomatedActivity') === 'true';
  const inputRef = useRef<HTMLInputElement>(null);

  useActivitiesCategories(projectID);
  usePhases(projectID);
  const { categories } = useActivitiesStore((state) => ({
    categories: state.categories,
  }));
  const { phases } = usePhasesStore((state) => ({ phases: state.phases }));
  const { data: users } = useUserList({
    page: 1,
    perPage: 9999,
    sort: 'createdAt',
    roles: 'admin , manager',
  });

  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [fileName, setFileName] = useState('No File Choosen');
  const [results, setResults] = useState<RowResult[] | null>(null);

  const { mutateAsync: validateActivities, isPending: isValidating } =
    useValidateBulkAddActivities();
  const { mutateAsync: submitActivities, isPending: isSubmitting } =
    useBulkAddActivities();

  const isValid = !!results && results.every((r) => !r.error);

  // Used only to re-find a row's title after validation merges server errors back in.
  const colIndex = useCallback(
    (label: string) =>
      headers.findIndex((h) => h?.toLowerCase().trim() === label.toLowerCase()),
    [headers],
  );

  const handleSampleDownload = useCallback(async () => {
    const userNames = (users?.data ?? []).map((u) => u.name).filter(Boolean);
    const phaseNames = phases.map((p) => p.name);
    const categoryNames = categories.map((c) => c.name);

    if (!userNames.length || !phaseNames.length || !categoryNames.length) {
      toast.error('Reference data is still loading, please try again in a moment.');
      return;
    }

    const blob = await generateSampleWorkbook({
      showLeadTime,
      showType,
      userNames,
      phaseNames,
      categoryNames,
    });
    downloadBlob(blob, 'Activity_Bulk_Upload_Sample.xlsx');
  }, [users, phases, categories, showLeadTime, showType]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setHeaders([]);
      setRows([]);
      setResults(null);
      setFileName(file?.name ?? 'No File Choosen');
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        if (!bstr) return;
        const parsed = parseUploadedSheet(bstr);
        if ('error' in parsed) {
          toast.error(parsed.error, { autoClose: 5000 });
          return;
        }
        setHeaders(parsed.headers);
        setRows(parsed.rows);
      };

      reader.readAsBinaryString(file);
    },
    [],
  );

  const handleClear = useCallback(() => {
    setHeaders([]);
    setRows([]);
    setResults(null);
    setFileName('No File Choosen');
    if (inputRef.current) inputRef.current.value = '';
  }, []);

  const handleValidate = useCallback(async () => {
    // Unsupported-phase rows are flagged client-side (phases already in memory,
    // no extra request) and skipped from the server validation call entirely.
    const phaseSupportErrors = rows.map((row) => checkPhaseSupport(row, headers, phases));
    const supportedRows = rows.filter((_, i) => !phaseSupportErrors[i]);

    try {
      const payload = supportedRows.map((row) =>
        buildActivityPayload(row, headers, { users: users?.data, phases, categories }),
      );
      const res = supportedRows.length
        ? await validateActivities({ projectUUID: projectID, activities: payload })
        : { data: { errors: [] } };
      const errors: any[] = res?.data?.errors ?? [];
      // errors[] holds only failing rows; match back to source rows by title
      const errorByTitle = new Map(errors.map((e) => [e.title, e.error]));
      let supportedIdx = 0;
      const rowResults: RowResult[] = rows.map((row, i) => {
        if (phaseSupportErrors[i]) {
          return { row, error: phaseSupportErrors[i], payload: null };
        }
        const rowPayload = payload[supportedIdx++];
        const title = row[colIndex('Activity Title')]?.toString().trim();
        const error = errorByTitle.get(title) ?? null;
        return { row, error, payload: error ? null : rowPayload };
      });
      rowResults.sort((a, b) => (a.error ? -1 : 0) - (b.error ? -1 : 0));
      setResults(rowResults);

      const failedCount = rowResults.filter((r) => r.error).length;
      if (failedCount === 0) {
        toast.success('All rows are valid.');
      } else {
        toast.error(`${failedCount} of ${rows.length} row(s) failed validation.`);
      }
    } catch {
      // toast already shown by useValidateBulkAddActivities's onError
    }
  }, [rows, headers, users, phases, categories, validateActivities, projectID, colIndex]);

  const submitRows = useCallback(
    async (rowsToSubmit: RowResult[]) => {
      try {
        await submitActivities({
          projectUUID: projectID,
          activities: rowsToSubmit.map((r) => r.payload),
        });
        toast.success('Activities bulk add submitted successfully and sync is in progress.');
        router.push(`/projects/aa/${projectID}/activities`);
      } catch {
        // toast already shown by useBulkAddActivities's onError
      }
    },
    [submitActivities, projectID, router],
  );

  const handleSubmit = useCallback(() => {
    if (!results) return;
    submitRows(results);
  }, [results, submitRows]);

  const handleSubmitValid = useCallback(() => {
    if (!results) return;
    submitRows(results.filter((r) => !r.error));
  }, [results, submitRows]);

  const handleDownloadErrors = useCallback(() => {
    if (!results) return;
    downloadErrorsSheet(headers, results);
  }, [results, headers]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-200px)] min-w-0">
      <div className="p-4 flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <HeaderWithBack
            title="Bulk Upload Activities"
            subtitle="Upload an excel sheet to add multiple activities at once"
            path={`/projects/aa/${projectID}/activities`}
          />
          <div className="flex gap-2 mt-4">
            {results && results.some((r) => r.error) && (
              <Button
                onClick={handleDownloadErrors}
                type="button"
                variant="outline"
                className="rounded-sm"
              >
                <FileWarning className="mr-1" size={16} />
                Download Errors
              </Button>
            )}
            <Button
              onClick={handleSampleDownload}
              type="button"
              variant="outline"
              className="rounded-sm"
            >
              <CloudDownload className="mr-1" size={16} />
              Download Sample
            </Button>
          </div>
        </div>

        <div className="p-3 border bg-card rounded-sm">
          <div className="relative w-full">
            <Input
              type="file"
              ref={inputRef}
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="sr-only"
            />
            <div
              className="flex items-center border rounded-sm cursor-pointer w-full"
              onClick={() => inputRef.current?.click()}
            >
              <span className="flex items-center rounded-sm bg-gray-100 text-blue-400 px-3 h-9 font-semibold text-sm hover:bg-gray-200 transition-colors whitespace-nowrap">
                {rows.length > 0 ? (
                  <>
                    <Repeat2 className="mr-1" size={16} /> Replace
                  </>
                ) : (
                  <>
                    <Share className="mr-1" size={16} />
                    Choose File
                  </>
                )}
              </span>
              <span className="px-3 text-sm truncate w-full">{fileName}</span>
            </div>
          </div>
        </div>

        {rows.length > 0 && (
          <div className="flex flex-col min-w-0 mt-4">
            <div className="border-2 border-dashed border-black w-full min-w-0 max-h-[60vh] overflow-auto">
              <div className="w-full">
                <Table className="table-auto w-full">
                  <TableHeader>
                    <TableRow>
                      {headers.map((header, idx) => (
                        <TableHead
                          key={idx}
                          className="truncate max-w-[200px] sticky top-0 bg-card"
                        >
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(results ?? rows.map((row) => ({ row, error: null, payload: null }))).map(
                      (result, rowIdx) => (
                        <TableRow
                          key={rowIdx}
                          className={
                            results
                              ? result.error
                                ? 'bg-red-50'
                                : 'bg-green-50'
                              : undefined
                          }
                        >
                          {headers.map((_, colIdx) => (
                            <TableCell
                              key={colIdx}
                              title={result.error ?? undefined}
                              className="truncate max-w-[200px]"
                            >
                              {result.row[colIdx]?.toString() || '--'}
                            </TableCell>
                          ))}
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center py-2 px-4 border-t mt-4 sticky bottom-0 bg-background z-10">
        <div>
          {rows.length > 0 && (
            <p className="text-sm text-muted-foreground">Total Count: {rows.length}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" className="rounded-sm" onClick={handleClear}>
            Clear
          </Button>
          {rows.length > 0 && !isValid && (
            <Button
              type="button"
              className="rounded-sm"
              onClick={handleValidate}
              disabled={isValidating}
            >
              {isValidating ? 'Validating...' : 'Validate'}
            </Button>
          )}
          {results && !isValid && results.some((r) => !r.error) && (
            <Button
              type="button"
              variant="outline"
              className="rounded-sm"
              onClick={handleSubmitValid}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Valid Rows'}
            </Button>
          )}
          {isValid && (
            <Button
              type="button"
              className="rounded-sm"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
