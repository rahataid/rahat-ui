'use client';

import { useMemo, useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  DemoTable,
  Heading,
  SearchInput,
  CustomPagination,
} from 'apps/rahat-ui/src/common';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import {
  PlusCircle,
  MinusCircle,
  Trash2,
  Pencil,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  useInkinds,
  useDeleteInkind,
  useAddInkindStock,
  useRemoveInkindStock,
  useUpdateInkind,
  useGroupInkindAllocations,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useSwal } from 'apps/rahat-ui/src/components/swal';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  InkindType,
  INKIND_TYPES,
  INKIND_TYPE_LABELS,
  NAME_MAX,
  DESCRIPTION_MAX,
} from '../schemas/inkind.validation';

export type InkindItem = {
  uuid: string;
  name: string;
  description?: string;
  type: InkindType;
  availableStock?: number;
};

type StockDialogState = {
  open: boolean;
  mode: 'add' | 'remove';
  item: InkindItem | null;
  quantity: string;
  error: string;
};

type UpdateDialogState = {
  open: boolean;
  item: InkindItem | null;
  name: string;
  description: string;
  type: InkindType;
};

type ConfirmDialogState = {
  open: boolean;
  item: InkindItem | null;
  name: string;
  description: string;
  type: InkindType;
};

type ActionButtonProps = {
  label: string;
  icon: React.ReactNode;
  hoverClass: string;
  onClick: () => void;
  disabled?: boolean;
};

