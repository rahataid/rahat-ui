'use client';

import { useProjectClose, useProjectEdit, useProjectList } from '@rahat-ui/query';
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
  AlertDialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import { Project } from '@rahataid/sdk/project/project.types';
import { UUID } from 'crypto';
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { DemoTable } from '../../common';
import { CircleX } from 'lucide-react';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';


const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  NOT_READY: { label: 'Not Ready', className: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  ACTIVE: { label: 'Active', className: 'bg-green-100 text-green-700 border-green-300' },
  CLOSED: { label: 'Closed', className: 'bg-red-100 text-red-700 border-red-300' },
};

function StatusBadge({ status }: { status?: string }) {
  const config = STATUS_CONFIG[status ?? ''];
  return (
    <Badge className={`border ${config?.className ?? 'bg-gray-100 text-gray-500 border-gray-300'}`}>
      {config?.label ?? status ?? '—'}
    </Badge>
  );
}

export default function ListProject() {
  const { data, isLoading } = useProjectList();
  const editProject = useProjectEdit();
  const closeProject = useProjectClose();
  const projects: Project[] = data?.data ?? [];

  const handleCloseProject = (uuid?: UUID) => {
    if (!uuid) return;
    closeProject.mutate({ uuid, data: { status: 'CLOSED' } });
  };
  const columns: ColumnDef<any>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
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
    },
    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: ({ row }) => {
        return (
          <div>
            {row.original.createdAt
              ? new Date(row.original.createdAt).toLocaleDateString()
              : '—'}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const project = row.original;
        return (

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                disabled={project.status === 'CLOSED'}
                className="disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <TooltipComponent
                  Icon={CircleX}
                  tip="Close Project"
                  iconStyle="text-red-500 hover:text-red-700 cursor-pointer"
                  handleOnClick={() => { }
                  }

                />
                {/* <CircleX size={16} strokeWidth={1.8} className="text-red-500 hover:text-red-700" /> */}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Close &quot;{project.name}&quot;?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to close this project? Once a project is
                  closed, it cannot be reactivated.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => handleCloseProject(project.uuid as UUID)}
                >
                  {/* Confirm */}
                  {closeProject.isPending ? 'Closing...' : 'Confirm'}

                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      },
    },
  ];
  const table = useReactTable({
    manualPagination: true,
    data: projects || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Projects</h2>
      <DemoTable
        table={table}
        tableHeight={'h-[calc(100vh-320px)]'}
        loading={isLoading}
        message="No Projects Found"
      />
    </div>
  );
}
