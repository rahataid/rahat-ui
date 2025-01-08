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
} from '@rahat-ui/shadcn/components/table';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import {
  ScrollArea,
  ScrollBar,
} from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ArrowDownToLine, Share } from 'lucide-react';
import {
  useUploadBeneficiaryBulkQueue,
  useValidateHealthWorker,
} from '@rahat-ui/query';
import { toast } from 'react-toastify';
import HeaderWithBack from '../../components/header.with.back';

const DOWNLOAD_FILE_URL = '/files/cambodia-file.xlsx';
export default function ExcelUploader() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
  const [data, setData] = useState<any[][]>([]);
  const [fileName, setFileName] = useState<string>('No File Choosen');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadBeneficiary = useUploadBeneficiaryBulkQueue();
  const validateHealthWorker = useValidateHealthWorker();
  const handleDownloadClick = () => {
    fetch(DOWNLOAD_FILE_URL)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'cambodia-beneficiary-upload-file.xlsx');
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        toast.error('Error downloading file!' + error);
      });
  };

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
        validateHealthWorker.mutateAsync({
          filteredData,
          projectUUID: id,
        });
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

    await uploadBeneficiary.mutateAsync({
      selectedFile,
      doctype,
      projectId: id,
      automatedGroupOption: {
        createAutomatedGroup: false,
        groupKey: 'Location',
      },
    });
  };

  useEffect(() => {
    if (uploadBeneficiary?.isSuccess) {
      // toast.success('File uploaded successfully.'); commented due to overlap
      router.push(`/projects/el-cambodia/${id}/beneficiary`);
    }
    // uploadBeneficiary?.isError && toast.error('File upload unsuccessful.');
  }, [uploadBeneficiary?.isSuccess, uploadBeneficiary.isError, router, id]);

  const isAnyHealthWorkerInvalid = data.slice(1).some((row) => {
    const healthWorkerUsernameIndex = data[0].indexOf('Health Worker Username');
    const healthWorkerUsername = row[healthWorkerUsernameIndex];
    const invalidUsernames =
      validateHealthWorker?.data?.data?.map((b) => b.koboUsername) || [];
    console.log(invalidUsernames);
    return !invalidUsernames.includes(healthWorkerUsername);
  });

  return (
    <>
      <div className="p-4  h-[calc(100vh-120px)]">
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

        {isAnyHealthWorkerInvalid && (
          <p className="text-red-300 mt-3 mx-auto">
            ** Health Worker User Name did not match. Check the Health Worker
            User Name **
          </p>
        )}
        <>
          {data.length > 0 && (
            <div className="border-2 border-dashed border-black mt-6 mx-auto sm:w-[1500px] w-[1600px]">
              <ScrollArea className="h-[calc(100vh-450px)] ">
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
                      const healthWorkerUsernameIndex = data[0].indexOf(
                        'Health Worker Username',
                      );
                      const invalidUsernames =
                        validateHealthWorker?.data?.data?.map(
                          (b) => b.koboUsername,
                        ) || [];
                      return (
                        <TableRow key={rowIndex}>
                          {row.map((cell, cellIndex) => {
                            const isInvalid =
                              cellIndex === healthWorkerUsernameIndex &&
                              !invalidUsernames.includes(cell);

                            return (
                              <TableCell
                                key={cellIndex}
                                className={`truncate max-w-[150px]  ${
                                  isInvalid ? 'bg-red-500' : ''
                                }`}
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
          <Button variant="secondary" onClick={handleDownloadClick}>
            <ArrowDownToLine className="mr-1" size={18} strokeWidth={1.5} />
            Download Sample
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setData([]);
              setFileName('No File Choosen');
              router.push(`/projects/el-cambodia/${id}/beneficiary`);
            }}
          >
            Cancel
          </Button>

          <Button
            className="w-40 bg-primary hover:ring-2 ring-primary"
            onClick={handleUpload}
            disabled={
              uploadBeneficiary?.isPending ||
              !data.length ||
              data?.length > 100 ||
              isAnyHealthWorkerInvalid
            }
          >
            {uploadBeneficiary?.isPending ? <>Uploading...</> : 'Add'}
          </Button>
          {/* )} */}
        </div>
      </div>
    </>
  );
}
