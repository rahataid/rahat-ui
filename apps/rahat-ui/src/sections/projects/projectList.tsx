'use client';

import { useProjectClose, useProjectList } from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import { Project } from '@rahataid/sdk/project/project.types';
import { UUID } from 'crypto';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { DemoTable, SearchInput } from '../../common';
import { CircleX } from 'lucide-react';
import { useState } from 'react';
import SelectComponent from './comms/select.component';
import CustomPagination from '../../components/customPagination';
import TooltipWrapper from '../../components/tooltip.wrapper';

export const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  NOT_READY: { label: 'Not Ready', className: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  ACTIVE: { label: 'Active', className: 'bg-green-100 text-green-700 border-green-300' },
  CLOSED: { label: 'Closed', className: 'bg-red-100 text-red-700 border-red-300' },
};

export function StatusBadge({ status }: { status?: string }) {
  const config = STATUS_CONFIG[status ?? ''];
  return (
    <Badge className={`border ${config?.className ?? 'bg-gray-100 text-gray-500 border-gray-300'}`}>
      {config?.label ?? status ?? '—'}
    </Badge>
  );
}

export default function ListProject() {
  const { data, isLoading } = useProjectList();
  const closeProject = useProjectClose();

  const projects: Project[] = data?.data ?? [];

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const handleCloseProject = () => {
    if (!selectedProject?.uuid) return;
    closeProject.mutate(
      { uuid: selectedProject.uuid as UUID, data: { status: 'CLOSED' } },
      { onSuccess: () => setSelectedProject(null) },
    );
  };

  const getFilterValue = (id: string) =>
    columnFilters.find((f) => f.id === id)?.value as string | undefined;

  const setFilter = (id: string, value: string) => {
    setColumnFilters((prev) => {
      const rest = prev.filter((f) => f.id !== id);
      return value ? [...rest, { id, value }] : rest;
    });
  };

  const columns: ColumnDef<Project>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
      filterFn: 'includesString',
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: ({ row }) => <div>{row.getValue('description')}</div>,
    },
    {
      header: 'Type',
      accessorKey: 'type',
      cell: ({ row }) => <div>{row.original.type?.toUpperCase()}</div>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
      filterFn: 'equalsString',
    },
    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: ({ row }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
          : '—',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const project = row.original;
        console.log('project in actions', project);
        return (

          <TooltipWrapper tip={project.status === 'CLOSED' ? 'Project is Closed' : 'Close Project'} >

            <button
              onClick={() => setSelectedProject(project)}
              className="text-red-500 hover:text-red-700 cursor-pointer disabled:cursor-not-allowed disabled:text-gray-400"
              disabled={project.status === 'CLOSED'}
            >
              <CircleX />
            </button>
          </TooltipWrapper>
        );
      },
    },
  ];

  const table = useReactTable({
    data: projects,
    columns,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10, pageIndex: 0 } },
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const filteredTotal = table.getFilteredRowModel().rows.length;

  return (
    <div className="p-6">
      <div className="flex justify-between space-x-2 mb-2">
        <SearchInput
          className="w-full flex-[4]"
          name="name"
          onSearch={(e) => setFilter('name', e?.target?.value ?? '')}
          value={getFilterValue('name') ?? ''}
        />
        <SelectComponent
          name="Status"
          options={['ALL', 'ACTIVE', 'NOT_READY', 'CLOSED']}
          onChange={(value) => setFilter('status', value === 'ALL' ? '' : value)}
          value={getFilterValue('status') || 'ALL'}
          className="flex-[1]"
        />
      </div>

      <DemoTable
        table={table}
        tableHeight="h-[calc(100vh-230px)]"
        loading={isLoading}
        message="No Projects Found"
      />

      <CustomPagination
        meta={{ lastPage: pageCount, total: filteredTotal } as any}
        handleNextPage={() => table.nextPage()}
        handlePrevPage={() => table.previousPage()}
        handlePageSizeChange={(val) => table.setPageSize(Number(val))}
        currentPage={pageIndex + 1}
        perPage={pageSize}
        total={filteredTotal}
      />

      <AlertDialog
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close &quot;{selectedProject?.name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to close this project? Once a project is
              closed, it cannot be reactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleCloseProject}
            >
              {closeProject.isPending ? 'Closing...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
