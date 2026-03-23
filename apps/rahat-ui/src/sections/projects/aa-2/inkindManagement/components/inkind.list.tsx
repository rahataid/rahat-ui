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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
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
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useSwal } from 'apps/rahat-ui/src/components/swal';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  InkindType,
  INKIND_TYPES,
  INKIND_TYPE_LABELS,
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
};

function ActionButton({ label, icon, hoverClass, onClick }: ActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={`p-1.5 rounded transition-colors ${hoverClass}`}
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
  });
  const [updateDialog, setUpdateDialog] =
    useState<UpdateDialogState>(EMPTY_UPDATE);
  const [confirmDialog, setConfirmDialog] =
    useState<ConfirmDialogState>(EMPTY_CONFIRM);

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

  const handleDelete = async (item: InkindItem) => {
    const result = await dialog.fire({
      title: 'Delete In-Kind Item',
      text: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444',
    });
    if (result.isConfirmed) {
      await deleteInkind.mutateAsync({ uuid: item.uuid });
      queryClient.invalidateQueries({
        queryKey: ['aa.inkinds.get', projectUUID],
      });
    }
  };

  const openStockDialog = (item: InkindItem, mode: 'add' | 'remove') =>
    setStockDialog({ open: true, mode, item, quantity: '' });

  const closeStockDialog = () =>
    setStockDialog({ open: false, mode: 'add', item: null, quantity: '' });

  const handleStockSubmit = async () => {
    const { mode, item, quantity } = stockDialog;
    if (!item) return;

    const qty = parseInt(quantity, 10);
    if (!quantity || isNaN(qty) || qty <= 0) {
      toast.error('Please enter a valid quantity greater than 0.');
      return;
    }

    if (mode === 'remove') {
      const available = item.availableStock ?? 0;
      if (qty > available) {
        toast.error(`Cannot remove ${qty}. Only ${available} units available.`);
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

  // Update flow: open edit modal pre-filled with current values
  const openUpdateDialog = (item: InkindItem) =>
    setUpdateDialog({
      open: true,
      item,
      name: item.name,
      description: item.description ?? '',
      type: item.type,
    });

  // Move from edit modal → confirmation modal
  const handleUpdateNext = () => {
    const { name, description, type, item } = updateDialog;
    if (!name.trim()) {
      toast.error('Name is required.');
      return;
    }
    if (!description.trim()) {
      toast.error('Description is required.');
      return;
    }
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
        header: 'Name',
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
                  label="Delete"
                  icon={<Trash2 size={16} strokeWidth={1.8} />}
                  hoverClass="hover:bg-red-50 text-red-500"
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
    [],
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
          Register Inkind
        </Button>
      </div>
      <SearchInput
        className="w-full mb-2"
        name="name"
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onSearch={(event) =>
          table.getColumn('name')?.setFilterValue(event.target.value)
        }
      />
      <DemoTable
        table={table}
        tableHeight="h-[calc(100vh-420px)]"
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
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {stockDialog.mode === 'add' ? 'Add Stock' : 'Remove Stock'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div>
              <p className="text-sm text-muted-foreground">Item</p>
              <p className="font-semibold">{stockDialog.item?.name}</p>
            </div>
            {stockDialog.mode === 'remove' && (
              <div>
                <p className="text-sm text-muted-foreground">Available Stock</p>
                <p className="font-semibold text-primary">
                  {stockDialog.item?.availableStock ?? 0}
                </p>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="quantity">Quantity</Label>
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
                value={stockDialog.quantity}
                onChange={(e) =>
                  setStockDialog((prev) => ({
                    ...prev,
                    quantity: e.target.value,
                  }))
                }
                onKeyDown={(e) => e.key === 'Enter' && handleStockSubmit()}
              />
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
            <Button
              onClick={handleStockSubmit}
              disabled={isPending}
              className={
                stockDialog.mode === 'remove'
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : ''
              }
            >
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
        onOpenChange={(o) => !o && setUpdateDialog(EMPTY_UPDATE)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Update Inkind Item</DialogTitle>
            <DialogDescription>
              Edit the details below, then review before saving.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="update-name">Name</Label>
              <Input
                id="update-name"
                placeholder="Item name"
                value={updateDialog.name}
                onChange={(e) =>
                  setUpdateDialog((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="update-description">Description</Label>
              <Textarea
                id="update-description"
                placeholder="Item description"
                className="resize-none"
                rows={3}
                value={updateDialog.description}
                onChange={(e) =>
                  setUpdateDialog((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={updateDialog.type}
                onValueChange={(v) =>
                  setUpdateDialog((prev) => ({
                    ...prev,
                    type: v as InkindType,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {INKIND_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {INKIND_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setUpdateDialog(EMPTY_UPDATE)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateNext}>Next</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Update Details — Step 2: Confirmation Modal ── */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(o) => !o && setConfirmDialog(EMPTY_CONFIRM)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Confirm Changes
            </DialogTitle>
            <DialogDescription>
              Review the changes below before saving.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-sm">
            <div className="rounded-sm border bg-muted/40 px-3 py-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{confirmDialog.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Description</span>
                <span className="font-medium max-w-[60%] text-right break-words">
                  {confirmDialog.description}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <Badge
                  variant={
                    confirmDialog.type === 'PRE_DEFINED'
                      ? 'default'
                      : 'secondary'
                  }
                  className="rounded-sm"
                >
                  {INKIND_TYPE_LABELS[confirmDialog.type]}
                </Badge>
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
