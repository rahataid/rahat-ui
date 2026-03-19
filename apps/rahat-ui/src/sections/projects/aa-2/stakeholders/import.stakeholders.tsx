'use client';

import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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

import { ClientSidePagination, HeaderWithBack } from 'apps/rahat-ui/src/common';
import {
  CloudDownload,
  FileWarning,
  Info,
  Repeat2,
  Share,
  Users,
  X,
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  useUploadStakeholders,
  useValidateStakeholders,
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
import {
  isEmailHeader,
  isPhoneHeader,
  isValidExtension,
  normalizePhone,
} from './stakeholders.helpers';
import {
  ALLOWED_EXTENSIONS,
  CELL_STYLES,
  FileExtension,
  REQUIRED_HEADERS,
} from './stakeholders.consts';
interface ValidationError {
  phone?: string;
  email?: string;
  field: string;
  message: string;
}

interface ValidationResponse {
  newStakeholders: string[];
  updateStakeholders: string[];
  cleanedPayloads: unknown[];
  isValid: boolean;
  errors: ValidationError[];
}

export default function ImportStakeholder() {
  // Constants goes here
  const DOWNLOAD_FILE_URL = '/files/stakeholder-sample.xlsx';
  const VALIDATION_COOLDOWN_SECONDS = 5;
  const MAX_STAKEHOLDERS_PER_UPLOAD = 100;
  const DEFAULT_PAGE_SIZE = 10;

  // Router goes here
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Query goes here
  const uploadStakeholders = useUploadStakeholders();
  const validateStakeholders = useValidateStakeholders();
  const { data: stakeholdersGroupsData } = useStakeholdersGroups(id, {
    sort: 'createdAt',
    order: 'desc',
  });

  // File State goes here
  const [data, setData] = useState<string[][]>([]);
  const [fileName, setFileName] = useState('No File Choosen');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Modal State goes here
  const showGroupModal = useBoolean();
  const showGroupForm = useBoolean();
  const [groupName, setGroupName] = useState('');
  const [groupError, setGroupError] = useState('');

  // Validation State goes here
  const [isValidating, setIsValidating] = useState(false);
  const [validationCooldown, setValidationCooldown] = useState(0);
  const [validationResponse, setValidationResponse] =
    useState<ValidationResponse | null>(null);

  // Frontend validation states goes here
  const [newStakeholderPhones, setNewStakeholderPhones] = useState<Set<string>>(
    new Set(),
  );
  const [updateStakeholderPhones, setUpdateStakeholderPhones] = useState<
    Set<string>
  >(new Set());
  const [errorPhones, setErrorPhones] = useState<Set<string>>(new Set());
  const [errorEmails, setErrorEmails] = useState<Set<string>>(new Set());
  const [errorMap, setErrorMap] = useState<Map<string, string>>(new Map());
  const [duplicatePhonesInFile, setDuplicatePhonesInFile] = useState<
    Set<string>
  >(new Set());
  const [duplicateEmailsInFile, setDuplicateEmailsInFile] = useState<
    Set<string>
  >(new Set());

  // Derived functions goes here
  const hasValidationErrors =
    validationResponse !== null && !validationResponse.isValid;
  const isValidated = validationResponse !== null && validationResponse.isValid;
  const hasFrontendErrors =
    duplicatePhonesInFile.size > 0 || duplicateEmailsInFile.size > 0;
  const tableData = useMemo(() => data.slice(1), [data]);
  const headers = useMemo(() => data[0] ?? [], [data]);

  // Effect goes here
  useEffect(() => {
    if (validationCooldown <= 0) return;

    const timer = setTimeout(() => {
      setValidationCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [validationCooldown]);

  // Handlers goes here
  const getRowPhone = useCallback(
    (row: string[]): string => {
      const phoneIndex = headers.findIndex((h) =>
        isPhoneHeader(h?.toString() ?? ''),
      );
      if (phoneIndex === -1) return '';
      return normalizePhone(row[phoneIndex]?.toString().trim() ?? '');
    },
    [headers],
  );

  const hasEmptyRequiredFields = useCallback((): boolean => {
    if (data.length < 2) return true;

    const normalizedHeaders = headers.map((h) =>
      h?.toString().toLowerCase().trim(),
    );

    return data.slice(1).some((row) =>
      REQUIRED_HEADERS.some((header) => {
        const index = normalizedHeaders.indexOf(header);
        if (index === -1) return true;
        const cell = row[index];
        return !cell || cell.toString().trim() === '';
      }),
    );
  }, [data, headers]);

  const resetValidationState = useCallback(() => {
    setValidationResponse(null);
    setNewStakeholderPhones(new Set());
    setUpdateStakeholderPhones(new Set());
    setErrorPhones(new Set());
    setErrorEmails(new Set());
    setErrorMap(new Map());
    setDuplicatePhonesInFile(new Set());
    setDuplicateEmailsInFile(new Set());
  }, []);

  // Table helpers goes here
  const getCellHighlight = useCallback(
    (params: {
      isMissing: boolean;
      isDuplicatePhoneInFile: boolean;
      isDuplicateEmailInFile: boolean;
      isErrorPhone: boolean;
      isErrorEmail: boolean;
      isUpdateStakeholder: boolean;
      isNewStakeholder: boolean;
      errorMessage: string;
    }): { className: string; tooltipMessage: string } => {
      const {
        isMissing,
        isDuplicatePhoneInFile,
        isDuplicateEmailInFile,
        isErrorPhone,
        isErrorEmail,
        isUpdateStakeholder,
        isNewStakeholder,
        errorMessage,
      } = params;

      if (isMissing) {
        return {
          className: CELL_STYLES.missing,
          tooltipMessage: 'Required field is missing',
        };
      }
      if (isDuplicatePhoneInFile) {
        return {
          className: CELL_STYLES.duplicatePhone,
          tooltipMessage: 'Duplicate phone number in file',
        };
      }
      if (isDuplicateEmailInFile) {
        return {
          className: CELL_STYLES.duplicateEmail,
          tooltipMessage: 'Duplicate email in file',
        };
      }
      if (isErrorPhone || isErrorEmail) {
        return {
          className: CELL_STYLES.error,
          tooltipMessage: errorMessage || 'Validation error',
        };
      }
      if (isUpdateStakeholder) {
        return {
          className: CELL_STYLES.update,
          tooltipMessage:
            'This data will overwrite existing stakeholder record',
        };
      }
      if (isNewStakeholder) {
        return {
          className: CELL_STYLES.new,
          tooltipMessage: 'New stakeholder',
        };
      }
      return { className: '', tooltipMessage: '' };
    },
    [],
  );

  // Table goes here
  const columns = useMemo<ColumnDef<string[]>[]>(() => {
    if (!headers.length) return [];

    return headers.map((header, index) => ({
      accessorFn: (row: string[]) => row[index],
      id: `col-${index}`,
      header: () => header || `Column ${index + 1}`,
      cell: ({ getValue, row }) => {
        const value = getValue() as string;
        const headerText = header?.toString().toLowerCase() ?? '';
        const valueStr = value?.toString().trim() ?? '';

        const isPhone = isPhoneHeader(headerText);
        const isEmail = isEmailHeader(headerText);
        const normalizedPhone = isPhone ? normalizePhone(valueStr) : '';
        const rowPhone = getRowPhone(row.original);

        const { className, tooltipMessage } = getCellHighlight({
          isMissing:
            REQUIRED_HEADERS.includes(
              headerText as (typeof REQUIRED_HEADERS)[number],
            ) && !valueStr,
          isDuplicatePhoneInFile:
            isPhone && duplicatePhonesInFile.has(valueStr),
          isDuplicateEmailInFile:
            isEmail && duplicateEmailsInFile.has(valueStr.toLowerCase()),
          isErrorPhone: isPhone && errorPhones.has(normalizedPhone),
          isErrorEmail: isEmail && errorEmails.has(valueStr),
          isUpdateStakeholder: updateStakeholderPhones.has(rowPhone),
          isNewStakeholder: newStakeholderPhones.has(rowPhone),
          errorMessage:
            errorMap.get(normalizedPhone) || errorMap.get(valueStr) || '',
        });

        return (
          <TableCell
            className={`truncate max-w-[150px] cursor-pointer ${className}`}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-block w-full min-h-[1.5rem]">
                    {valueStr || '--'}
                  </span>
                </TooltipTrigger>
                {tooltipMessage && (
                  <TooltipContent side="top">{tooltipMessage}</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </TableCell>
        );
      },
    }));
  }, [
    headers,
    getRowPhone,
    getCellHighlight,
    newStakeholderPhones,
    updateStakeholderPhones,
    errorPhones,
    errorEmails,
    errorMap,
    duplicatePhonesInFile,
    duplicateEmailsInFile,
  ]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: DEFAULT_PAGE_SIZE, pageIndex: 0 },
    },
  });

  // Handlers goes here
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      resetValidationState();
      setData([]);
      setFileName(file?.name ?? 'No File Choosen');
      setSelectedFile(file ?? null);

      if (!file) return;

      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !isValidExtension(extension)) {
        toast.error(
          'Unsupported file format. Please upload an Excel, JSON, or CSV file.',
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json(ws, {
          header: 1,
        }) as string[][];

        const filteredData = rawData.filter((row) =>
          row.some(
            (cell) => cell !== null && cell !== undefined && cell !== '',
          ),
        );

        if (filteredData.length === 0) {
          toast.error('No data found in the file');
          return;
        }

        const fileHeaders = filteredData[0];
        const columnCount = fileHeaders.length;
        const normalizedHeaders = fileHeaders.map((h) =>
          h?.toString().toLowerCase().trim(),
        );

        // Validate required headers
        for (const required of REQUIRED_HEADERS) {
          if (!normalizedHeaders.includes(required)) {
            toast.error(
              `File is missing the required field: "${required}". Download the sample file for reference.`,
              { autoClose: 5000 },
            );
            return;
          }
        }

        const phoneIndex = fileHeaders.findIndex((h) =>
          isPhoneHeader(h?.toString() ?? ''),
        );
        const emailIndex = fileHeaders.findIndex((h) =>
          isEmailHeader(h?.toString() ?? ''),
        );

        const seenPhones = new Set<string>();
        const duplicatePhones = new Set<string>();
        const seenEmails = new Set<string>();
        const duplicateEmails = new Set<string>();

        const normalizedData = filteredData.map((row, idx) => {
          const newRow = [...row];
          while (newRow.length < columnCount) newRow.push('');

          if (idx === 0) return newRow;

          // Check for duplicate phones
          if (phoneIndex !== -1) {
            const phone = newRow[phoneIndex]?.toString().trim() ?? '';
            if (phone) {
              if (seenPhones.has(phone)) duplicatePhones.add(phone);
              seenPhones.add(phone);
            }
          }

          // Check for duplicate emails
          if (emailIndex !== -1) {
            const email =
              newRow[emailIndex]?.toString().trim().toLowerCase() ?? '';
            if (email) {
              if (seenEmails.has(email)) duplicateEmails.add(email);
              seenEmails.add(email);
            }
          }

          return newRow;
        });

        // Validate row count
        if (normalizedData.length === 1) {
          toast.error('No stakeholders found in the file');
          return;
        }
        if (normalizedData.length > MAX_STAKEHOLDERS_PER_UPLOAD + 1) {
          toast.error(
            `Maximum ${MAX_STAKEHOLDERS_PER_UPLOAD} stakeholders can be uploaded at a time`,
          );
          return;
        }

        setDuplicatePhonesInFile(duplicatePhones);
        setDuplicateEmailsInFile(duplicateEmails);
        setData(normalizedData);

        if (duplicatePhones.size > 0) {
          toast.warn(
            `${duplicatePhones.size} duplicate phone number(s) found in file`,
            { autoClose: 5000 },
          );
        }
        if (duplicateEmails.size > 0) {
          toast.warn(
            `${duplicateEmails.size} duplicate email(s) found in file`,
            { autoClose: 5000 },
          );
        }
      };

      reader.readAsBinaryString(file);
    },
    [resetValidationState],
  );

  const handleValidate = useCallback(async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    if (hasEmptyRequiredFields()) {
      toast.error('Fill all required fields first');
      return;
    }

    if (hasFrontendErrors) {
      toast.error(
        'Fix the duplicate phone/email errors highlighted in the sheet',
      );
      return;
    }

    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!extension || !isValidExtension(extension)) {
      toast.error('Unsupported file format');
      return;
    }

    setIsValidating(true);
    try {
      const response = await validateStakeholders.mutateAsync({
        selectedFile,
        doctype: ALLOWED_EXTENSIONS[extension],
        projectId: id,
      });

      const validationData = response?.data as ValidationResponse;
      setValidationResponse(validationData);

      const newPhones = new Set(validationData.newStakeholders ?? []);
      const updatePhones = new Set(validationData.updateStakeholders ?? []);
      const errPhones = new Set<string>();
      const errEmails = new Set<string>();
      const errMap = new Map<string, string>();

      validationData.errors?.forEach((err) => {
        if (err.field === 'phone' && err.phone) {
          errPhones.add(err.phone);
          errMap.set(err.phone, err.message);
        }
        if (err.field === 'email' && err.email) {
          errEmails.add(err.email);
          errMap.set(err.email, err.message);
        }
      });

      setNewStakeholderPhones(newPhones);
      setUpdateStakeholderPhones(updatePhones);
      setErrorPhones(errPhones);
      setErrorEmails(errEmails);
      setErrorMap(errMap);

      if (validationData.errors?.length > 0) {
        toast.error(
          `${validationData.errors.length} validation error(s) found. Fix the errors highlighted in the sheet.`,
        );
        setValidationCooldown(VALIDATION_COOLDOWN_SECONDS);
      } else {
        toast.success(
          'Validation successful! You can now import the stakeholders.',
        );
      }
    } catch (error: unknown) {
      const errMsg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? 'Validation failed';
      toast.error(errMsg);
      setValidationCooldown(VALIDATION_COOLDOWN_SECONDS);
    } finally {
      setIsValidating(false);
    }
  }, [
    selectedFile,
    hasEmptyRequiredFields,
    hasFrontendErrors,
    validateStakeholders,
    id,
  ]);

  const handleUpload = useCallback(() => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    if (hasValidationErrors) {
      toast.error('Fix the errors highlighted in the sheet before importing');
      return;
    }

    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!extension || !isValidExtension(extension)) {
      toast.error(
        'Unsupported file format. Please upload an Excel, JSON, or CSV file.',
      );
      return;
    }

    showGroupModal.onTrue();
  }, [selectedFile, hasValidationErrors, showGroupModal]);

  // Actual upload handler for uploading after validation is complete along with group name
  const handleActualUpload = useCallback(
    async (isGroupCreate: boolean, groupNameValue?: string) => {
      if (!selectedFile) return;

      const extension = selectedFile.name
        .split('.')
        .pop()
        ?.toLowerCase() as FileExtension;
      const doctype = ALLOWED_EXTENSIONS[extension];

      try {
        const response = await uploadStakeholders.mutateAsync({
          selectedFile,
          doctype,
          projectId: id,
          isGroupCreate,
          groupName: groupNameValue,
        });

        const successCount = response?.data?.successCount ?? 0;

        const groupMsg =
          isGroupCreate && groupNameValue
            ? ` Group "${groupNameValue}" created.`
            : '';
        toast.success(
          `${successCount == 0 ? '' : successCount} ${
            successCount <= 1 ? 'Stakeholder' : 'Stakeholders'
          } imported successfully!${groupMsg}`,
        );

        resetValidationState();
        showGroupModal.onFalse();
        showGroupForm.onFalse();
        setGroupName('');

        const tab =
          isGroupCreate && groupNameValue
            ? 'stakeholdersGroup'
            : 'stakeholders';
        router.push(`/projects/aa/${id}/stakeholders?tab=${tab}`);
      } catch (error: unknown) {
        const errMsg =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? 'Import failed';
        toast.error(errMsg);
      }
    },
    [
      selectedFile,
      uploadStakeholders,
      id,
      resetValidationState,
      showGroupModal,
      showGroupForm,
      router,
    ],
  );

  // Sample download handler
  const handleSampleDownload = useCallback(() => {
    fetch(DOWNLOAD_FILE_URL)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'stakeholder.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        toast.error(`Error downloading file: ${error}`);
      });
  }, []);

  // Download errors sheet setup goes here
  const handleDownloadErrors = useCallback(() => {
    if (!validationResponse?.errors?.length || !data.length) return;

    const phoneIndex = headers.findIndex((h) =>
      isPhoneHeader(h?.toString() ?? ''),
    );
    const emailIndex = headers.findIndex((h) =>
      isEmailHeader(h?.toString() ?? ''),
    );

    const errorsByIdentifier = new Map<string, string>();
    validationResponse.errors.forEach((err) => {
      if (err.phone) errorsByIdentifier.set(err.phone, err.message);
      if (err.email) errorsByIdentifier.set(err.email, err.message);
    });

    const newHeaders = [...headers, 'Remarks'];
    const rowsWithRemarks = data.slice(1).map((row) => {
      const phone =
        phoneIndex !== -1
          ? normalizePhone(row[phoneIndex]?.toString().trim() ?? '')
          : '';
      const email =
        emailIndex !== -1 ? row[emailIndex]?.toString().trim() ?? '' : '';
      const remark =
        errorsByIdentifier.get(phone) || errorsByIdentifier.get(email) || '';
      return [...row, remark];
    });

    const wsData = [newHeaders, ...rowsWithRemarks];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stakeholders');
    XLSX.writeFile(wb, 'stakeholder-errors.xlsx');
  }, [validationResponse, data, headers]);

  const handleClear = useCallback(() => {
    setData([]);
    setFileName('No File Choosen');
    setSelectedFile(null);
    resetValidationState();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [resetValidationState]);

  const handleGroupImport = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const trimmedName = groupName.trim();
      if (!trimmedName) {
        setGroupError('Group name is required');
        return;
      }

      const existingGroups = stakeholdersGroupsData?.data ?? [];
      const groupExists = existingGroups.some(
        (group: { name: string }) =>
          group.name.toLowerCase() === trimmedName.toLowerCase(),
      );

      if (groupExists) {
        setGroupError('A group with this name already exists');
        return;
      }

      await handleActualUpload(true, trimmedName);
    },
    [groupName, stakeholdersGroupsData, handleActualUpload],
  );

  const validateButtonText = useMemo(() => {
    if (isValidating) return 'Validating...';
    if (validationCooldown > 0) return `Validate (${validationCooldown}s)`;
    return 'Validate';
  }, [isValidating, validationCooldown]);

  const isValidateDisabled =
    data.length === 0 || isValidating || validationCooldown > 0;
  const isImportDisabled = data.length === 0 || uploadStakeholders.isPending;

  return (
    <>
      <div className="p-4  h-[calc(100vh-120px)]">
        <div className="flex justify-between items-start mb-2">
          <HeaderWithBack
            title="Import Stakeholders"
            subtitle="List of all stakeholders you can import"
            path={`/projects/aa/${id}/stakeholders`}
          />
          <div className="flex flex-col items-end gap-2 mt-4">
            <div className="flex gap-2">
              {hasValidationErrors && (
                <Button
                  onClick={handleDownloadErrors}
                  type="button"
                  variant="outline"
                >
                  <FileWarning size={22} className="mr-1" />
                  Download Errors
                </Button>
              )}
              <Button
                onClick={handleSampleDownload}
                type="button"
                variant="outline"
              >
                <CloudDownload size={22} className="mr-1" />
                Download Sample
              </Button>
            </div>
            {(hasFrontendErrors || validationResponse !== null) &&
              data.length > 1 && (
                <div className="flex flex-col gap-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
                  {hasFrontendErrors && (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-sm bg-red-200 border border-red-400" />
                        <span>Duplicate phone number found in file</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-sm bg-yellow-200 border border-yellow-400" />
                        <span>Duplicate email found in file</span>
                      </div>
                    </>
                  )}
                  {hasValidationErrors && (
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm bg-red-200 border border-red-400" />
                      <span>Validation error - invalid or duplicate data</span>
                    </div>
                  )}
                  {validationResponse !== null &&
                    newStakeholderPhones.size > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-sm bg-green-200 border border-green-400" />
                        <span>New stakeholder will be created</span>
                      </div>
                    )}
                  {validationResponse !== null &&
                    updateStakeholderPhones.size > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-sm bg-yellow-200 border border-yellow-400" />
                        <span>Existing stakeholder will be updated</span>
                      </div>
                    )}
                </div>
              )}
          </div>
        </div>

        <div className="p-4 border bg-card rounded-sm">
          <div className="flex items-center gap-4">
            {/* File Input */}
            <div className="relative flex-shrink-0">
              <Input
                type="file"
                ref={inputRef}
                onChange={handleFileUpload}
                className="sr-only"
              />

              <div
                className="flex items-center border rounded-sm cursor-pointer"
                onClick={() => inputRef.current?.click()}
              >
                <span className="flex items-center rounded-sm bg-gray-100 text-blue-400 px-3 py-2 font-semibold text-sm hover:bg-gray-200 transition-colors whitespace-nowrap">
                  {selectedFile ? (
                    <>
                      <Repeat2 size={18} className="mr-1" /> Replace
                    </>
                  ) : (
                    <>
                      <Share size={18} className="mr-1" />
                      Choose File
                    </>
                  )}
                </span>
                <span className="px-3 py-2 truncate max-w-[150px]">
                  {fileName}
                </span>
              </div>
            </div>
          </div>
        </div>

        <>
          {data.length > 1 && (
            <>
              <div className="border-2 border-dashed border-black mt-4 mx-auto w-full">
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
                      {table.getRowModel().rows.map((row) => {
                        const rowPhone = getRowPhone(row.original);
                        const isUpdateRow =
                          updateStakeholderPhones.has(rowPhone);
                        return (
                          <TableRow
                            key={row.id}
                            className={isUpdateRow ? 'bg-yellow-50' : ''}
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
                        );
                      })}
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
        <div>{data?.length > 0 && <p>Total Count: {data.length - 1}</p>}</div>
        <div className="flex space-x-2">
          <Button
            type="button"
            className="w-48"
            variant="outline"
            onClick={handleClear}
          >
            Clear
          </Button>

          {isValidated ? (
            <Button
              className="w-48 bg-primary hover:ring-2 ring-primary"
              onClick={handleUpload}
              disabled={isImportDisabled}
            >
              {uploadStakeholders.isPending ? 'Importing...' : 'Import'}
            </Button>
          ) : (
            <Button
              className="w-48 bg-primary hover:ring-2 ring-primary"
              onClick={handleValidate}
              disabled={isValidateDisabled}
            >
              {validateButtonText}
            </Button>
          )}
        </div>
      </div>

      <Dialog
        open={showGroupModal.value}
        onOpenChange={(open) => {
          if (!open && !uploadStakeholders.isPending) {
            showGroupModal.onFalse();
            showGroupForm.onFalse();
            setGroupName('');
            setGroupError('');
          }
        }}
      >
        <DialogContent className="rounded-sm max-w-md">
          {!showGroupForm.value ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-center text-primary">
                  Create a Group?
                </DialogTitle>
                <DialogDescription className="text-center">
                  Would you like to organize the imported stakeholders into a
                  group?
                </DialogDescription>
              </DialogHeader>

              <p className="text-sm text-black mb-2 font-medium">
                Choose an option below:
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
                  disabled={uploadStakeholders.isPending}
                  onClick={() => handleActualUpload(false)}
                >
                  {uploadStakeholders.isPending ? 'Importing...' : 'Skip'}
                </Button>
                <Button
                  className="flex-1"
                  disabled={uploadStakeholders.isPending}
                  onClick={() => showGroupForm.onTrue()}
                >
                  Create Group
                </Button>
              </div>
            </>
          ) : (
            <form onSubmit={handleGroupImport}>
              <DialogHeader>
                <DialogTitle>Create Stakeholder Group</DialogTitle>
                <DialogDescription>
                  Enter a name for the group to organize the imported
                  stakeholders.
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
                  disabled={uploadStakeholders.isPending}
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
                  disabled={uploadStakeholders.isPending}
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
                  disabled={uploadStakeholders.isPending}
                >
                  {uploadStakeholders.isPending
                    ? 'Importing...'
                    : 'Import with Group'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
