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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import HeaderWithBack from '../../components/header.with.back';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import {
  ScrollArea,
  ScrollBar,
} from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Share } from 'lucide-react';
export default function ExcelUploader() {
  const { id } = useParams() as { id: UUID };
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
    <div className="p-4  bg-white overflow-x-hidden">
      <div className="flex justify-between items-center mb-4">
        <HeaderWithBack
          title="Upload Beneficiaries"
          subtitle="select beneficiary file to update (Excel file)"
          path={`/projects/el-cambodia/${id}/beneficiary`}
        />
      </div>

      <div className="rounded-lg p-4 border bg-card ">
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

      {data.length > 0 && (
        <>
          <ScrollArea className="h-[450px]  border-2 border-dashed  border-black sm:w-[1500px] w-[1600px] mt-6 p-4 mx-auto">
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
          <div className="flex justify-between items-center mt-6 mx-auto sm:w-[1500px] w-[1600px]">
            <h1 className="text-base font-normal">
              Total Count :{data.length}
            </h1>

            <div className="flex space-x-3">
              <Button
                variant="secondary"
                className="w-32 rounded-md "
                onClick={() => {
                  setFileName('No File Choosen');
                  setData([]);
                }}
              >
                Cancel
              </Button>
              <Button className="w-32 rounded-md ">Upload</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
