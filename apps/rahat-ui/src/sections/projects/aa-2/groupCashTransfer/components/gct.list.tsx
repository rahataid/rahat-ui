'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useParams, useRouter } from 'next/navigation';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { UUID } from 'crypto';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { TruncatedCell } from '../../stakeholders/component/TruncatedCell';
import {
  DemoTable,
  SearchInput,
  CustomPagination,
} from 'apps/rahat-ui/src/common';
import { usePagination, useGroupCashTransfers } from '@rahat-ui/query';
import GctDeleteDialog from './gct.delete.dialog';
import GctUpdateSheet from './gct.update.sheet';

// ─── Types ────────────────────────────────────────────────────────────────────

type GctItem = {
  uuid: string;
  name: string;
  phone?: string;
  extras?: {
    municipality?: string;
    ward?: string;
    supportArea?: string[];
    district?: string;
    email?: string;
  };
  groupCashTransferRecords?: { uuid: string; amount: number; status: string }[];
  totalAssignedAmount?: number;
};

// ─── Action button ────────────────────────────────────────────────────────────

function ActionBtn({
  label,
  icon,
  hoverClass,
  onClick,
  disabled = false,
}: {
  label: string;
  icon: React.ReactNode;
  hoverClass: string;
  onClick: () => void;
  disabled?: boolean;
}) {
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function GctList() {
  const router = useRouter();
  const { id } = useParams();
  const projectUUID = id as UUID;

  // Pagination state
  const { pagination, setNextPage, setPrevPage, setPerPage, setPagination } =
    usePagination();

  // Filter state
  const [nameFilter, setNameFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [wardFilter, setWardFilter] = useState('');
  const [supportAreaFilter, setSupportAreaFilter] = useState('');

  const debouncedFilters = useDebounce(
    { search: nameFilter, phone: phoneFilter, ward: wardFilter, supportArea: supportAreaFilter },
    500,
  );

  // Reset to page 1 whenever debounced filters change
  useEffect(() => {
    setPagination((prev: typeof pagination) => ({ ...prev, page: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters.search, debouncedFilters.phone, debouncedFilters.ward, debouncedFilters.supportArea]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Queries & mutations
  const { data, isLoading } = useGroupCashTransfers(projectUUID, {
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    ...(debouncedFilters.search ? { search: debouncedFilters.search } : {}),
    ...(debouncedFilters.phone ? { phone: debouncedFilters.phone } : {}),
    ...(debouncedFilters.ward ? { ward: debouncedFilters.ward } : {}),
    ...(debouncedFilters.supportArea ? { supportArea: debouncedFilters.supportArea } : {}),
  });

  // Active item for sheet / dialog
  const [activeItem, setActiveItem] = useState<GctItem | null>(null);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const openUpdate = (item: GctItem) => { setActiveItem(item); setUpdateOpen(true); };
  const openDelete = (item: GctItem) => { setActiveItem(item); setDeleteOpen(true); };

  const handleResetFilters = () => {
    setNameFilter('');
    setPhoneFilter('');
    setWardFilter('');
    setSupportAreaFilter('');
    setPagination({ ...pagination, page: 1 });
  };

  // Table data
  const rows = useMemo<GctItem[]>(() => data?.data ?? [], [data]);
  const meta = data?.response?.meta;

  // Column definitions
  const columns: ColumnDef<GctItem>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'GCT Group Name',
        cell: ({ row }) => (
          <TruncatedCell text={row.getValue('name') || '—'} maxLength={20} />
        ),
      },
      {
        accessorKey: 'phone',
        header: 'Phone Number',
        cell: ({ row }) => (
          <TruncatedCell text={row.getValue('phone') || '—'} maxLength={18} />
        ),
      },
      {
        id: 'municipality',
        header: 'Municipality',
        cell: ({ row }) => (
          <TruncatedCell text={row.original.extras?.municipality || '—'} maxLength={15} />
        ),
      },
      {
        id: 'ward',
        header: 'Ward (Community)',
        cell: ({ row }) => (
          <TruncatedCell text={row.original.extras?.ward || '—'} maxLength={15} />
        ),
      },
      {
        id: 'supportArea',
        header: 'Support Area',
        cell: ({ row }) => {
          const areas = row.original.extras?.supportArea ?? [];
          if (!areas.length) return '—';
          const visible = areas.slice(0, 1);
          const overflow = areas.slice(1);
          return (
            <TooltipProvider>
              <div className="flex items-center gap-1 max-w-[140px]">
                {visible.map((area) => (
                  <Badge key={area} className="bg-gray-100 text-gray-700 hover:bg-gray-100 text-xs truncate max-w-[90px]">
                    {area}
                  </Badge>
                ))}
                {overflow.length > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge className="bg-gray-200 text-gray-600 hover:bg-gray-200 text-xs shrink-0 cursor-default">
                        +{overflow.length}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[200px]">
                      <div className="flex flex-wrap gap-1">
                        {overflow.map((a) => (
                          <span key={a} className="text-xs">{a}</span>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </TooltipProvider>
          );
        },
      },
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => {
          const item = row.original;
          const hasFund = (item.groupCashTransferRecords?.length ?? 0) > 0;
          return (
            <TooltipProvider>
              <div className="flex items-center gap-1">
                <ActionBtn
                  label="View"
                  icon={<Eye size={16} strokeWidth={1.8} />}
                  hoverClass="hover:bg-gray-100 text-gray-600"
                  onClick={() =>
                    router.push(
                      `/projects/aa/${id}/group-cash-transfer/${item.uuid}`,
                    )
                  }
                />
                <RoleAuth
                  roles={[AARoles.ADMIN, AARoles.Municipality]}
                  hasContent={false}
                >
                  <ActionBtn
                    label="Edit"
                    icon={<Pencil size={16} strokeWidth={1.8} />}
                    hoverClass="hover:bg-blue-50 text-blue-500"
                    onClick={() => openUpdate(item)}
                  />
                  <ActionBtn
                    label={hasFund ? 'Cannot delete — fund records assigned' : 'Delete'}
                    icon={<Trash2 size={16} strokeWidth={1.8} />}
                    hoverClass="hover:bg-red-50 text-red-500"
                    disabled={hasFund}
                    onClick={() => openDelete(item)}
                  />
                </RoleAuth>
              </div>
            </TooltipProvider>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id],
  );

  const table = useReactTable({
    data: rows,
    columns,
    manualPagination: true,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { columnVisibility, columnFilters },
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <SearchInput
          className="flex-1 min-w-[140px]"
          name="name"
          value={nameFilter}
          onSearch={(e) => {
            setNameFilter(e.target.value);
            setPagination({ ...pagination, page: 1 });
          }}
        />
        <SearchInput
          className="flex-1 min-w-[140px]"
          name="phone"
          value={phoneFilter}
          onSearch={(e) => {
            setPhoneFilter(e.target.value);
            setPagination({ ...pagination, page: 1 });
          }}
        />
        <SearchInput
          className="flex-1 min-w-[140px]"
          name="Ward (Community)"
          value={wardFilter}
          onSearch={(e) => {
            setWardFilter(e.target.value);
            setPagination({ ...pagination, page: 1 });
          }}
        />
        <SearchInput
          className="flex-1 min-w-[140px]"
          name="support area"
          value={supportAreaFilter}
          onSearch={(e) => {
            setSupportAreaFilter(e.target.value);
            setPagination({ ...pagination, page: 1 });
          }}
        />
      </div>

      <DemoTable table={table} loading={isLoading} />

      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        setPagination={setPagination}
        meta={meta || { total: 0, currentPage: 0, lastPage: 1 }}
        perPage={pagination.perPage}
        total={meta?.total ?? 0}
      />

      {/* Update sheet */}
      <GctUpdateSheet
        projectUUID={projectUUID}
        item={activeItem}
        open={updateOpen}
        onOpenChange={setUpdateOpen}
      />

      {/* Delete dialog */}
      <GctDeleteDialog
        projectUUID={projectUUID}
        item={activeItem}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}
