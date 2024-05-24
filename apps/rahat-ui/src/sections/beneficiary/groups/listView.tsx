'use client';

import { Table, flexRender } from '@tanstack/react-table';
import { ChevronDown, Settings2 } from 'lucide-react';

import { Button } from '@rahat-ui/shadcn/components/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import { Input } from '@rahat-ui/shadcn/components/input';
import {
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { ListBeneficiaryGroup } from '@rahat-ui/types';
import { useEffect, useState } from 'react';
import AssignBeneficiaryToProjectModal from './assignToProjectModal';
// import BulkAssignToProjectModal from './components/bulkAssignToProjectModal';
// import CreateGroupModal from './components/createGroupModal';

type IProps = {
  table: Table<ListBeneficiaryGroup>;
  handleBulkAssign: (selectedProject: string) => void;
  isBulkAssigning: boolean;
  // projectModal: any;
  groupModal: any;
  projects: any;
  handleFilterProjectSelect: (selectedProject: string) => void;
  filters: Record<string, any>;
};

export default function ListView({
  table,
  handleBulkAssign,
  isBulkAssigning,
  // projectModal,
  projects,
  handleFilterProjectSelect,
  filters,
  groupModal,
}: IProps) {
  const [selectedProject, setSelectedProject] = useState<null | Record<
    string,
    any
  >>(null);

  const handleSelectProject = (project: Record<string, any>) => {
    setSelectedProject(project);
    handleFilterProjectSelect(project.value);
  };

  const selectFilterProjectItems = [
    {
      name: 'All',
      value: undefined,
    },
    {
      name: 'Not Assigned',
      value: 'NOT_ASSGNED',
    },
    ...projects.map((p: any) => ({
      name: p.name,
      value: p.uuid,
    })),
  ];

  useEffect(() => {
    if (filters?.projectId) {
      const project = selectFilterProjectItems.find((p) => {
        return p.value === filters?.projectId;
      });
      setSelectedProject(project);
    }
  }, [filters?.projectId, projects]);

  return (
    <>
      {/* <BulkAssignToProjectModal
        handleSubmit={handleBulkAssign}
        projectModal={projectModal}
        selectedBeneficiaries={table
          .getSelectedRowModel()
          .rows.map((row) => row.original.walletAddress)}
      />*/}

      <div className="-mt-2 p-2 bg-secondary">
        <div className="flex items-center mb-2">
          <Input
            placeholder="Filter beneficiary groups..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="rounded"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                {selectedProject ? selectedProject.name : 'Select Project'}
                <ChevronDown className="mr-2 h-4 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {selectFilterProjectItems.map((project: any) => (
                <DropdownMenuItem
                  key={project.name}
                  textValue={project.value}
                  onSelect={() => handleSelectProject(project)}
                >
                  {project.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <Settings2 className="mr-2 h-4 w-5" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {table.getSelectedRowModel().rows.length ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="ml-2">
                  {table.getSelectedRowModel().rows.length} - Beneficiary Groups
                  Selected
                  <ChevronDown className="ml-1" strokeWidth={1.5} />
                </Button>
              </DropdownMenuTrigger>
              {/* <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={projectModal.onTrue}
                  disabled={isBulkAssigning}
                >
                  Bulk Assign Project
                </DropdownMenuItem>
              </DropdownMenuContent> */}
            </DropdownMenu>
          ) : null}
        </div>
        <div className="rounded border bg-card h-[calc(100vh-180px)]">
          <TableComponent>
            <ScrollArea className="h-table1">
              <TableHeader className="sticky top-0 bg-card">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </ScrollArea>
          </TableComponent>
        </div>
      </div>
    </>
  );
}
