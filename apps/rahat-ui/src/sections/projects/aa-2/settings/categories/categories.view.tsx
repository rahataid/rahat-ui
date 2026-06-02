'use client';

import {
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { Plus } from 'lucide-react';
import { useActivitiesCategories } from '@rahat-ui/query';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { DemoTable } from 'apps/rahat-ui/src/common/table';
import { useAACategoryColumns } from './categories.columns';
import AddCategoryDialog from './add.category';

export default function AACategoriesView() {
  const { id } = useParams();
  const projectUUID = id as UUID;

  const columns = useAACategoryColumns();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading } = useActivitiesCategories(projectUUID);

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  return (
    <div>
      <div className="pb-1 flex justify-between items-center space-x-4">
        <Heading title="Categories" description="Manage activity categories" />
        <IconLabelBtn
          Icon={Plus}
          handleClick={() => setDialogOpen(true)}
          name="Add Category"
          className="px-3 py-2"
        />
      </div>
      <div className="w-full mt-1 p-1 bg-secondary">
        <div className="flex items-center mb-2">
          <Input
            placeholder="Search by name..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="rounded mr-2"
          />
        </div>
        <div className="rounded border bg-white">
          <DemoTable table={table} loading={isLoading} />
        </div>
      </div>
      <AddCategoryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}
