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
  TooltipProvider,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { TruncatedCell } from '../../stakeholders/component/TruncatedCell';
import {
  DemoTable,
  SearchInput,
  CustomPagination,
  Heading,
} from 'apps/rahat-ui/src/common';
import { usePagination, useGroupCashTransfers } from '@rahat-ui/query';
import GctDeleteDialog from './gct.delete.dialog';
import GctActionBtn from './gct.action-btn';
import { GctItem } from '../types/gct.types';

export default function GctList() {
  const router = useRouter();
  const { id } = useParams();
  const projectUUID = id as UUID;

  const { pagination, setNextPage, setPrevPage, setPerPage, setPagination } =
    usePagination();

  const [nameFilter, setNameFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [wardFilter, setWardFilter] = useState('');
  const [supportAreaFilter, setSupportAreaFilter] = useState('');

  const debouncedFilters = useDebounce(
    {
      search: nameFilter,
      phone: phoneFilter,
      ward: wardFilter,
      supportArea: supportAreaFilter,
    },
    500,
  );

  useEffect(() => {
    setPagination((prev: typeof pagination) => ({ ...prev, page: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedFilters.search,
    debouncedFilters.phone,
    debouncedFilters.ward,
    debouncedFilters.supportArea,
  ]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { data, isLoading } = useGroupCashTransfers(projectUUID, {
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    ...(debouncedFilters.search.trim() ? { search: debouncedFilters.search.trim() } : {}),
    ...(debouncedFilters.phone.trim() ? { phone: debouncedFilters.phone.trim() } : {}),
    ...(debouncedFilters.ward.trim() ? { ward: debouncedFilters.ward.trim() } : {}),
    ...(debouncedFilters.supportArea.trim()
      ? { supportArea: debouncedFilters.supportArea.trim() }
      : {}),
  });

  const [activeItem, setActiveItem] = useState<GctItem | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const openDelete = (item: GctItem) => {
    setActiveItem(item);
    setDeleteOpen(true);
  };

  const rows = useMemo<GctItem[]>(() => data?.data ?? [], [data]);
  const meta = data?.response?.meta;

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
          <TruncatedCell
            text={row.original.extras?.municipality || '—'}
            maxLength={15}
          />
        ),
      },
      {
        id: 'ward',
        header: 'Ward (Community)',
        cell: ({ row }) => (
          <TruncatedCell
            text={row.original.extras?.ward || '—'}
            maxLength={15}
          />
        ),
      },
      {
        id: 'supportArea',
        header: 'Support Area',
        cell: ({ row }) => {
          const areas = row.original.extras?.supportArea ?? [];
          if (!areas.length) return '—';
          const [first, ...rest] = areas;
          return (
            <TooltipProvider>
              <div className="flex items-center gap-1 max-w-[140px]">
                <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 text-xs truncate max-w-[90px]">
                  {first}
                </Badge>
                {rest.length > 0 && (
                  <Badge className="bg-gray-200 text-gray-600 hover:bg-gray-200 text-xs shrink-0">
                    +{rest.length}
                  </Badge>
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
                <GctActionBtn
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
                  <GctActionBtn
                    label="Edit"
                    icon={<Pencil size={16} strokeWidth={1.8} />}
                    hoverClass="hover:bg-blue-50 text-blue-500"
                    onClick={() =>
                      router.push(
                        `/projects/aa/${id}/group-cash-transfer/${item.uuid}/edit`,
                      )
                    }
                  />
                  <GctActionBtn
                    label={
                      hasFund ? 'Cannot delete — funds reserved' : 'Delete'
                    }
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
      <Heading
        title="Group Cash Transfer Group List"
        titleStyle="font-medium text-lg"
        description="List of all the Group Cash Transfer Groups"
      />

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

      <GctDeleteDialog
        projectUUID={projectUUID}
        item={activeItem}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}
