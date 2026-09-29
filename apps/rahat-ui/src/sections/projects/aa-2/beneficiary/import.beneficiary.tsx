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
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/components/dialog';
import { CloudDownload, Repeat2, Share } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormField } from '@rahat-ui/shadcn/src/components/ui/form';
import DropdownSearch from 'apps/rahat-ui/src/common/search.dropdown';
import {
  useBeneficiariesGroups,
  useUploadBeneficiariesToGroup,
  useUploadBeneficiary,
} from '@rahat-ui/query';
import { toast } from 'react-toastify';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { UUID } from 'crypto';
import { HeaderWithBack, ClientSidePagination } from 'apps/rahat-ui/src/common';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

const SAMPLE_BENEFICIARY_HEADERS = [
  'Name*',
  'Phone Number',
  'Gender',
  'Age',
  'Government ID',
  'Location',
  'UUID',
];

const allowedExtensions: { [key: string]: string } = {
  xlsx: 'excel',
  xls: 'excel',
  json: 'json',
  csv: 'csv',
};

export default function AAImportBeneficiary() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const [data, setData] = useState<string[][]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'choose' | 'create' | 'select'>(
    'choose',
  );
  const [groupNameInput, setGroupNameInput] = useState('');
  const [selectedGroupUuid, setSelectedGroupUuid] = useState('');

  const groupForm = useForm<{ groupUuid: string }>({
    defaultValues: { groupUuid: '' },
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadBeneficiary = useUploadBeneficiary();
  const uploadToGroup = useUploadBeneficiariesToGroup();

  const { data: groupsData } = useBeneficiariesGroups(id, {
    page: 1,
    perPage: 100,
    sort: 'updatedAt',
    order: 'desc',
  });
  const existingGroups: any[] = groupsData?.data ?? [];

  const backPath = `/projects/aa/${id}/beneficiary`;

  const tableData = React.useMemo(() => data.slice(1), [data]);
  const headers = React.useMemo(() => data[0] ?? [], [data]);

  const columns = React.useMemo<ColumnDef<string[]>[]>(() => {
    if (!headers.length) return [];
    return headers.map((header, index) => ({
      accessorFn: (row: string[]) => row[index],
      id: `col-${index}`,
      header: () => header || `Column ${index + 1}`,
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return value?.toString().trim() || '--';
      },
    }));
  }, [headers]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file?.name as string);
    if (file) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !allowedExtensions[extension]) {
        toast.error(tg('UNSUPPORTED_FILE_FORMAT'));
        return;
      }
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

  const doUpload = async (
    mode: 'create' | 'append',
    opts?: { groupName?: string; groupUuid?: string },
  ) => {
    if (!selectedFile) return toast.error(tg('PLEASE_SELECT_A_FILE_TO_UPLOAD'));

    const extension = selectedFile.name.split('.').pop()?.toLowerCase();
    const doctype = extension ? allowedExtensions[extension] : '';

    if (mode === 'append' && opts?.groupUuid) {
      const response = await uploadToGroup.mutateAsync({
        selectedFile,
        doctype,
        groupUuid: opts.groupUuid,
      });
      const inner = (response as any)?.data ?? response;
      const added = (inner as any)?.addedToGroup ?? (inner as any)?.added ?? 0;
      if (added > 0) {
        router.push(
          `/projects/aa/${id}/beneficiary/groupDetails/${opts.groupUuid}`,
        );
      }
      return;
    }

    const response = await uploadBeneficiary.mutateAsync({
      selectedFile,
      doctype,
      projectId: id,
      groupName: opts?.groupName,
      groupPurpose: opts?.groupName ? 'GENERAL' : undefined,
    });
    if (response?.data?.success || (response as any)?.success) {
      router.push(`${backPath}?tab=beneficiaryGroups`);
    }
  };

  const handleUpload = async (groupName?: string) =>
    doUpload('create', { groupName });

  const handleAddClick = () => {
    if (!selectedFile) {
      toast.error(tg('PLEASE_SELECT_A_FILE_TO_UPLOAD'));
      return;
    }
    setGroupNameInput('');
    setSelectedGroupUuid('');
    groupForm.reset({ groupUuid: '' });
    setDialogMode('choose');
    setShowGroupDialog(true);
  };

  const handleCreateGroupSubmit = async () => {
    const trimmedName = groupNameInput.trim();
    if (!trimmedName) {
      toast.error(tg('PLEASE_ENTER_A_GROUP_NAME'));
      return;
    }
    setShowGroupDialog(false);
    await handleUpload(trimmedName);
  };

  const handleSelectGroupSubmit = async () => {
    if (!selectedGroupUuid) {
      toast.error(tg('PLEASE_SELECT_A_GROUP'));
      return;
    }
    setShowGroupDialog(false);
    await doUpload('append', { groupUuid: selectedGroupUuid });
  };

  const handleDownloadSample = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([SAMPLE_BENEFICIARY_HEADERS]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Beneficiaries');
    XLSX.writeFile(workbook, 'beneficiary_sample.xlsx');
  };

  const handleClear = () => {
    setData([]);
    setFileName('');
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <>
      <div className="flex flex-col min-h-[calc(100vh-200px)] min-w-0">
        <div className="p-4 flex flex-col flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <HeaderWithBack
              title={tg('IMPORT_BENEFICIARIES')}
              subtitle={tg('SELECT_BENEFICIARY_FILE_TO_UPDATE')}
              path={backPath}
            />
            <div className="flex flex-col items-end gap-2 mt-4">
              <div className="flex gap-2">
                <Button
                  onClick={handleDownloadSample}
                  type="button"
                  variant="outline"
                  className=" h-[clamp(28px,3vw,36px)] px-[clamp(8px,1vw,16px)] text-[clamp(11px,1vw,14px)] [&_svg]:size-[clamp(14px,1.4vw,18px)]"
                >
                  <CloudDownload className="mr-1" />
                  {tg('DOWNLOAD_SAMPLE')}
                </Button>
              </div>
            </div>
          </div>

          <div className="p-[clamp(8px,1vw,12px)] border bg-card rounded-sm">
            <div className="flex items-center gap-4 w-full">
              <div className="relative w-full">
                <Input
                  type="file"
                  ref={inputRef}
                  onChange={handleFileUpload}
                  className="sr-only"
                />
                <div
                  className="flex items-center border rounded cursor-pointer w-full"
                  onClick={() => inputRef.current?.click()}
                >
                  <span className="flex items-center rounded bg-gray-100 text-blue-400 px-[clamp(8px,1vw,12px)] h-[clamp(28px,3vw,36px)] font-semibold text-[clamp(11px,1vw,14px)] hover:bg-gray-200 transition-colors whitespace-nowrap [&_svg]:size-[clamp(14px,1.4vw,18px)]">
                    {selectedFile ? (
                      <>
                        <Repeat2 className="mr-1" /> {tg('REPLACE')}
                      </>
                    ) : (
                      <>
                        <Share className="mr-1" />
                        {tg('CHOOSE_FILE')}
                      </>
                    )}
                  </span>
                  <span className="px-3 text-[clamp(11px,1vw,14px)] truncate w-full">
                    {fileName || tg('NO_FILE_CHOSEN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {data.length > 1 && (
            <div className="flex flex-col min-w-0 mt-4">
              <div className="border-2 border-dashed border-black w-full min-w-0">
                <div className="w-full max-h-[50vh] overflow-y-auto overflow-x-auto">
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
                            <TableCell
                              key={cell.id}
                              className="truncate max-w-[150px] overflow-hidden"
                            >
                              {
                                flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                ) as React.ReactNode
                              }
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <ClientSidePagination table={table} />
            </div>
          )}
        </div>
        <div className="flex justify-between items-center py-2 px-4 border-t mt-4 sticky bottom-0 bg-background z-10">
          <div>
            {data?.length > 0 && (
              <p className="text-[clamp(11px,1vw,14px)] text-muted-foreground">
                {tg('TOTAL_COUNT')}: {formatNum(data.length - 1)}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              className="min-w-[clamp(60px,8vw,120px)] h-[clamp(28px,3vw,36px)] px-[clamp(8px,1vw,16px)] text-[clamp(11px,1vw,14px)]"
              variant="outline"
              onClick={handleClear}
            >
              {tg('CLEAR')}
            </Button>
            <Button
              className="min-w-[clamp(60px,8vw,120px)] h-[clamp(28px,3vw,36px)] px-[clamp(8px,1vw,16px)] text-[clamp(11px,1vw,14px)] bg-primary hover:ring-2 ring-primary"
              onClick={handleAddClick}
              disabled={
                uploadBeneficiary?.isPending ||
                uploadToGroup?.isPending ||
                !data?.length
              }
            >
              {uploadBeneficiary?.isPending || uploadToGroup?.isPending ? (
                <>{tg('UPLOADING')}</>
              ) : (
                tg('ADD')
              )}
            </Button>
          </div>
        </div>
      </div>
      <Dialog
        open={showGroupDialog}
        onOpenChange={setShowGroupDialog}
        modal={false}
      >
        <DialogContent className="rounded-sm max-w-md">
          <DialogHeader>
            <DialogTitle>{tg('IMPORT_BENEFICIARIES')}</DialogTitle>
            <DialogDescription>
              {dialogMode === 'select'
                ? tg('SELECT_BENEFICIARY_GROUP')
                : dialogMode === 'create'
                ? tg('ENTER_A_NAME_FOR_THE_NEW_GROUP')
                : tg('CHOOSE_GROUP_IMPORT_OPTION')}
            </DialogDescription>
          </DialogHeader>
          {dialogMode === 'choose' ? (
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setDialogMode('create')}
              >
                {tg('CREATE_GROUP')}
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={() => setDialogMode('select')}
              >
                {tg('SELECT_GROUP')}
              </Button>
            </div>
          ) : dialogMode === 'select' ? (
            <div className="space-y-4 pt-2">
              <Form {...groupForm}>
                <FormField
                  control={groupForm.control}
                  name="groupUuid"
                  render={({ field }) => (
                    <DropdownSearch
                      selectedLabel={
                        existingGroups.find((g: any) => g.uuid === field.value)
                          ?.name
                      }
                      placeholder={tg('SELECT_BENEFICIARY_GROUP')}
                      searchPlaceholder={tg('SEARCH_GROUP')}
                      emptyMessage={tg('NO_GROUPS_FOUND')}
                      options={existingGroups.map((g: any) => ({
                        label: g.name,
                        value: g.uuid,
                        data: g,
                      }))}
                      onSelect={(data: Record<string, any>) => {
                        field.onChange(data.uuid);
                        setSelectedGroupUuid(data.uuid);
                      }}
                    />
                  )}
                />
              </Form>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDialogMode('choose')}
                >
                  {tg('BACK')}
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  onClick={handleSelectGroupSubmit}
                  disabled={uploadToGroup?.isPending || !selectedGroupUuid}
                >
                  {tg('SUBMIT')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <Input
                type="text"
                value={groupNameInput}
                onChange={(e) => setGroupNameInput(e.target.value)}
                placeholder={tg('ENTER_GROUP_NAME')}
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
                  onClick={() => setDialogMode('choose')}
                >
                  {tg('BACK')}
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  onClick={handleCreateGroupSubmit}
                  disabled={uploadBeneficiary?.isPending}
                >
                  {tg('SUBMIT')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
