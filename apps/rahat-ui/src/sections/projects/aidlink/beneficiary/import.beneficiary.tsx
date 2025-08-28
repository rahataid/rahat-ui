'use client';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { CloudDownload, Repeat, Share } from 'lucide-react';
import { ClientSidePagination, Heading } from 'apps/rahat-ui/src/common';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/src/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ScrollArea,
  ScrollBar,
} from '@rahat-ui/shadcn/src/components/ui/scroll-area';

const DOWNLOAD_FILE_URL = '/files/stakeholder-sample.xlsx';

const requiredHeaders = [
  'stakeholders name',
  'phone number',
  'designation',
  'organization',
  'district',
  'municipality',
];

const allowedExtensions: { [key: string]: string } = {
  xlsx: 'excel',
  xls: 'excel',
  json: 'json',
  csv: 'csv',
};

const ImportBeneficiary = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('No File Chosen');
  const [data, setData] = useState<any[][]>([]);
  const [invalidPhoneStrings, setInvalidPhoneStrings] = useState<Set<string>>(
    new Set(),
  );
  const [duplicatePhonesFromServer, setDuplicatePhonesFromServer] = useState<
    Set<string>
  >(new Set());
  const [duplicateEmailFromServer, setDuplicateEmailFromServer] = useState<
    Set<string>
  >(new Set());
  const [duplicatePhonesOnUpload, setDuplicatePhonesOnUpload] = useState<
    Set<string>
  >(new Set());
  const [duplicateEmails, setDuplicateEmails] = useState<Set<string>>(
    new Set(),
  );

  const tableData = useMemo(() => data.slice(1), [data]);
  const columns = React.useMemo<ColumnDef<any>[]>(
    () =>
      data[0]?.map((header: any, index: number) => ({
        accessorFn: (row: any) => row[index],
        id: `col-${index}`,
        header: () => header || `Column ${index + 1}`,
        cell: ({ getValue, column }) => {
          const value = getValue();
          const colIndex = parseInt(column.id.replace('col-', ''), 10);
          const headerText =
            data[0]?.[colIndex]?.toString().toLowerCase() ?? '';

          const valueStr = value?.toString().trim();
          const isPhone = /phone/.test(headerText);
          const isEmail = /email/.test(headerText);

          const isMissing =
            (requiredHeaders.includes(headerText) && valueStr === '') ||
            valueStr === null ||
            valueStr === undefined;

          const isInvalidPhone =
            isPhone && valueStr && invalidPhoneStrings.has(valueStr);

          const isDuplicatePhone =
            isPhone && valueStr && duplicatePhonesOnUpload.has(valueStr);

          const isDuplicatePhoneFromServer =
            duplicatePhonesFromServer &&
            valueStr &&
            duplicatePhonesFromServer.has(valueStr);
          const isDuplicateEmailsFromServer =
            duplicateEmailFromServer &&
            valueStr &&
            duplicateEmailFromServer.has(valueStr);
          const isDuplicateEmail =
            isEmail && valueStr && duplicateEmails.has(valueStr);
          return (
            <TableCell
              className={`
    truncate max-w-[150px] cursor-pointer
    ${
      isMissing
        ? 'bg-blue-100 text-white'
        : isInvalidPhone
        ? 'bg-blue-100 text-white'
        : isDuplicatePhone
        ? 'bg-red-100 text-red-500'
        : isDuplicatePhoneFromServer
        ? 'bg-red-100 text-red-500'
        : isDuplicateEmail
        ? 'bg-yellow-100 text-yellow-600'
        : isDuplicateEmailsFromServer
        ? 'bg-yellow-100 text-yellow-600'
        : ''
    }
  `}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className=" inline-block w-full min-h-[1.5rem]">
                      {value?.toString()?.trim() || '--'}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {isMissing
                      ? 'Required field is missing'
                      : isInvalidPhone
                      ? 'Invalid phone format as consist of a string'
                      : isDuplicatePhone
                      ? 'Phone is duplicated within the file'
                      : isDuplicatePhoneFromServer
                      ? 'Phone already exists in the database'
                      : isDuplicateEmail
                      ? 'Email is duplicated within the file'
                      : isDuplicateEmailsFromServer
                      ? 'Email already exists in the database'
                      : ''}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
          );
        },
      })) ?? [],
    [
      data,
      duplicateEmailFromServer,
      duplicateEmails,
      duplicatePhonesFromServer,
      duplicatePhonesOnUpload,
      invalidPhoneStrings,
    ],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setDuplicatePhonesFromServer(new Set());
    setData([]);
    setFileName(file?.name || 'No File Choosen');
    setSelectedFile(file || null);

    setFileName(file?.name as string);
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

        const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

        // Filter out completely empty rows
        const filteredData = rawData.filter((row) =>
          row.some(
            (cell) => cell !== null && cell !== undefined && cell !== '',
          ),
        );

        const columnCount = filteredData[0]?.length || 0;

        const header = filteredData[0];

        // Normalize header names
        const normalizedHeaders = header.map((h) =>
          h?.toString().toLowerCase().trim(),
        );

        const phoneIndex = header.findIndex((h) =>
          h?.toString().toLowerCase().includes('phone'),
        );
        const emailIndex = header.findIndex((h) =>
          h?.toString().toLowerCase().includes('email'),
        );

        const seenPhones = new Set<string>();
        const duplicatePhones = new Set<string>();
        const invalidPhoneStrings = new Set<string>();
        const seenEmails = new Set<string>();
        const duplicateEmails = new Set<string>();

        const normalizedData = filteredData.map((row, idx) => {
          const newRow = [...row];
          while (newRow.length < columnCount) newRow.push('');

          if (idx === 0) return newRow;

          // Phone validation
          if (phoneIndex !== -1) {
            const phone = newRow[phoneIndex]?.toString().trim() ?? '';

            if (/[A-Za-z]/.test(phone) || phone.length !== 10) {
              invalidPhoneStrings.add(phone);
            }

            if (seenPhones.has(phone)) duplicatePhones.add(phone);
            seenPhones.add(phone);

            newRow[phoneIndex] = phone;
          }

          // Email validation
          if (emailIndex !== -1) {
            const email = newRow[emailIndex]?.toString().trim() ?? '';
            if (seenEmails.has(email)) duplicateEmails.add(email);
            seenEmails.add(email);
          }

          return newRow;
        });

        // Check for missing required fields
        for (const required of requiredHeaders) {
          if (!normalizedHeaders.includes(required)) {
            toast.error(
              `File is missing the required field: "${required}". Download the sample file for reference.`,
              {
                autoClose: 5000,
              },
            );
            return;
          }
        }

        if (normalizedData.length === 1) {
          return toast.error('No Stakeholder found in excel file');
        }
        if (normalizedData.length > 100)
          return toast.error(
            'Maximum 100 stakeholders can be uploaded at a time',
          );

        setDuplicatePhonesOnUpload(duplicatePhones);
        setDuplicateEmails(duplicateEmails);
        setInvalidPhoneStrings(invalidPhoneStrings);

        setData(normalizedData);
      };

      reader.readAsBinaryString(file);
      setSelectedFile(file);
    }
  };

  const handleSampleDownload = () => {
    fetch(DOWNLOAD_FILE_URL)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'beneficiary.xlsx');
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        toast.error('Error downloading file!' + error);
      });
  };

  const hasEmptyRequiredFields = useCallback(() => {
    if (data.length < 2) return true;

    const headers = data[0].map((h: any) => h?.toString().toLowerCase().trim());

    return data.slice(1).some((row) =>
      requiredHeaders
        .filter((h) => h !== 'email')
        .some((header) => {
          const index = headers.indexOf(header);
          if (index === -1) return true; // required column missing
          const cell = row[index];
          return !cell || cell.toString().trim() === '';
        }),
    );
  }, [data]);

  const handleClearButtonClick = () => {
    setData([]);
    setFileName('No File Choosen');
    setSelectedFile(null);
    setDuplicatePhonesOnUpload(new Set());
    setDuplicateEmails(new Set());
    setDuplicatePhonesFromServer(new Set());
    setInvalidPhoneStrings(new Set());
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleUpload = () => {
    console.log('handle upload clicked');
  };

  // Empty required fields warning
  useEffect(() => {
    if (data.length > 1 && hasEmptyRequiredFields()) {
      toast.error('Fill all required fields first');
    }
  }, [data, hasEmptyRequiredFields]);

  // Duplicate phone numbers in uploaded file
  useEffect(() => {
    if (duplicatePhonesOnUpload.size > 1) {
      toast.warn(
        `⚠️ ${duplicatePhonesOnUpload.size} duplicate phone number(s) found in uploaded file. They have been highlighted in red.`,
        { autoClose: 5000 },
      );
    }
  }, [duplicatePhonesOnUpload]);

  // Duplicate emails in uploaded file
  useEffect(() => {
    if (duplicateEmails.size > 1) {
      toast.warn(
        `⚠️ ${duplicateEmails.size} duplicate email address(es) found in uploaded file. They have been highlighted in yellow.`,
        { autoClose: 5000 },
      );
    }
  }, [duplicateEmails]);

  return (
    <>
      <div className="p-4 h-[calc(100vh-120px)] bg-[#F8FAFC]">
        <div className="mb-2">
          <Heading
            title="Import Beneficiaries"
            description="Select field to upload beneficiaries"
          />
        </div>

        <div>
          <p className="text-gray-700 font-medium">Attach File</p>
          <div className="flex justify-between space-x-2 mt-2">
            <div className="relative w-full bg-white">
              <Input
                type="file"
                ref={inputRef}
                onChange={handleFileUpload}
                className="sr-only"
              />

              <div
                className="flex items-center border rounded-sm  cursor-pointer w-full"
                onClick={() => inputRef.current?.click()}
              >
                <span className="flex items-center border-r-2 text-blue-500 px-4 py-2 font-semibold text-sm hover:bg-gray-200 transition-colors space-x-3">
                  {selectedFile ? (
                    <>
                      <Repeat size={22} className="px-1" /> Replace
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

        <div className="mt-4">
          <Button
            onClick={handleSampleDownload}
            type="button"
            variant="outline"
          >
            <CloudDownload size={22} className="mr-1" />
            Download Sample
          </Button>
        </div>

        <>
          {data.length > 1 && (
            <>
              <div className="border-2 border-dashed border-black mt-6 mx-auto w-full">
                <ScrollArea className="h-[calc(100vh-430px)] w-full">
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
          {data?.length ? <p>Total Count: {data?.length - 1 || 0}</p> : null}
        </div>
        <div className="flex space-x-2">
          <Button
            type="button"
            className="w-48"
            variant="outline"
            onClick={handleClearButtonClick}
          >
            Clear
          </Button>

          <Button
            className="w-48 bg-primary hover:ring-2 ring-primary"
            onClick={handleUpload}
            disabled={
              data?.length === 0 ||
              hasEmptyRequiredFields() ||
              duplicatePhonesOnUpload.size > 1 ||
              duplicateEmails.size > 1
            }
          >
            Import
          </Button>
        </div>
      </div>
    </>
  );
};

export default ImportBeneficiary;
