'use client';
import { useCallback, useMemo } from 'react';
import { useGetImport, useGetImportFile } from '@rahat-ui/query';
import { useParams, useSearchParams } from 'next/navigation';
import HeaderWithBack from '../projects/components/header.with.back';
import DataCard from '../../components/dataCard';
import { Calendar, Download, FileSpreadsheet, Users2 } from 'lucide-react';
import { CircleEllipsisIcon } from 'lucide-react';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Button } from '@rahat-ui/shadcn/components/button';
import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { UUID } from 'crypto';

function ImportDetailView() {
  const { uuid } = useParams();
  const searchParams = useSearchParams();
  const groupName = searchParams.get('name');
  const count = searchParams.get('count');
  const date = searchParams.get('date') as string;

  const { data: importData, isLoading } = useGetImport(uuid as UUID);

  const {
    data: csvText,
    isLoading: csvLoading,
    error: csvErrorObj,
  } = useGetImportFile(uuid as UUID);

  const csvError = csvErrorObj?.message || null;

  const { csvHeaders, csvData } = useMemo(() => {
    if (!csvText) return { csvHeaders: [], csvData: [] };
    const rows = csvText
      .split('\n')
      .map((row: string) => row.split(',').map((cell: string) => cell.trim()));
    if (rows.length === 0) return { csvHeaders: [], csvData: [] };
    return {
      csvHeaders: rows[0],
      csvData: rows.slice(1).filter((row: string[]) => row.some((cell) => cell)),
    };
  }, [csvText]);

  const handleDownload = useCallback(() => {
    if (!csvText) return;
    const blob = new Blob([csvText], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${groupName || 'import'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [csvText, groupName]);

  const formatDate = date
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kathmandu',
      }).format(new Date(date))
    : '-';

  return (
    <div className="p-4 h-[calc(100vh-65px)] flex flex-col overflow-hidden">
      <div className="shrink-0">
        <HeaderWithBack
          title={groupName || 'Import Detail'}
          subtitle="Here is the detailed view of the selected import"
          path="/import-beneficiary"
        />

        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 pl-1 mt-4 mb-4">
          <DataCard
            title="Beneficiary Count"
            Icon={Users2}
            smallNumber={count || importData?.data?.beneficiaryCount || 0}
          />
          <DataCard
            title="Created at"
            Icon={Calendar}
            smallNumber={formatDate}
          />
          <DataCard
            title="Status"
            Icon={FileSpreadsheet}
            smallNumber={importData?.data?.status || '-'}
          />
        </div>
      </div>

      <div className="border rounded-sm flex-1 min-h-0 flex flex-col overflow-hidden">
        {isLoading || csvLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-center">
              <CircleEllipsisIcon className="animate-spin h-8 w-8 ml-4" />
              <Label className="text-base">Loading CSV...</Label>
            </div>
          </div>
        ) : csvError ? (
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-sm text-red-500">{csvError}</p>
          </div>
        ) : csvHeaders.length > 0 ? (
          <>
            <div className="flex items-center justify-between p-4 pb-2 shrink-0">
              <p className="text-sm text-muted-foreground">
                {csvData.length} rows, {csvHeaders.length} columns
              </p>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            </div>
            <div className="overflow-auto flex-1 min-h-0">
              <TableComponent>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow>
                    {csvHeaders.map((header, index) => (
                      <TableHead key={index} className="whitespace-nowrap">
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell
                          key={cellIndex}
                          className="whitespace-nowrap"
                        >
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </TableComponent>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-sm text-gray-500">No CSV data available</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImportDetailView;
