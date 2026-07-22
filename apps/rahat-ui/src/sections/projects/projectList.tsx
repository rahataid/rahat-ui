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
import { LockKeyhole, LockKeyholeOpen } from 'lucide-react';
import { useState } from 'react';
import SelectComponent from './comms/select.component';
import CustomPagination from '../../components/customPagination';
import TooltipWrapper from '../../components/tooltip.wrapper';
import { dateFormat } from '../../utils/dateFormate';
import { TruncatedCell } from './aa-2/stakeholders/component/TruncatedCell';
import { useTranslations } from 'next-intl';

const STATUS_CLASSES: Record<string, string> = {
  NOT_READY: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  ACTIVE: 'bg-green-100 text-green-700 border-green-300',
  CLOSED: 'bg-red-100 text-red-700 border-red-300',
};

export function StatusBadge({ status }: { status?: string }) {
  const t = useTranslations('Projects List');
  return (
    <Badge className={`border ${STATUS_CLASSES[status ?? ''] ?? 'bg-gray-100 text-gray-500 border-gray-300'}`}>
      {t(status ?? '')}
    </Badge>
  );
}

export default function ListProject() {
  const t = useTranslations('Projects List');
  const g = useTranslations('GLOBAL');
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
      header: g('NAME'),
      accessorKey: 'name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
      filterFn: 'includesString',
    },
    {
      header: g('DESCRIPTION'),
      accessorKey: 'description',
      cell: ({ row }) => <div>
        <TruncatedCell text={row.getValue('description')} />
      </div>,
    },
    {
      header: g('TYPE'),
      accessorKey: 'type',
      cell: ({ row }) => <div>{row.original.type?.toUpperCase()}</div>,
    },
    {
      header: g('STATUS'),
      accessorKey: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
      filterFn: 'equalsString',
    },
    {
      header: g('CREATED_AT'),
      accessorKey: 'createdAt',
      cell: ({ row }) =>
        row.original.createdAt
          ? dateFormat(row.original.createdAt)
          : '—',
    },
    {
      id: 'actions',
      header: g('ACTIONS'),
      cell: ({ row }) => {
        const project = row.original;
        console.log('project in actions', project);
        return (
          <TooltipWrapper tip={project.status === 'CLOSED' ? t('PROJECT_IS_CLOSED') : t('CLOSE_PROJECT')} >
            <button
              onClick={() => setSelectedProject(project)}
              className=" cursor-pointer disabled:cursor-not-allowed disabled:text-gray-400"
              disabled={project.status === 'CLOSED'}
            >
              {project.status === 'CLOSED' ? <LockKeyhole /> : <LockKeyholeOpen />}
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
          name={g('NAME')}
          onSearch={(e) => setFilter('name', e?.target?.value ?? '')}
          value={getFilterValue('name') ?? ''}
        />
        <SelectComponent
          name={g('STATUS')}
          options={['ALL', 'ACTIVE', 'NOT_READY', 'CLOSED']}
          optionLabels={{ ALL: g('ALL'), ACTIVE: t('ACTIVE'), NOT_READY: t('NOT_READY'), CLOSED: t('CLOSED') }}
          onChange={(value) => setFilter('status', value === 'ALL' ? '' : value)}
          value={getFilterValue('status') || 'ALL'}
          className="flex-[1]"
        />
      </div>

      <DemoTable
        table={table}
        tableHeight="h-[calc(100vh-230px)]"
        loading={isLoading}
        message={t('NO_PROJECTS_FOUND')}
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
            <AlertDialogTitle>{t('CLOSE_PROJECT_TITLE', { name: selectedProject?.name })}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('CLOSE_PROJECT_DESC')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{g('CANCEL')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleCloseProject}
            >
              {closeProject.isPending ? t('CLOSING') : g('CONFIRM')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
