'use client';

import { Tabs, TabsContent } from '@rahat-ui/shadcn/components/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import {
  Delete,
  Download,
  MoreVertical,
  Pencil,
  Share,
  Upload,
  Trash,
  Wallet,
} from 'lucide-react';
import {
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';

import {
  useActiveFieldDefList,
  useBulkGenerateVerificationLink,
  useCommunityGroupListByID,
  useCommunityGroupRemove,
  useCommunityGroupStore,
  useCommunityGroupedBeneficiariesDownload,
  useCommunitySettingList,
  useExportPinnedListBeneficiary,
  usePurgeGroupedBeneficiary,
  useUploadBulkBeneficiaryUpdate,
} from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { GroupPurge } from '@rahataid/community-tool-sdk';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import CustomPagination from '../../components/customPagination';
import { SETTINGS_NAME } from '../../constants/settings.const';
import { deHumanizeString, simpleString } from '../../utils';
import GroupDetailTable from './group.table';
import { useCommunityGroupDeailsColumns } from './useGroupColumns';
import DownloadDialog from './DownloadDialog';
import BulkUpdateDialog from './BulkUpdateDialog';
import EditSubmitView from './EditSubmitView';

const EXCLUDE_FROM_XLSX = new Set(['latitude', 'longitude']);

type IProps = {
  uuid: string;
};

export default function GroupDetail({ uuid }: IProps) {
  const {
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
    resetSelectedListItems,
  } = usePagination();

  const { data: responseByUUID, isLoading } = useCommunityGroupListByID(
    uuid,
    pagination,
  );
  const columns = useCommunityGroupDeailsColumns();
  const { data: listFieldDef } = useActiveFieldDefList({});

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const download = useCommunityGroupedBeneficiariesDownload();
  const removeCommunityGroup = useCommunityGroupRemove();
  const updateBulkBeneficiary = useUploadBulkBeneficiaryUpdate();
  const purgeCommunityGroup = usePurgeGroupedBeneficiary();
  const { data: settingsData } = useCommunitySettingList({
    page: 1,
    perPage: 300,
  });
  const exportPinnedListBeneficiary = useExportPinnedListBeneficiary();
  const bulkGenereateLink = useBulkGenerateVerificationLink();

  const {
    deleteSelectedBeneficiariesFromImport,
    setDeleteSelectedBeneficiariesFromImport,
    resetDeletedSelectedBeneficiaries,
  } = useCommunityGroupStore();
  const router = useRouter();

  const table = useReactTable({
    manualPagination: true,
    data: responseByUUID?.data?.beneficiariesGroup || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getRowId: (row) => row.beneficiary.uuid as string,
    state: { columnVisibility, rowSelection: selectedListItems },
  });

  // ── Download dialog state ──────────────────────────────────────────────────
  const [downloadOpen, setDownloadOpen] = React.useState(false);
  const [labels, setLabels] = React.useState<string[]>([]);

  // ── Bulk Update dialog state ───────────────────────────────────────────────
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uniqueField, setUniqueField] = React.useState<string>('none');

  // ── Edit & Submit in-page view state ──────────────────────────────────────
  const [editSubmitMode, setEditSubmitMode] = React.useState(false);
  const [editSubmitSubmitting, setEditSubmitSubmitting] = React.useState(false);
  const [dirtyRows, setDirtyRows] = React.useState<
    Map<string, Record<string, unknown>>
  >(new Map());
  const [allowedEditKeys, setAllowedEditKeys] = React.useState<Set<string>>(
    new Set(),
  );
  const [availableColumns, setAvailableColumns] = React.useState<string[]>([]);
  const [addedColumns, setAddedColumns] = React.useState<Set<string>>(
    new Set(),
  );
  const [editPage, setEditPage] = React.useState(1);
  const [editPerPage, setEditPerPage] = React.useState(20);

  const { data: editPageData, isLoading: editPageLoading } =
    useCommunityGroupListByID(uuid, { page: editPage, perPage: editPerPage });

  // ── Download ───────────────────────────────────────────────────────────────
  const selectables =
    listFieldDef?.data?.filter(
      (item: any) => !labels.includes(simpleString(item.name)),
    ) || [];

  const sortedSelectables = [
    { uuid: 'select-all', name: 'Select All' },
    ...selectables.sort((a: { name: string }, b: { name: string }) => {
      const isANumber = /^\d/.test(a.name);
      const isBNumber = /^\d/.test(b.name);
      if (isANumber && !isBNumber) return -1;
      if (!isANumber && isBNumber) return 1;
      return a.name.localeCompare(b.name);
    }),
  ];

  const handleDownload = async () => {
    const response = await download.mutateAsync({
      uuid,
      config: { responseType: 'arraybuffer' },
    });
    const rawData = response?.data?.data;
    const filteredData = rawData.map((item: Record<string, any>) => {
      const filteredItem: Record<string, any> = {};
      labels.forEach((key) => {
        const dehumanizedString = deHumanizeString(key as string);
        filteredItem[dehumanizedString] = Object.prototype.hasOwnProperty.call(
          item,
          dehumanizedString,
        )
          ? item[dehumanizedString]
          : '';
      });
      filteredItem['uuid'] =
        item['uuid'] ?? item['beneficiary']?.['uuid'] ?? '';
      return filteredItem;
    });
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'beneficiaries.xlsx');
  };

  // ── Bulk Upload ────────────────────────────────────────────────────────────
  const handleUpload = async () => {
    if (!selectedFile) {
      Swal.fire('Please select a file', '', 'warning');
      return;
    }
    try {
      const buffer = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows: Record<string, string | number | boolean>[] =
        XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      if (rows.length > 0) {
        const allColumns = Object.keys(rows[0]);
        const nonEmptyColumns = allColumns.filter((col) =>
          rows.some((row) => row[col] !== '' && row[col] != null),
        );
        const cleanedRows = rows.map((row) =>
          nonEmptyColumns.reduce((acc, col) => {
            acc[col] = row[col];
            return acc;
          }, {} as Record<string, string | number | boolean>),
        );
        const newWorkbook = XLSX.utils.book_new();
        const newWorksheet = XLSX.utils.json_to_sheet(cleanedRows);
        XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);
        const excelBuffer = XLSX.write(newWorkbook, {
          bookType: 'xlsx',
          type: 'array',
        });
        const cleanedFile = new File(
          [
            new Blob([excelBuffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }),
          ],
          selectedFile.name,
          {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
        );
        const formData = new FormData();
        formData.append('file', cleanedFile);
        await updateBulkBeneficiary.mutateAsync({
          groupUUID: uuid,
          data: formData,
          ...(uniqueField && uniqueField !== 'none' && { uniqueField }),
        });
      } else {
        const formData = new FormData();
        formData.append('file', selectedFile);
        await updateBulkBeneficiary.mutateAsync({
          groupUUID: uuid,
          data: formData,
          ...(uniqueField && uniqueField !== 'none' && { uniqueField }),
        });
      }
      setSelectedFile(null);
      router.push('/group');
    } catch (error) {
      Swal.fire(
        'Upload failed',
        (error as Error & { response?: { data?: { message?: string } } })
          ?.response?.data?.message || 'Unknown error',
        'error',
      );
    }
  };

  // ── Edit & Submit ──────────────────────────────────────────────────────────
  const openEditSubmit = () => {
    const allowedKeys = new Set<string>(
      (listFieldDef?.data ?? []).flatMap((fd: { name: string }) => [
        fd.name,
        deHumanizeString(fd.name),
      ]),
    );

    // Build the set of keys present in data: top-level beneficiary fields +
    // extras keys — both filtered by allowedKeys.
    const sampleBg = (responseByUUID?.data?.beneficiariesGroup ?? []) as {
      beneficiary?: { extras?: Record<string, unknown> } & Record<
        string,
        unknown
      >;
    }[];

    const presentInData = new Set<string>();
    sampleBg.forEach((bg) => {
      const bene = bg.beneficiary ?? {};
      // top-level fields that match allowedKeys
      Object.keys(bene).forEach((k) => {
        if (allowedKeys.has(k) && k !== 'uuid') presentInData.add(k);
      });
      // extras fields that match allowedKeys
      Object.keys(bene.extras ?? {}).forEach((k) => {
        if (allowedKeys.has(k)) presentInData.add(k);
      });
    });

    const remaining = [...allowedKeys].filter(
      (k) => k !== 'uuid' && !presentInData.has(k),
    );

    setDirtyRows(new Map());
    setAllowedEditKeys(allowedKeys);
    setAvailableColumns(remaining);
    setAddedColumns(new Set());
    setEditPage(1);
    setEditPerPage(20);
    setEditSubmitMode(true);
  };

  const handleAddColumn = (colKey: string) => {
    setAvailableColumns((prev) => prev.filter((c) => c !== colKey));
    setAddedColumns((prev) => new Set(prev).add(colKey));
  };

  const handleRemoveColumn = (colKey: string) => {
    setDirtyRows((prev) => {
      const next = new Map(prev);
      next.forEach((fields, uuid) => {
        const { [colKey]: _, ...rest } = fields;
        next.set(uuid, rest);
      });
      return next;
    });
    setAvailableColumns((prev) => [...prev, colKey]);
    setAddedColumns((prev) => {
      const next = new Set(prev);
      next.delete(colKey);
      return next;
    });
  };

  const handleCellChange = (rowUuid: string, field: string, value: string) => {
    setDirtyRows((prev) => {
      const next = new Map(prev);
      next.set(rowUuid, { ...(next.get(rowUuid) ?? {}), [field]: value });
      return next;
    });
  };

  const handleEditSubmit = async () => {
    if (dirtyRows.size === 0) {
      Swal.fire('No changes', 'Edit some cells first.', 'info');
      return;
    }
    try {
      setEditSubmitSubmitting(true);
      const rowsForUpload = Array.from(dirtyRows.entries()).map(
        ([rowUuid, fields]) => ({
          uuid: rowUuid,
          ...Object.fromEntries(
            Object.entries(fields).filter(([k]) => !EXCLUDE_FROM_XLSX.has(k)),
          ),
        }),
      );
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(rowsForUpload);
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const file = new File(
        [
          new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
        ],
        'bulk-edit.xlsx',
        {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      );
      const formData = new FormData();
      formData.append('file', file);
      await updateBulkBeneficiary.mutateAsync({
        groupUUID: uuid,
        data: formData,
        uniqueField: 'uuid',
      });
      setEditSubmitMode(false);
    } catch (error) {
      Swal.fire(
        'Submit failed',
        (error as Error & { response?: { data?: { message?: string } } })
          ?.response?.data?.message || 'Unknown error',
        'error',
      );
    } finally {
      setEditSubmitSubmitting(false);
    }
  };

  // ── Group actions ──────────────────────────────────────────────────────────
  const removeBeneficiaryFromGroup = () => {
    if (deleteSelectedBeneficiariesFromImport.length > 0) {
      Swal.fire({
        title: 'Are you sure?',
        text: `Disconnect beneficiary from ${responseByUUID?.data?.name}`,
        icon: 'question',
        showDenyButton: true,
        confirmButtonText: 'Yes, I am sure!',
        denyButtonText: 'No, cancel it!',
        customClass: {
          actions: 'my-actions',
          confirmButton: 'order-1',
          denyButton: 'order-2',
        },
        allowOutsideClick: false,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await removeCommunityGroup.mutateAsync({
            uuid,
            deleteBeneficiaryFlag: false,
            beneficiaryUuid: deleteSelectedBeneficiariesFromImport,
          });
          router.push('/group');
        }
      });
    } else {
      Swal.fire('Please select beneficiary to disconnect', '', 'warning');
    }
  };

  const handlePurge = async () => {
    if (deleteSelectedBeneficiariesFromImport.length > 0) {
      await purgeCommunityGroup.mutateAsync({
        groupUuid: uuid,
        beneficiaryUuid: deleteSelectedBeneficiariesFromImport,
      } as GroupPurge);
      resetDeletedSelectedBeneficiaries();
    } else {
      Swal.fire('Please select beneficiary to delete', '', 'warning');
    }
  };

  const handleExportPinnedBeneficiary = () => {
    const filteredValue: Record<string, string> | undefined =
      settingsData?.data?.find(
        (item: { name: string }) => item.name === SETTINGS_NAME.EXTERNAL_APPS,
      )?.value;
    const obj = filteredValue
      ? Object.entries(filteredValue).reduce((acc, [key, value]) => {
          acc[value as string] = key;
          return acc;
        }, {} as Record<string, string>)
      : {};
    exportPinnedListBeneficiary.mutate({ groupUUID: uuid, config: obj });
  };

  const handleVerificationLink = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Send Verification Link',
      icon: 'question',
      showDenyButton: true,
      confirmButtonText: 'Yes, I am sure!',
      denyButtonText: 'No, cancel it!',
      customClass: {
        actions: 'my-actions',
        cancelButton: 'order-1',
        confirmButton: 'order-2',
        denyButton: 'order-3',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await bulkGenereateLink.mutateAsync(uuid as string);
      } else if (result.isDenied) {
        Swal.fire(
          'Cancelled',
          'Generating Verification Link Canceled',
          'error',
        );
      }
    });
  };

  // ── Effects ────────────────────────────────────────────────────────────────
  useEffect(() => {
    setDeleteSelectedBeneficiariesFromImport(
      Object.keys(selectedListItems).filter((key) => selectedListItems[key]),
    );
  }, [selectedListItems, setDeleteSelectedBeneficiariesFromImport]);

  useEffect(() => {
    if (deleteSelectedBeneficiariesFromImport.length === 0)
      resetSelectedListItems();
  }, [deleteSelectedBeneficiariesFromImport.length, resetSelectedListItems]);

  const beneficiariesEmpty = !responseByUUID?.data?.beneficiariesGroup?.length;

  if (editSubmitMode) {
    return (
      <EditSubmitView
        groupName={responseByUUID?.data?.name}
        pageRows={editPageData?.data?.beneficiariesGroup ?? []}
        dirtyRows={dirtyRows}
        allowedKeys={allowedEditKeys}
        availableColumns={availableColumns}
        addedColumns={addedColumns}
        isLoading={editPageLoading}
        page={editPage}
        perPage={editPerPage}
        total={editPageData?.response?.meta?.total ?? 0}
        meta={
          editPageData?.response?.meta ?? {
            total: 0,
            currentPage: 0,
            lastPage: 0,
            perPage: editPerPage,
            prev: null,
            next: null,
          }
        }
        onPageChange={setEditPage}
        onPerPageChange={(v: string | number) => {
          setEditPerPage(Number(v));
          setEditPage(1);
        }}
        onCellChange={handleCellChange}
        onAddColumn={handleAddColumn}
        onRemoveColumn={handleRemoveColumn}
        onSubmit={handleEditSubmit}
        onCancel={() => {
          setEditSubmitMode(false);
          setDirtyRows(new Map());
          setAvailableColumns([]);
          setAddedColumns(new Set());
        }}
        isSubmitting={editSubmitSubmitting}
      />
    );
  }

  return (
    <>
      <Tabs defaultValue="detail">
        <div className="flex justify-between items-center p-4 pb-1">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger>
                <Label>{responseByUUID?.data?.name}</Label>
              </TooltipTrigger>
              <TooltipContent className="bg-secondary">
                <p className="text-xs font-medium">Group Name</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical
                  className="cursor-pointer"
                  size={20}
                  strokeWidth={1.5}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={handleExportPinnedBeneficiary}
                  disabled={beneficiariesEmpty}
                >
                  <Share className="mr-2 h-4 w-4" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDownloadOpen(true)}
                  disabled={beneficiariesEmpty}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUploadOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Bulk Update
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={openEditSubmit}
                  disabled={beneficiariesEmpty}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit & Submit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={removeBeneficiaryFromGroup}
                  disabled={beneficiariesEmpty}
                >
                  <Delete className="mr-2 h-4 w-4" />
                  Disconnect
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleVerificationLink}>
                  <Wallet className="mr-2 h-4 w-4" />
                  Verify Wallet
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handlePurge}
                  disabled={beneficiariesEmpty}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DownloadDialog
              open={downloadOpen}
              onOpenChange={setDownloadOpen}
              labels={labels}
              onLabelsChange={setLabels}
              sortedSelectables={sortedSelectables}
              onDownload={handleDownload}
            />

            <BulkUpdateDialog
              open={uploadOpen}
              onOpenChange={setUploadOpen}
              uniqueField={uniqueField}
              onUniqueFieldChange={setUniqueField}
              onFileChange={setSelectedFile}
              onUpload={handleUpload}
            />
          </div>
        </div>

        <TabsContent value="detail">
          <GroupDetailTable table={table} loading={isLoading} />
        </TabsContent>

        <CustomPagination
          currentPage={pagination.page}
          handleNextPage={setNextPage}
          handlePrevPage={setPrevPage}
          handlePageSizeChange={setPerPage}
          meta={responseByUUID?.response?.meta || { total: 0, currentPage: 0 }}
          perPage={pagination?.perPage}
          total={responseByUUID?.response?.meta?.total || 0}
        />
      </Tabs>
    </>
  );
}
