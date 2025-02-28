'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from '../../../../../libs/shadcn/src/components/ui/table';
import { Input } from '../../../../../libs/shadcn/src/components/ui/input';
import HeaderWithBack from '../../../common/header.with.back';

import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import {
  ScrollArea,
  ScrollBar,
} from '../../../../../libs/shadcn/src/components/ui/scroll-area';
import { Button } from '../../../../../libs/shadcn/src/components/ui/button';
import { Repeat2, Share } from 'lucide-react';
import { toast } from 'react-toastify';
export default function ImportStakeholder() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
  const [data, setData] = useState<any[][]>([]);
  const [fileName, setFileName] = useState<string>('No File Choosen');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    setFileName(file?.name as string);
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        const filteredData = (data as any[][]).filter((row) =>
          row.some(
            (cell) => cell !== null && cell !== undefined && cell !== '',
          ),
        );
        if (filteredData.length > 100)
          return toast.error(
            'Maximum 100 beneficiaries can be uploaded at a time',
          );

        setData(filteredData as any[][]);
      };
      reader.readAsBinaryString(file);
      setSelectedFile(file);
    }
  };
  const allowedExtensions: { [key: string]: string } = {
    xlsx: 'excel',
    xls: 'excel',
    json: 'json',
    csv: 'csv',
  };

  const handleUpload = async () => {
    if (data?.length === 1)
      return toast.error('No beneficiary found in excel file');

    if (!selectedFile) return toast.error('Please select a file to upload');

    // Determine doctype based on file extension
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    const doctype = extension ? allowedExtensions[extension] : '';
  };

  return (
    <>
      <div className="p-4  h-[calc(100vh-120px)]">
        <div className="flex justify-between items-center mb-4">
          <HeaderWithBack
            title="Import Stakeholders"
            subtitle="List of all stakeholders you can import"
            path="/stakeholders"
          />
        </div>

        <div className="rounded-lg p-4 border bg-card">
          <div className="flex justify-between space-x-2 mb-2">
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
          {data.length > 0 && (
            <div className="border-2 border-dashed border-black mt-6 mx-auto sm:w-[1500px] w-[1600px]">
              <ScrollArea className="h-[calc(100vh-450px)] w-full">
                <Table className=" table-auto">
                  <TableHeader>
                    <TableRow>
                      {data[0].map((header, index) => (
                        <TableHead
                          key={index}
                          className="truncate max-w-[150px] "
                        >
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.slice(1).map((row, rowIndex) => {
                      return (
                        <TableRow key={rowIndex}>
                          {row.map((cell, cellIndex) => {
                            return (
                              <TableCell
                                key={cellIndex}
                                className={`truncate max-w-[150px] `}
                              >
                                {cell}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
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
            }}
          >
            Cancel
          </Button>

          <Button
            className="w-48 bg-primary hover:ring-2 ring-primary"
            onClick={handleUpload}
            disabled={data?.length === 0}
          >
            Add
          </Button>
        </div>
      </div>
    </>
  );
}
