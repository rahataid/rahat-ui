'use client';

import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';

import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  ScrollArea,
  ScrollBar,
} from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/src/components/ui/table';

import { ClientSidePagination, HeaderWithBack } from 'apps/rahat-ui/src/common';
import { CloudDownload, Repeat2, Share } from 'lucide-react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { useVerifyManualPayout } from '@rahat-ui/query';
import { normalizeCell } from 'apps/rahat-ui/src/utils';

const DOWNLOAD_FILE_URL = '/files/verify-payout-sample.xlsx';

export default function VerificationPayout() {
  const params = useParams();
  const id = params.id as UUID;
  const payoutId = params.detailID as UUID;
  const router = useRouter();
  const [data, setData] = useState<any[][]>([]);
  const [fileName, setFileName] = useState<string>('No File Choosen');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const verifyManualPayout = useVerifyManualPayout();
  const [globalFilter, setGlobalFilter] = useState('');
  const columns = React.useMemo<ColumnDef<any>[]>(
    () =>
      data[0]?.map((header: any, index: number) => {
        const headerId = header
          ? header.toString().toLowerCase().replace(/\s+/g, '_')
          : `col-${index}`;

        return {
          accessorFn: (row: any) => row[index],
          id: headerId, // 👈 use normalized header as ID
          header: () => header || `Column ${index + 1}`,
          cell: ({ getValue }) => {
            const value = getValue();
            return (
              <TableCell className={`truncate max-w-[150px] cursor-pointer`}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-block w-full min-h-[1.5rem]">
                        {value?.toString() || '--'}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {value?.toString()}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            );
          },
        };
      }) ?? [],
    [data],
  );

  const tableData = React.useMemo(() => data.slice(1), [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
    },
  });

  const allowedExtensions: { [key: string]: string } = {
    xlsx: 'excel',
    xls: 'excel',
    json: 'json',
    csv: 'csv',
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setData([]);
    setFileName(file?.name || 'No File Choosen');
    setSelectedFile(file || null);

    const extension = file?.name.split('.').pop()?.toLowerCase();
    if (
      !extension ||
      !Object.prototype.hasOwnProperty.call(allowedExtensions, extension)
    ) {
      return toast.error(
        'Unsupported file format. Please upload an Excel, JSON, or CSV file.',
      );
    }

    if (file) {
      const reader = new FileReader();

      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        const rawData = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          raw: true,
        }) as any[][];

        // Filter out completely empty rows
        const filteredData = rawData.filter((row) =>
          row.some(
            (cell) => cell !== null && cell !== undefined && cell !== '',
          ),
        );

        const columnCount = filteredData[0]?.length || 0;

        const normalizedData = filteredData.map((row, idx) => {
          const newRow = row.map((cell) => normalizeCell(cell));
          while (newRow.length < columnCount) newRow.push('');
          return newRow;
        });

        if (normalizedData.length === 1) {
          return toast.error('No list found in excel file');
        }
        if (normalizedData.length > 100) {
          return toast.error('Maximum 100 list can be uploaded at a time');
        }

        setData(normalizedData);
      };

      reader.readAsBinaryString(file);
      setSelectedFile(file);
    }
  };
  const handleUpload = async () => {
    if (!selectedFile) return toast.error('Please select a file to upload');

    // Determine doctype based on file extension
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (
      !extension ||
      !Object.prototype.hasOwnProperty.call(allowedExtensions, extension)
    ) {
      return toast.error(
        'Unsupported file format. Please upload an Excel, JSON, or CSV file.',
      );
    }

    const doctype = allowedExtensions[extension];

    try {
      await verifyManualPayout.mutateAsync({
        selectedFile,
        doctype,
        projectId: id,
        payload: {
          payoutUUID: payoutId,
        },
      });

      // Clear duplicates if successful

      router.push(`/projects/aa/${id}/payout/details/${payoutId}`);
    } catch (error: any) {
      const message: string =
        error?.response?.data?.message || error?.message || '';
    }
  };

  const handleSampleDownload = (e) => {
    fetch(DOWNLOAD_FILE_URL)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'verify-payout-sample.xlsx');
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        toast.error('Error downloading file!' + error);
      });
  };

  return (
    <>
      <div className="p-4  h-[calc(100vh-120px)]">
        <div className="flex justify-between items-center mb-2">
          <HeaderWithBack
            title="Verify Manual Payout"
            subtitle="Upload excel sheet to manually verify payout"
            path={`/projects/aa/${id}/payout/details/${payoutId}`}
          />
          <div className="flex mt-4">
            <Button
              onClick={handleSampleDownload}
              type="button"
              variant="outline"
            >
              <CloudDownload size={22} className="mr-1" />
              Download Sample
            </Button>
          </div>
        </div>

        <div className=" p-4 border bg-card rounded-sm">
          <div className="flex justify-between space-x-2">
            <div className="relative w-full">
              <Input
                type="file"
                ref={inputRef}
                onChange={handleFileUpload}
                className="sr-only"
              />

              <div
                className="flex items-center border rounded-md  cursor-pointer w-full"
                onClick={() => inputRef.current?.click()}
              >
                <span className="flex items-center bg-gray-100 text-blue-400 px-4 py-2 font-semibold text-sm hover:bg-gray-200 transition-colors space-x-3">
                  {selectedFile ? (
                    <>
                      <Repeat2 size={22} className="px-1" /> Replace
                    </>
                  ) : (
                    <>
                      <Share size={22} className="px-1" />
                      Choose File
                    </>
                  )}
                </span>
                <span className="px-4 py-2 flex-grow truncate">{fileName}</span>
              </div>
            </div>
          </div>
        </div>

        <>
          {data.length > 1 && (
            <>
              <div className="border-2 border-dashed border-black mt-2 mx-auto w-full p-4">
                <div className="flex items-center mb-2">
                  <Input
                    placeholder="Search..."
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="rounded mr-2"
                  />
                </div>

                <ScrollArea className="h-[calc(100vh-480px)] w-full">
                  <Table className="table-auto w-full">
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableHead
                              key={header.id}
                              className="truncate max-w-[150px] sticky top-0 bg-card"
                            >
                              {
                                flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                ) as React.ReactNode
                              }
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <React.Fragment key={cell.id}>
                              {
                                flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                ) as React.ReactNode
                              }
                            </React.Fragment>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
              <ClientSidePagination table={table} />
            </>
          )}
        </>
      </div>
      <div className="flex justify-between items-center py-2 px-4 border-t">
        <div>
          {data?.length ? <p>Total Count: {data?.length - 1 ?? 0}</p> : null}
        </div>
        <div className="flex space-x-2">
          <Button
            type="button"
            className="w-48"
            variant="outline"
            onClick={() => {
              setData([]);
              setFileName('No File Choosen');
              setSelectedFile(null);

              if (inputRef.current) {
                inputRef.current.value = '';
              }
            }}
          >
            Clear
          </Button>

          <Button
            className="w-48 bg-primary hover:ring-2 ring-primary"
            onClick={handleUpload}
            disabled={data?.length === 0}
          >
            Import
          </Button>
        </div>
      </div>
    </>
  );
}
