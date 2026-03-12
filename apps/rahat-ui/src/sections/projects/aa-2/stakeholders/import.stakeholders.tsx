'use client';

import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';

import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
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

import { Back, ClientSidePagination } from 'apps/rahat-ui/src/common';
import { CloudDownload, Repeat2, Share, Users, X } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  useUploadStakeholders,
  useCreateStakeholdersGroups,
  useProjectAction,
  useStakeholdersGroups,
} from '@rahat-ui/query';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

const DOWNLOAD_FILE_URL = '/files/stakeholder-sample.xlsx';
const requiredHeaders = [
  'stakeholders name',
  'phone number',
  'designation',
  'organization',
  'district',
  'municipality',
];
export default function ImportStakeholder() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
  const [data, setData] = useState<any[][]>([]);
  const [fileName, setFileName] = useState<string>('No File Choosen');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importedStakeholderUUIDs, setImportedStakeholderUUIDs] = useState<
    string[]
  >([]);
  const showGroupModal = useBoolean();
  const showGroupForm = useBoolean();
  const [groupName, setGroupName] = useState('');
  const [groupError, setGroupError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadStakeholders = useUploadStakeholders();
  const createStakeholdersGroup = useCreateStakeholdersGroups();
  const projectAction = useProjectAction();

  const { data: stakeholdersGroupsData } = useStakeholdersGroups(id, {
    sort: 'createdAt',
    order: 'desc',
  });

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
  const [invalidPhoneStrings, setInvalidPhoneStrings] = useState<Set<string>>(
    new Set(),
  );

  const hasEmptyRequiredFields = () => {
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
  };

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

  const tableData = React.useMemo(() => data.slice(1), [data]);

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

  const allowedExtensions: { [key: string]: string } = {
    xlsx: 'excel',
    xls: 'excel',
    json: 'json',
    csv: 'csv',
  };
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
      const response = await uploadStakeholders.mutateAsync({
        selectedFile,
        doctype,
        projectId: id,
      });
      const successCount = response?.data?.successCount || 0;

      if (successCount === 0) {
        toast.warning('No stakeholders were imported');
        router.push(`/projects/aa/${id}/stakeholders?tab=stakeholders`);
        return;
      }

      try {
        const stakeholdersResponse = await projectAction.mutateAsync({
          uuid: id,
          data: {
            action: 'aaProject.stakeholders.getAll',
            payload: {
              page: 1,
              perPage: successCount,
              sort: 'createdAt',
              order: 'desc',
            },
          },
        });
        const fetchedStakeholders = stakeholdersResponse?.response?.data || [];
        const importedUUIDs = fetchedStakeholders
          .slice(0, successCount)
          .map((s: any) => s.uuid);

        setImportedStakeholderUUIDs(importedUUIDs);
        setDuplicatePhonesFromServer(new Set());
        setDuplicateEmailFromServer(new Set());
        toast.dismiss();
        showGroupModal.onTrue();
      } catch (fetchError) {
        toast.warning(
          'Stakeholders imported but could not retrieve IDs for grouping.',
        );
        router.push(`/projects/aa/${id}/stakeholders?tab=stakeholders`);
      }
    } catch (error: any) {
      const message: string =
        error?.response?.data?.message || error?.message || '';

      const phoneMatch = message.match(/Phone\(s\):\s*([^|]+)/i);
      if (phoneMatch) {
        const phoneList = phoneMatch[1]
          .split(',')
          .map((p) => p.trim().replace(/^\+977/, ''))
          .filter(Boolean);
        setDuplicatePhonesFromServer(new Set(phoneList));
      }

      const emailMatch = message.match(/Email\(s\):\s*(.+)/i);
      if (emailMatch) {
        const emailList = emailMatch[1]
          .split(',')
          .map((e) => e.trim())
          .filter(Boolean);
        setDuplicateEmailFromServer(new Set(emailList));
      }
    }
  };

  const handleSampleDownload = (e) => {
    fetch(DOWNLOAD_FILE_URL)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'stakeholder.xlsx');
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        toast.error('Error downloading file!' + error);
      });
  };

  // Empty required fields warning
  React.useEffect(() => {
    if (data.length > 1 && hasEmptyRequiredFields()) {
      toast.error('Fill all required fields first');
    }
  }, [data]);

  // Duplicate phone numbers in uploaded file
  React.useEffect(() => {
    if (duplicatePhonesOnUpload.size > 1) {
      toast.warn(
        `⚠️ ${duplicatePhonesOnUpload.size} duplicate phone number(s) found in uploaded file. They have been highlighted in red.`,
        { autoClose: 5000 },
      );
    }
  }, [duplicatePhonesOnUpload]);

  // Duplicate emails in uploaded file
  React.useEffect(() => {
    if (duplicateEmails.size > 1) {
      toast.warn(
        `⚠️ ${duplicateEmails.size} duplicate email address(es) found in uploaded file. They have been highlighted in yellow.`,
        { autoClose: 5000 },
      );
    }
  }, [duplicateEmails]);

  // Group creation handler
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName.trim()) {
      setGroupError('Group name is required');
      return;
    }

    const existingGroups = stakeholdersGroupsData?.data || [];
    const groupExists = existingGroups?.some(
      (group: any) =>
        group.name.toLowerCase() === groupName.trim().toLowerCase(),
    );
    if (groupExists) {
      setGroupError('A group with this name already exists');
      return;
    }

    const stakeholdersList = importedStakeholderUUIDs.map((uuid) => ({ uuid }));

    try {
      await createStakeholdersGroup.mutateAsync({
        projectUUID: id,
        stakeholdersGroupPayload: {
          name: groupName,
          stakeholders: stakeholdersList,
        },
      });
      showGroupModal.onFalse();
      showGroupForm.onFalse();
      setGroupName('');
      router.push(`/projects/aa/${id}/stakeholders?tab=stakeholdersGroup`);
    } catch (error: any) {
      console.error('❌ Group creation failed:', error);
      const errorMsg =
        error?.response?.data?.message || 'Failed to create group';
      console.error('Error message:', errorMsg);
      setGroupError(errorMsg);
    }
  };

  return (
    <>
      <div
        className="p-4 compact:p-2 flex flex-col"
        style={{ height: 'calc(100vh - 80px)' }}
      >
        {/* Header */}
        <div className="shrink-0 mb-2 compact:mb-1">
          {/* Large screens: stacked */}
          <div className="compact:hidden">
            <Back path={`/projects/aa/${id}/stakeholders`} />
            <h1 className="font-semibold text-[28px]">Import Stakeholders</h1>
            <p className="ml-1 text-muted-foreground text-base">
              List of all stakeholders you can import
            </p>
          </div>
          {/* Compact screens: inline */}
          <div className="hidden compact:flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 [&>div]:mb-0">
              <Back
                path={`/projects/aa/${id}/stakeholders`}
                className="border border-gray-300 text-gray-500 rounded px-2 py-0.5 mb-0 w-auto"
              />
              <h1 className="font-semibold text-base leading-tight">
                Import Stakeholders
              </h1>
            </div>
            <Button
              onClick={handleSampleDownload}
              type="button"
              variant="outline"
              className="shrink-0 compact:h-7 compact:text-xs compact:px-2"
            >
              <CloudDownload size={16} className="mr-1" />
              Download Sample
            </Button>
          </div>
        </div>

        {/* Download Sample — large screens only */}
        <div className="compact:hidden flex justify-end mb-2 shrink-0">
          <Button
            onClick={handleSampleDownload}
            type="button"
            variant="outline"
          >
            <CloudDownload size={22} className="mr-1" />
            Download Sample
          </Button>
        </div>

        {/* File picker */}
        <div className="p-4 compact:p-2 border bg-card rounded-sm shrink-0 mb-2 compact:mb-1">
          <div className="flex justify-between space-x-2">
            <div className="relative w-full">
              <Input
                type="file"
                ref={inputRef}
                onChange={handleFileUpload}
                className="sr-only"
              />
              <div
                className="flex items-center border rounded-sm cursor-pointer w-full"
                onClick={() => inputRef.current?.click()}
              >
                <span className="flex items-center rounded-sm bg-gray-100 text-blue-400 px-4 py-2 compact:px-2 compact:py-1 compact:text-xs font-semibold text-sm hover:bg-gray-200 transition-colors space-x-3">
                  {selectedFile ? (
                    <>
                      <Repeat2 size={18} className="px-0.5" /> Replace
                    </>
                  ) : (
                    <>
                      <Share size={18} className="px-0.5" /> Choose File
                    </>
                  )}
                </span>
                <span className="px-4 py-2 compact:px-2 compact:py-1 compact:text-xs flex-grow truncate">
                  {fileName}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Table — flex-1 to fill remaining space */}
        {data.length > 1 && (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="border-2 border-dashed border-black flex-1 min-h-0">
              <ScrollArea className="h-full w-full">
                <Table className="table-auto w-full">
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead
                            key={header.id}
                            className="truncate max-w-[150px] sticky top-0 bg-card compact:h-8 compact:px-2 compact:text-xs"
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
                      <TableRow
                        key={row.id}
                        className="compact:[&_td]:px-2 compact:[&_td]:py-1 compact:[&_td]:text-xs"
                      >
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
            <div className="shrink-0 compact:[&_button]:h-6 compact:[&_button]:w-6 compact:[&_button]:p-0 compact:[&_.text-sm]:text-xs compact:[&_[role='combobox']]:h-6 compact:[&_[role='combobox']]:text-xs compact:[&_[role='combobox']]:w-12">
              <ClientSidePagination table={table} />
            </div>
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div className="flex justify-between items-center py-2 px-4 compact:py-1 compact:px-2 border-t shrink-0">
        <div className="compact:text-xs">
          {data?.length ? <p>Total Count: {data?.length - 1 ?? 0}</p> : null}
        </div>
        <div className="flex space-x-2">
          <Button
            type="button"
            className="w-48 compact:w-auto compact:text-xs compact:h-8 compact:px-3"
            variant="outline"
            onClick={() => {
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
            }}
          >
            Clear
          </Button>
          <Button
            className="w-48 compact:w-auto compact:text-xs compact:h-8 compact:px-3 bg-primary hover:ring-2 ring-primary"
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

      {/* Group Creation Modal */}
      <Dialog
        open={showGroupModal.value}
        onOpenChange={(open) => {
          if (!open) {
            showGroupModal.onFalse();
            showGroupForm.onFalse();
            setGroupName('');
            setGroupError('');
          }
        }}
      >
        <DialogContent className="rounded-sm max-w-md">
          {!showGroupForm.value ? (
            // Initial confirmation
            <>
              <DialogHeader>
                <DialogTitle className="text-center text-primary">
                  Import Successful
                </DialogTitle>
                <DialogDescription className="text-center">
                  {importedStakeholderUUIDs.length}{' '}
                  {importedStakeholderUUIDs.length === 1
                    ? 'stakeholder has'
                    : 'stakeholders have'}{' '}
                  been added to stakeholder list.
                </DialogDescription>
              </DialogHeader>

              <p className="text-sm text-black mb-2 font-medium">
                Would you like to organize them into a group?
              </p>

              <div className="space-y-2 mb-2">
                {/* Create a Group card */}
                <div className="border hover-bg-blue-50/40 rounded-sm overflow-hidden">
                  <div className="w-full text-left p-4 transition-colors">
                    <div className="flex items-start gap-3">
                      <Users
                        size={30}
                        className="px-1 mt-1 text-primary bg-gray-100 rounded-sm"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">
                            Create a Group
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-sm bg-gray-100 font-semibold text-blue-600">
                            RECOMMENDED
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Name and organize these stakeholders for streamlined
                          communication and bulk actions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skip for Now card */}
                <div className="border border-gray-200 rounded-sm overflow-hidden">
                  <div className="w-full text-left p-4 transition-colors">
                    <div className="flex items-start gap-3">
                      <X
                        size={30}
                        className="px-1 mt-0.5 text-primary rounded-sm bg-gray-100"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-800">
                            Skip for Now
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Stakeholders are saved individually. You can group
                          them anytime from the stakeholder list.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    showGroupModal.onFalse();
                    toast.success('Stakeholders imported successfully!');
                    router.push(
                      `/projects/aa/${id}/stakeholders?tab=stakeholders`,
                    );
                  }}
                >
                  Skip
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => showGroupForm.onTrue()}
                >
                  Create Group
                </Button>
              </div>
            </>
          ) : (
            <form onSubmit={handleCreateGroup}>
              <DialogHeader>
                <DialogTitle>Create Stakeholder Group</DialogTitle>
                <DialogDescription>
                  Creating a group for {importedStakeholderUUIDs.length}{' '}
                  imported{' '}
                  {importedStakeholderUUIDs.length === 1
                    ? 'stakeholder'
                    : 'stakeholders'}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 mb-4">
                <label className="block text-sm font-medium mb-2">
                  Group Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={groupName}
                  onChange={(e) => {
                    setGroupName(e.target.value);
                    setGroupError('');
                  }}
                  placeholder="Enter group name"
                  className="w-full"
                  autoFocus
                />
                {groupError && (
                  <p className="text-red-500 text-xs mt-1">{groupError}</p>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-sm"
                  onClick={() => {
                    showGroupForm.onFalse();
                    setGroupName('');
                    setGroupError('');
                  }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-sm"
                  disabled={createStakeholdersGroup.isPending}
                >
                  {createStakeholdersGroup.isPending
                    ? 'Creating...'
                    : 'Create Group'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
