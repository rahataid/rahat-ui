'use client';

import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from '@rahat-ui/shadcn/components/table';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import HeaderWithBack from '../../projects/components/header.with.back';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import {
  ScrollArea,
  ScrollBar,
} from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Share } from 'lucide-react';
export default function ExcelUploader() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
  const [data, setData] = useState<any[][]>([]);
  const [fileName, setFileName] = useState<string>('No File Choosen');
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
        setData(data as any[][]);
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
    <>
      <div className="p-4  h-[calc(100vh-115px)]">
        <div className="flex justify-between items-center mb-4">
          <HeaderWithBack
            title="Import Beneficiaries"
            subtitle="Select beneficiary file to update (Excel file)"
            path="/beneficiary"
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
                  <Share size={22} className="px-1" />
                  Choose File
                </span>
                <span className="px-4 py-2 flex-grow truncate">{fileName}</span>
              </div>
            </div>
          </div>
        </div>

        <>
          {data.length > 0 && (
            <div className="border-2 border-dashed  border-black sm:w-[1500px] w-[1600px] mt-6 p-4 mx-auto">
              <ScrollArea className="h-[calc(100vh-430px)]">
                <Table className="w-full table-auto">
                  <TableHeader>
                    <TableRow>
                      {data[0].map((header, index) => (
                        <TableHead
                          key={index}
                          className="truncate max-w-[150px] overflow-hidden"
                        >
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.slice(1).map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <TableCell
                            key={cellIndex}
                            className="truncate max-w-[150px] overflow-hidden"
                          >
                            {cell}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
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
          {data?.length ? <p>Total Count: {data?.length ?? 0}</p> : null}
        </div>
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/beneficiary')}
          >
            Cancel
          </Button>
          {/* {addBeneficiary.isPending ? (
        <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
        </Button>
        ) : ( */}

          <Button className="px-10" disabled={!data?.length}>
            Add
          </Button>
          {/* )} */}
        </div>
      </div>
    </>
  );
}
