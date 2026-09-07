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
import HeaderWithBack from '../../projects/components/header.with.back';
import { useRouter } from 'next/navigation';
import {
  ScrollArea,
  ScrollBar,
} from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/components/dialog';
import { Download, Share } from 'lucide-react';
import { useUploadBeneficiary } from '@rahat-ui/query';
import { toast } from 'react-toastify';

const SAMPLE_BENEFICIARY_HEADERS = [
  'Name',
  'Phone Number',
  'Gender*',
  'Age',
  'Government ID',
];

export default function ExcelUploader() {
  const router = useRouter();
  const [data, setData] = useState<string[][]>([]);
  const [fileName, setFileName] = useState<string>('No File Choosen');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [showGroupNameForm, setShowGroupNameForm] = useState(false);
  const [groupNameInput, setGroupNameInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadBeneficiary = useUploadBeneficiary();

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
        const parsedData = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          defval: '',
        }) as string[][];
        setData(parsedData);
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

  const handleUpload = async (groupName?: string) => {
    if (!selectedFile) return toast.error('Please select a file to upload');

    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    const doctype = extension ? allowedExtensions[extension] : '';

    await uploadBeneficiary.mutateAsync({
      selectedFile,
      doctype,
      groupName,
    });
  };

  const handleAddClick = () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setGroupNameInput('');
    setShowGroupNameForm(false);
    setShowGroupDialog(true);
  };

  const handleSkipForNow = async () => {
    setShowGroupDialog(false);
    setShowGroupNameForm(false);
    await handleUpload();
  };

  const handleCreateGroupSubmit = async () => {
    const trimmedName = groupNameInput.trim();

    if (!trimmedName) {
      toast.error('Please enter a group name');
      return;
    }

    setShowGroupDialog(false);
    setShowGroupNameForm(false);
    await handleUpload(trimmedName);
  };

  const handleDownloadSample = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([SAMPLE_BENEFICIARY_HEADERS]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Beneficiaries');

    const firstRowStyle = {
      font: { bold: true },
      alignment: { horizontal: 'center' },
    };

    SAMPLE_BENEFICIARY_HEADERS.forEach((_, index) => {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });
      if (!worksheet[cellRef]) {
        worksheet[cellRef] = { t: 's', v: '' };
      }
      worksheet[cellRef].s = firstRowStyle;
    });

    XLSX.writeFile(workbook, 'beneficiary_sample.xlsx');
  };

  useEffect(() => {
    if (uploadBeneficiary?.isSuccess) {
      // toast.success('File uploaded successfully.'); commented due to overlap
      router.push('/beneficiary');
    }
    // uploadBeneficiary?.isError && toast.error('File upload unsuccessful.');
  }, [router, uploadBeneficiary?.isSuccess, uploadBeneficiary?.isError]);

  return (
    <>
      <div className="p-4  h-[calc(100vh-115px)]">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex-1">
            <HeaderWithBack
              title="Import Beneficiaries"
              subtitle="Select beneficiary file to update (Excel file)"
              path="/beneficiary"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            className="gap-2 shrink-0"
            onClick={handleDownloadSample}
          >
            <Download size={16} />
            Download Sample
          </Button>
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
            <div className="border-2 border-dashed border-black mt-6 p-4 mx-auto w-full overflow-x-auto">
              <ScrollArea className="h-[calc(100vh-430px)] w-full">
                <div className="min-w-[900px]">
                  <Table className="w-full table-auto">
                    <TableHeader className="sticky top-0 bg-card">
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
                              className="truncate max-w-[100px] overflow-hidden"
                            >
                              {cell}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

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
            onClick={() => {
              setData([]);
              setFileName('No File Choosen');
              setSelectedFile(null);

              // router.push('/beneficiary')
            }}
          >
            Clear
          </Button>
          {/* {addBeneficiary.isPending ? (
        <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
        </Button>
        ) : ( */}
          <Button
            className="w-40 bg-primary hover:ring-2 ring-primary"
            onClick={handleAddClick}
            disabled={uploadBeneficiary?.isPending || !data?.length}
          >
            {uploadBeneficiary?.isPending ? <>Uploading...</> : 'Add'}
          </Button>
          {/* )} */}
        </div>
      </div>
      <Dialog
        open={showGroupDialog}
        onOpenChange={(open) => {
          setShowGroupDialog(open);
          if (!open) setShowGroupNameForm(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Beneficiary Group</DialogTitle>
            <DialogDescription>
              {showGroupNameForm
                ? 'Enter a name for the new group to create with these beneficiaries.'
                : 'Do you want to create a group for these beneficiaries or skip for now?'}
            </DialogDescription>
          </DialogHeader>

          {!showGroupNameForm ? (
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleSkipForNow}
                disabled={uploadBeneficiary?.isPending}
              >
                Skip for now
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={() => setShowGroupNameForm(true)}
                disabled={uploadBeneficiary?.isPending}
              >
                Create Group
              </Button>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <Input
                type="text"
                value={groupNameInput}
                onChange={(e) => setGroupNameInput(e.target.value)}
                placeholder="Enter group name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCreateGroupSubmit();
                  }
                }}
              />
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowGroupNameForm(false)}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  onClick={handleCreateGroupSubmit}
                  disabled={uploadBeneficiary?.isPending}
                >
                  Submit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
