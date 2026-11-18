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
import { ListPlus, Repeat2, Share, Users, X } from 'lucide-react';
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
import DownloadBeneficiarySampleDialog from 'apps/rahat-ui/src/common/download.beneficiary.sample.dialog';
import { BENEFICIARY_SAMPLE_TEMPLATES } from 'apps/rahat-ui/src/constants/beneficiary.sample.templates';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

const allowedExtensions: { [key: string]: string } = {
  xlsx: 'excel',
  xls: 'excel',
  json: 'json',
  csv: 'csv',
};

export default function AAImportBeneficiary() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
  const t = useTranslations('AA_PROJECT');
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
  const [groupError, setGroupError] = useState('');

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

  const recordCount = data.length > 1 ? data.length - 1 : 0;

  const isUploadPending =
    uploadBeneficiary?.isPending || uploadToGroup?.isPending;

  const closeGroupDialog = () => {
    if (isUploadPending) return;
    setShowGroupDialog(false);
    setDialogMode('choose');
    setGroupNameInput('');
    setSelectedGroupUuid('');
    setGroupError('');
    groupForm.reset({ groupUuid: '' });
  };

  const goToMode = (mode: 'choose' | 'create' | 'select') => {
    setDialogMode(mode);
    setGroupError('');
  };

  const handleAddClick = () => {
    if (!selectedFile) {
      toast.error(tg('PLEASE_SELECT_A_FILE_TO_UPLOAD'));
      return;
    }
    setGroupNameInput('');
    setSelectedGroupUuid('');
    setGroupError('');
    groupForm.reset({ groupUuid: '' });
    setDialogMode('choose');
    setShowGroupDialog(true);
  };

  const handleSkipImport = async () => {
    setShowGroupDialog(false);
    await handleUpload(undefined);
  };

  const handleCreateGroupSubmit = async () => {
    const trimmedName = groupNameInput.trim();
    if (!trimmedName) {
      setGroupError(tg('PLEASE_ENTER_A_GROUP_NAME'));
      return;
    }
    if (trimmedName.length > 50) {
      setGroupError(tg('GROUP_NAME_MAX_LENGTH'));
      return;
    }
    const duplicate = existingGroups.some(
      (g: any) => g?.name?.toLowerCase() === trimmedName.toLowerCase(),
    );
    if (duplicate) {
      setGroupError(t('GROUP_NAME_ALREADY_EXISTS'));
      return;
    }
    setShowGroupDialog(false);
    await handleUpload(trimmedName);
  };

  const handleSelectGroupSubmit = async () => {
    if (!selectedGroupUuid) {
      setGroupError(tg('PLEASE_SELECT_A_GROUP'));
      return;
    }
    setShowGroupDialog(false);
    await doUpload('append', { groupUuid: selectedGroupUuid });
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
                <DownloadBeneficiarySampleDialog
                  templates={BENEFICIARY_SAMPLE_TEMPLATES}
                  sheetName="Beneficiaries"
                />
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
        modal={false}
        onOpenChange={(open) => {
          if (!open) closeGroupDialog();
        }}
      >
        <DialogContent className="rounded-sm max-w-lg">
          {dialogMode === 'choose' ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-center text-primary">
                  {t('CREATE_A_GROUP')}?
                </DialogTitle>
                <DialogDescription className="text-center">
                  {tg('DO_YOU_WANT_TO_CREATE_A_GROUP_OR_SKIP')}
                  {recordCount > 0 && (
                    <span className="block mt-1 font-medium text-foreground">
                      {formatNum(recordCount)} {tg('ROW_S_SELECTED')}
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>

              <p className="text-sm text-black mb-2 font-medium">
                {tg('CHOOSE_AN_OPTION_BELOW')}
              </p>

              <div className="space-y-2 mb-2">
                {/* Create New Group card */}
                <button
                  type="button"
                  onClick={() => goToMode('create')}
                  className="w-full text-left border hover:bg-blue-50/40 rounded-sm overflow-hidden transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <div className="w-full p-4">
                    <div className="flex items-start gap-3">
                      <Users
                        size={30}
                        className="px-1 mt-1 text-primary bg-gray-100 rounded-sm shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">
                            {tg('CREATE_NEW_GROUP')}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-sm bg-gray-100 font-semibold text-blue-600">
                            {t('RECOMMENDED')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {tg('ORGANIZE_BENEFICIARIES_DESC')}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Add to Existing Group card */}
                <button
                  type="button"
                  onClick={() => goToMode('select')}
                  disabled={existingGroups.length === 0}
                  className="w-full text-left border border-gray-200 rounded-sm overflow-hidden transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-full p-4">
                    <div className="flex items-start gap-3">
                      <ListPlus
                        size={30}
                        className="px-1 mt-0.5 text-primary rounded-sm bg-gray-100 shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-gray-800">
                            {tg('ADD_TO_EXISTING_GROUP')}
                          </span>
                          <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                            {formatNum(existingGroups.length)}{' '}
                            {tg('GROUPS_SUFFIX')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {tg('ADD_TO_EXISTING_BENEFICIARY_GROUP_DESC')}
                        </p>
                        {existingGroups.length === 0 && (
                          <p className="text-[11px] text-amber-600 mt-1">
                            {tg('NO_GROUPS_FOUND')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Skip for Now card */}
                <button
                  type="button"
                  onClick={handleSkipImport}
                  disabled={isUploadPending}
                  className="w-full text-left border border-gray-200 rounded-sm overflow-hidden transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
                >
                  <div className="w-full p-4">
                    <div className="flex items-start gap-3">
                      <X
                        size={30}
                        className="px-1 mt-0.5 text-primary rounded-sm bg-gray-100 shrink-0"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-gray-800">
                          {tg('SKIP_FOR_NOW')}
                        </span>
                        <p className="text-xs text-gray-600 mt-1">
                          {tg('SKIP_BENEFICIARY_GROUPING_DESC')}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={isUploadPending}
                  onClick={handleSkipImport}
                >
                  {isUploadPending ? tg('UPLOADING') : t('SKIP')}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={isUploadPending || existingGroups.length === 0}
                  onClick={() => goToMode('select')}
                >
                  {tg('ADD_TO_EXISTING_GROUP')}
                </Button>
                <Button
                  className="flex-1"
                  disabled={isUploadPending}
                  onClick={() => goToMode('create')}
                >
                  {tg('CREATE_NEW_GROUP')}
                </Button>
              </div>
            </>
          ) : dialogMode === 'create' ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateGroupSubmit();
              }}
            >
              <DialogHeader>
                <DialogTitle>{tg('CREATE_NEW_GROUP')}</DialogTitle>
                <DialogDescription>
                  {tg('ENTER_A_NAME_FOR_THE_NEW_GROUP')}
                  {recordCount > 0 && (
                    <span className="block mt-1 font-medium text-foreground">
                      {formatNum(recordCount)} {tg('ROW_S_SELECTED')}
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 mb-4">
                <label className="block text-sm font-medium mb-2">
                  {tg('GROUP_NAME')} <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={groupNameInput}
                  onChange={(e) => {
                    setGroupNameInput(e.target.value);
                    setGroupError('');
                  }}
                  placeholder={tg('ENTER_GROUP_NAME')}
                  className="w-full"
                  autoFocus
                  maxLength={50}
                  disabled={isUploadPending}
                />
                <div className="flex justify-between items-center mt-1">
                  {groupError ? (
                    <p className="text-red-500 text-xs">{groupError}</p>
                  ) : (
                    <span />
                  )}
                  <span className="text-[11px] text-muted-foreground">
                    {groupNameInput.trim().length}/50
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-sm"
                  disabled={isUploadPending}
                  onClick={() => goToMode('choose')}
                >
                  {tg('BACK')}
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-sm"
                  disabled={isUploadPending || !groupNameInput.trim()}
                >
                  {isUploadPending ? tg('UPLOADING') : tg('CREATE_NEW_GROUP')}
                </Button>
              </div>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSelectGroupSubmit();
              }}
            >
              <DialogHeader>
                <DialogTitle>
                  {tg('IMPORT_BENEFICIARIES_TO_EXISTING_GROUP')}
                </DialogTitle>
                <DialogDescription>
                  {tg('SELECT_EXISTING_BENEFICIARY_GROUP')}
                  {recordCount > 0 && (
                    <span className="block mt-1 font-medium text-foreground">
                      {formatNum(recordCount)} {tg('ROW_S_SELECTED')}
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 mb-4">
                <label className="block text-sm font-medium mb-2">
                  {tg('SELECT_EXISTING_BENEFICIARY_GROUP')}{' '}
                  <span className="text-red-500">*</span>
                </label>
                <Form {...groupForm}>
                  <FormField
                    control={groupForm.control}
                    name="groupUuid"
                    render={({ field }) => (
                      <DropdownSearch
                        selectedLabel={
                          existingGroups.find(
                            (g: any) => g.uuid === field.value,
                          )?.name
                        }
                        placeholder={tg('SELECT_BENEFICIARY_GROUP')}
                        searchPlaceholder={tg('SEARCH_GROUP')}
                        emptyMessage={tg('NO_GROUPS_FOUND')}
                        disabled={
                          isUploadPending || existingGroups.length === 0
                        }
                        options={existingGroups.map((g: any) => ({
                          label: g.name,
                          value: g.uuid,
                          data: g,
                        }))}
                        onSelect={(data: Record<string, any>) => {
                          field.onChange(data.uuid);
                          setSelectedGroupUuid(data.uuid);
                          setGroupError('');
                        }}
                      />
                    )}
                  />
                </Form>
                {groupError && (
                  <p className="text-red-500 text-xs mt-1">{groupError}</p>
                )}
                {existingGroups.length === 0 && (
                  <p className="text-xs text-amber-600 mt-2">
                    {tg('NO_GROUPS_FOUND')}. {tg('CREATE_NEW_GROUP_FIRST')}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-sm"
                  disabled={isUploadPending}
                  onClick={() => goToMode('choose')}
                >
                  {tg('BACK')}
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-sm"
                  disabled={isUploadPending || !selectedGroupUuid}
                >
                  {isUploadPending
                    ? tg('UPLOADING')
                    : tg('ADD_TO_EXISTING_GROUP')}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
