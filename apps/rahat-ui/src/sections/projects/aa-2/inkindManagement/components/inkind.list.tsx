'use client';

import React, { useState } from 'react';
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
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { PlusCircle, MinusCircle, Trash2, Pencil, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  useInkinds,
  useDeleteInkind,
  useAddInkindStock,
  useRemoveInkindStock,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import InkindUpdateSheet from './inkind.update.sheet';
import { useSwal } from 'apps/rahat-ui/src/components/swal';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export type InkindItem = {
  uuid: string;
  name: string;
  description?: string;
  type: string;
  availableStock?: number;
};

type StockDialogState = {
  open: boolean;
  mode: 'add' | 'remove';
  item: InkindItem | null;
  quantity: string;
};

export default function InkindList() {
  const router = useRouter();
  const { id } = useParams();
  const projectUUID = id as UUID;

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [selectedItem, setSelectedItem] = useState<InkindItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [stockDialog, setStockDialog] = useState<StockDialogState>({
    open: false,
    mode: 'add',
    item: null,
    quantity: '',
  });

  const { data, isLoading } = useInkinds(projectUUID, {
    page: pagination.pageIndex + 1,
    perPage: pagination.pageSize,
    order: 'desc',
    sort: 'createdAt',
  });

  const deleteInkind = useDeleteInkind(projectUUID);
  const addStock = useAddInkindStock(projectUUID);
  const removeStock = useRemoveInkindStock(projectUUID);
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

  const openStockDialog = (item: InkindItem, mode: 'add' | 'remove') => {
    setStockDialog({ open: true, mode, item, quantity: '' });
  };

  const closeStockDialog = () => {
    setStockDialog({ open: false, mode: 'add', item: null, quantity: '' });
  };

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

  const rows: InkindItem[] = [...(data?.data ?? [])].sort((a: any, b: any) => {
    const aTime = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
    const bTime = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
    return bTime - aTime;
  });
  const meta = data?.meta;

  const columns: ColumnDef<InkindItem>[] = [
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
        <span className="text-muted-foreground text-sm">
          {row.getValue('description') || '—'}
        </span>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('type') as string;
        return (
          <Badge
            variant={type === 'PRE_DEFINED' ? 'default' : 'secondary'}
            className="rounded-sm"
          >
            {type === 'PRE_DEFINED' ? 'Pre-Defined' : 'Walk-In'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'availableStock',
      header: 'Available Stock',
      cell: ({ row }) => (
        <span className="font-semibold text-primary">
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
              {/* Add Stock */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => openStockDialog(item, 'add')}
                    className="p-1.5 rounded hover:bg-green-50 text-green-600 transition-colors"
                  >
                    <PlusCircle size={16} strokeWidth={1.8} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Add Stock</p>
                </TooltipContent>
              </Tooltip>

              {/* Remove Stock */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => openStockDialog(item, 'remove')}
                    className="p-1.5 rounded hover:bg-yellow-50 text-yellow-600 transition-colors"
                  >
                    <MinusCircle size={16} strokeWidth={1.8} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Remove Stock</p>
                </TooltipContent>
              </Tooltip>

              {/* Delete */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                  >
                    <Trash2 size={16} strokeWidth={1.8} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Delete</p>
                </TooltipContent>
              </Tooltip>

              {/* Update Details */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setIsSheetOpen(true);
                    }}
                    className="p-1.5 rounded hover:bg-blue-50 text-blue-500 transition-colors"
                  >
                    <Pencil size={16} strokeWidth={1.8} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Update Details</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        );
      },
    },
  ];

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

      <InkindUpdateSheet
        projectUUID={projectUUID}
        item={selectedItem}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />

      {/* Add / Remove Stock Dialog */}
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
    </div>
  );
}
