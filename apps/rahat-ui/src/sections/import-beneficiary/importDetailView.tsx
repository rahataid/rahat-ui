'use client';
import { useEffect, useState } from 'react';

import {
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
} from '@tanstack/react-table';

import { useGetImport, usePagination } from '@rahat-ui/query';
import { useParams, useSearchParams } from 'next/navigation';
import HeaderWithBack from '../projects/components/header.with.back';
import DataCard from '../../components/dataCard';
import { Calendar, FileSpreadsheet, Users2 } from 'lucide-react';
import { CircleEllipsisIcon } from 'lucide-react';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { UUID } from 'crypto';

function ImportDetailView() {
  const { uuid } = useParams();
  const searchParams = useSearchParams();
  const groupName = searchParams.get('name');
  const count = searchParams.get('count');
  const date = searchParams.get('date') as string;

  const { data: importData, isLoading } = useGetImport(uuid as UUID);

  const [csvData, setCsvData] = useState<string[][]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCsv = async () => {
      const fileUrl = importData?.data?.extras?.originalFileUrl;
      if (!fileUrl) return;

      setCsvLoading(true);
      setCsvError(null);
      try {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error('Failed to fetch CSV file');
        const text = await response.text();
        const rows = text
          .split('\n')
          .map((row) => row.split(',').map((cell) => cell.trim()));
        if (rows.length > 0) {
          setCsvHeaders(rows[0]);
          setCsvData(rows.slice(1).filter((row) => row.some((cell) => cell)));
        }
      } catch (err: any) {
        setCsvError(err.message || 'Failed to load CSV');
      } finally {
        setCsvLoading(false);
      }
    };

    fetchCsv();
  }, [importData?.data?.extras?.originalFileUrl]);

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
    <div className="p-4 space-y-4 pb-0">
      <HeaderWithBack
        title={groupName || 'Import Detail'}
        subtitle="Here is the detailed view of the selected import"
        path="/import-beneficiary"
      />

      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 pl-1 mb-2">
        <DataCard
          title="Beneficiary Count"
          Icon={Users2}
          smallNumber={count || importData?.data?.beneficiaryCount || 0}
        />
        <DataCard title="Created at" Icon={Calendar} smallNumber={formatDate} />
        <DataCard
          title="Status"
          Icon={FileSpreadsheet}
          smallNumber={importData?.data?.status || '-'}
        />
      </div>

      <div className="p-4 pb-8 border rounded-sm">
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
          <TableComponent>
            <ScrollArea className="h-[calc(100vh-400px)] bg-card">
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  {csvHeaders.map((header, index) => (
                    <TableHead key={index}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </ScrollArea>
          </TableComponent>
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