function ActionButton({
  label,
  icon,
  hoverClass,
  onClick,
  disabled = false,
}: ActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          disabled={disabled}
          className={`p-1.5 rounded transition-colors ${
            disabled
              ? 'opacity-35 cursor-not-allowed text-muted-foreground'
              : hoverClass
          }`}
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

const EMPTY_UPDATE: UpdateDialogState = {
  open: false,
  item: null,
  name: '',
  description: '',
  type: 'PRE_DEFINED',
};

const EMPTY_CONFIRM: ConfirmDialogState = {
  open: false,
  item: null,
  name: '',
  description: '',
  type: 'PRE_DEFINED',
};

export default function InkindList() {
  const router = useRouter();
  const { id } = useParams();
  const projectUUID = id as UUID;

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [stockDialog, setStockDialog] = useState<StockDialogState>({
    open: false,
    mode: 'add',
    item: null,
    quantity: '',
    error: '',
  });
  const [updateDialog, setUpdateDialog] =
    useState<UpdateDialogState>(EMPTY_UPDATE);
  const [confirmDialog, setConfirmDialog] =
    useState<ConfirmDialogState>(EMPTY_CONFIRM);
  const [updateErrors, setUpdateErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  const { data, isLoading } = useInkinds(projectUUID, {
    page: pagination.pageIndex + 1,
    perPage: pagination.pageSize,
    order: 'desc',
    sort: 'createdAt',
  });

  const deleteInkind = useDeleteInkind(projectUUID);
  const addStock = useAddInkindStock(projectUUID);
  const removeStock = useRemoveInkindStock(projectUUID);
  const updateInkind = useUpdateInkind(projectUUID);
  const queryClient = useQueryClient();
  const dialog = useSwal();

  const { data: allocationsData } = useGroupInkindAllocations(projectUUID);
  const assignedInkindIds = useMemo<Set<string>>(() => {
    const raw: unknown = allocationsData;
    const list: { inkindId?: string }[] = Array.isArray(raw)
      ? raw
      : Array.isArray((raw as any)?.data)
      ? (raw as any).data
      : [];
    return new Set(list.map((a) => a.inkindId).filter(Boolean) as string[]);
  }, [allocationsData]);

  const handleDelete = async (item: InkindItem) => {
    if (assignedInkindIds.has(item.uuid)) {
      toast.error(
        'Inkind is already assigned to a group so cannot be removed.',
      );
      return;
    }
    const result = await dialog.fire({
      title: 'Delete Inkind Item',
      text: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Confirm',
      confirmButtonColor: '#ef4444',
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      await deleteInkind.mutateAsync({ uuid: item.uuid });
      queryClient.invalidateQueries({
        queryKey: ['aa.inkinds.get', projectUUID],
      });
    }
  };

  const openStockDialog = (item: InkindItem, mode: 'add' | 'remove') =>
    setStockDialog({ open: true, mode, item, quantity: '', error: '' });

  const closeStockDialog = () =>
    setStockDialog({
      open: false,
      mode: 'add',
      item: null,
      quantity: '',
      error: '',
    });

  const handleStockSubmit = async () => {
    const { mode, item, quantity } = stockDialog;
    if (!item) return;

    const qty = parseInt(quantity, 10);
    if (!quantity || isNaN(qty) || qty <= 0) {
      setStockDialog((prev) => ({
        ...prev,
        error: 'Quantity must be greater than 0.',
      }));
      return;
    }

    if (mode === 'remove') {
      const available = item.availableStock ?? 0;
      if (qty > available) {
        setStockDialog((prev) => ({
          ...prev,
          error: `Cannot remove ${qty}. Only ${available} unit${
            available !== 1 ? 's' : ''
          } available.`,
        }));
        return;
      }
    }

    if (mode === 'add') {
      await addStock.mutateAsync({ inkindId: item.uuid, quantity: qty });
    } else {
      await removeStock.mutateAsync({ inkindUuid: item.uuid, quantity: qty });
    }
    closeStockDialog();
  };

  const openUpdateDialog = (item: InkindItem) => {
    setUpdateErrors({});
    setUpdateDialog({
      open: true,
      item,
      name: item.name,
      description: item.description ?? '',
      type: item.type,
    });
  };

  const handleUpdateNext = () => {
    const { name, description, type, item } = updateDialog;
    const errors: { name?: string; description?: string } = {};

    if (!name.trim()) {
      errors.name = 'Name is required.';
    } else if (name.length > NAME_MAX) {
      errors.name = `Name must be ${NAME_MAX} characters or fewer.`;
    } else {
      const trimmed = name.trim().toLowerCase();
      const duplicate = rows.some(
        (r) => r.uuid !== item?.uuid && r.name.trim().toLowerCase() === trimmed,
      );
      if (duplicate)
        errors.name = 'An inkind item with this name already exists.';
    }

    if (!description.trim()) {
      errors.description = 'Description is required.';
    } else if (description.length > DESCRIPTION_MAX) {
      errors.description = `Description must be ${DESCRIPTION_MAX} characters or fewer.`;
    }

    if (errors.name || errors.description) {
      setUpdateErrors(errors);
      return;
    }

    setUpdateErrors({});
    setUpdateDialog(EMPTY_UPDATE);
    setConfirmDialog({ open: true, item, name, description, type });
  };

  // Confirmed — call the API
  const handleUpdateConfirm = async () => {
    const { item, name, description, type } = confirmDialog;
    if (!item) return;
    await updateInkind.mutateAsync({
      uuid: item.uuid,
      name,
      description,
      type,
    });
    setConfirmDialog(EMPTY_CONFIRM);
  };

  const rows = useMemo<InkindItem[]>(
    () =>
      [...(data?.data ?? [])].sort((a: any, b: any) => {
        const aTime = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
        const bTime = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
        return bTime - aTime;
      }),
    [data],
  );
  const meta = data?.meta;

  const columns: ColumnDef<InkindItem>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Inkind Name',
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue('name')}</span>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
          <span className="text-sm">{row.getValue('description') || '—'}</span>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
          const type = row.getValue('type') as InkindType;
          return (
            <Badge
              variant={type === 'PRE_DEFINED' ? 'default' : 'secondary'}
              className="rounded-sm"
            >
              {INKIND_TYPE_LABELS[type]}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'availableStock',
        header: 'Available Stock',
        cell: ({ row }) => (
          <span className="font-semibold">
            {row.getValue('availableStock') ?? 0}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const item = row.original;
          const isAssigned = assignedInkindIds.has(item.uuid);
          return (
            <TooltipProvider>
              <div className="flex items-center gap-1">
                <ActionButton
                  label="Add Stock"
                  icon={<PlusCircle size={16} strokeWidth={1.8} />}
                  hoverClass="hover:bg-green-50 text-green-600"
                  onClick={() => openStockDialog(item, 'add')}
                />
                <ActionButton
                  label="Remove Stock"
                  icon={<MinusCircle size={16} strokeWidth={1.8} />}
                  hoverClass="hover:bg-yellow-50 text-yellow-600"
                  onClick={() => openStockDialog(item, 'remove')}
                />
                <ActionButton
                  label={
                    isAssigned
                      ? 'Cannot delete — assigned to a group'
                      : 'Delete'
                  }
                  icon={<Trash2 size={16} strokeWidth={1.8} />}
                  hoverClass="hover:bg-red-50 text-red-500"
                  disabled={isAssigned}
                  onClick={() => handleDelete(item)}
                />
                <ActionButton
                  label="Update Details"
                  icon={<Pencil size={16} strokeWidth={1.8} />}
                  hoverClass="hover:bg-blue-50 text-blue-500"
                  onClick={() => openUpdateDialog(item)}
                />
              </div>
            </TooltipProvider>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [assignedInkindIds],
  );

  const table = useReactTable({
    data: rows,
    columns,
    manualPagination: true,
    pageCount: meta?.lastPage ?? -1,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { columnVisibility, columnFilters, pagination },
  });

  const isPending = addStock.isPending || removeStock.isPending;

  return (
    <div>
      <div className="flex justify-between items-center">
        <Heading
          title="Budget Management List"
          titleStyle="text-lg"
          description="List of all budget items"
        />
        <Button
          variant="default"
          size="sm"
          className="rounded-sm"
          onClick={() =>
            router.push(`/projects/aa/${id}/inkind-management/add`)
          }
        >
          Create Inkind
        </Button>
      </div>
      <SearchInput
        className="w-full mb-2"
        name="Inkind Name"
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onSearch={(event) =>
          table.getColumn('name')?.setFilterValue(event.target.value)
        }
      />
      <DemoTable
        table={table}
        // tableHeight="h-[calc(100vh - 300px)]"
        loading={isLoading}
      />
      <CustomPagination
        currentPage={pagination.pageIndex + 1}
        handleNextPage={() => table.nextPage()}
        handlePrevPage={() => table.previousPage()}
        handlePageSizeChange={(size) => table.setPageSize(size as number)}
        meta={{
          total: meta?.total ?? 0,
          currentPage: pagination.pageIndex + 1,
          lastPage: meta?.lastPage ?? 1,
          perPage: pagination.pageSize,
          next: table.getCanNextPage() ? 'next' : null,
          prev: table.getCanPreviousPage() ? 'prev' : null,
        }}
        perPage={pagination.pageSize}
      />

      {/* ── Stock Add / Remove Dialog ── */}
      <Dialog
        open={stockDialog.open}
        onOpenChange={(o) => !o && closeStockDialog()}
      >
        <DialogContent className="w-[500px] max-w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {stockDialog.mode === 'add' ? 'Add Stock' : 'Remove Stock'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <p className="text-sm text-muted-foreground">Item</p>
              <p className="text-base font-semibold">
                {stockDialog.item?.name}
              </p>
            </div>
            {stockDialog.mode === 'remove' && (
              <div>
                <p className="text-sm text-muted-foreground">Available Stock</p>
                <p className="text-base font-semibold text-primary">
                  {stockDialog.item?.availableStock ?? 0}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-sm font-medium" htmlFor="quantity">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={
                  stockDialog.mode === 'remove'
                    ? stockDialog.item?.availableStock ?? undefined
                    : undefined
                }
                placeholder="Enter quantity"
                className="text-base h-10"
                value={stockDialog.quantity}
                onChange={(e) =>
                  setStockDialog((prev) => ({
                    ...prev,
                    quantity: e.target.value,
                    error: '',
                  }))
                }
                onKeyDown={(e) => e.key === 'Enter' && handleStockSubmit()}
              />
              {stockDialog.error && (
                <p className="flex items-center gap-1 text-sm text-destructive">
                  <AlertCircle size={13} />
                  {stockDialog.error}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={closeStockDialog}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleStockSubmit} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {stockDialog.mode === 'add' ? 'Adding...' : 'Removing...'}
                </>
              ) : stockDialog.mode === 'add' ? (
                'Add Stock'
              ) : (
                'Remove Stock'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={updateDialog.open}
        onOpenChange={(o) => {
          if (!o) {
            setUpdateDialog(EMPTY_UPDATE);
            setUpdateErrors({});
          }
        }}
      >
        <DialogContent className="w-[500px] max-w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-lg">Update Inkind Item</DialogTitle>
            <DialogDescription>
              Edit the details below, then review before saving.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium" htmlFor="update-name">
                  Name
                </Label>
                <span
                  className={`text-xs ${
                    updateDialog.name.length >= NAME_MAX
                      ? 'text-destructive'
                      : 'text-muted-foreground'
                  }`}
                >
                  {updateDialog.name.length}/{NAME_MAX}
                </span>
              </div>
              <Input
                id="update-name"
                placeholder="Item name"
                maxLength={NAME_MAX}
                className="text-base h-10"
                value={updateDialog.name}
                onChange={(e) => {
                  setUpdateDialog((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                  if (updateErrors.name)
                    setUpdateErrors((prev) => ({ ...prev, name: undefined }));
                }}
              />
              {updateErrors.name && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle size={12} />
                  {updateErrors.name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  className="text-sm font-medium"
                  htmlFor="update-description"
                >
                  Description
                </Label>
                <span
                  className={`text-xs ${
                    updateDialog.description.length >= DESCRIPTION_MAX
                      ? 'text-destructive'
                      : 'text-muted-foreground'
                  }`}
                >
                  {updateDialog.description.length}/{DESCRIPTION_MAX}
                </span>
              </div>
              <Textarea
                id="update-description"
                placeholder="Item description"
                className="resize-none text-base"
                rows={4}
                maxLength={DESCRIPTION_MAX}
                value={updateDialog.description}
                onChange={(e) => {
                  setUpdateDialog((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }));
                  if (updateErrors.description)
                    setUpdateErrors((prev) => ({
                      ...prev,
                      description: undefined,
                    }));
                }}
              />
              {updateErrors.description && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle size={12} />
                  {updateErrors.description}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setUpdateDialog(EMPTY_UPDATE);
                setUpdateErrors({});
              }}
            >
              Reset
            </Button>
            <Button
              onClick={handleUpdateNext}
              disabled={
                !updateDialog.name.trim() ||
                !updateDialog.description.trim() ||
                (updateDialog.item !== null &&
                  updateDialog.name.trim() ===
                    (updateDialog.item.name ?? '').trim() &&
                  updateDialog.description.trim() ===
                    (updateDialog.item.description ?? '').trim())
              }
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Update Details — Step 2: Confirmation Modal ── */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(o) => !o && setConfirmDialog(EMPTY_CONFIRM)}
      >
        <DialogContent className="w-[500px] max-w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              Confirm Changes
            </DialogTitle>
            <DialogDescription>
              Review the changes below before saving.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="rounded-sm border bg-muted/40 px-4 py-3 space-y-3">
              <div className="flex justify-between items-start gap-4">
                <span className="text-sm text-muted-foreground shrink-0">
                  Name
                </span>
                <span className="text-sm font-medium text-right">
                  {confirmDialog.name}
                </span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-sm text-muted-foreground shrink-0">
                  Description
                </span>
                <span className="text-sm font-medium max-w-[65%] text-right break-words">
                  {confirmDialog.description}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setConfirmDialog(EMPTY_CONFIRM);
                setUpdateDialog({
                  open: true,
                  item: confirmDialog.item,
                  name: confirmDialog.name,
                  description: confirmDialog.description,
                  type: confirmDialog.type,
                });
              }}
              disabled={updateInkind.isPending}
            >
              Back
            </Button>
            <Button
              onClick={handleUpdateConfirm}
              disabled={updateInkind.isPending}
            >
              {updateInkind.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Confirm'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
