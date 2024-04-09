'use client';

import { Button } from '@rahat-ui/shadcn/components/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Table, flexRender } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { useProjectList } from '@rahat-ui/query';
import { UUID } from 'crypto';

export type IVendor = {
  id: string;
  projectName: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
  walletAddress: `0x${string}`;
};

type ProjectModalType = {
  value: boolean;
  onToggle: () => void;
};

type IProps = {
  table: Table<IVendor>;
  selectedProject: UUID | undefined;
  setSelectedProject: (id: UUID) => void;
  handleAssignProject: VoidFunction;
  projectModal: ProjectModalType;
};

export default function VendorsTable({
  table,
  selectedProject,
  setSelectedProject,
  handleAssignProject,
  projectModal,
}: IProps) {
  const projectList = useProjectList({});
  const handleProjectChange = (d: UUID) => setSelectedProject(d);

  return (
    <>
      <div className="p-2 bg-secondary">
        <div className="flex items-center mb-2">
          <Input
            placeholder="Search User..."
            value={
              (table.getColumn('name')?.getFilterValue() as string) ??
              ''
            }
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="rounded mr-2"
          />
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
        </div>
        <div className="rounded border h-[calc(100vh-180px)] bg-card">
          <TableComponent>
            <ScrollArea className="h-table1">
              <TableHeader>
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
                      colSpan={table.getAllColumns.length}
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

      <Dialog open={projectModal.value} onOpenChange={projectModal.onToggle}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Project</DialogTitle>
            <DialogDescription>
              {!selectedProject && (
                <p className="text-orange-500">Select a project to assign</p>
              )}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Select onValueChange={handleProjectChange}>
              <SelectTrigger>
                <SelectValue placeholder="--Select--" />
              </SelectTrigger>
              <SelectContent>
                {projectList.data?.data.length &&
                  projectList.data?.data.map((project: any) => {
                    return (
                      <SelectItem key={project.id} value={project.uuid}>
                        {project.name}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Close
              </Button>
            </DialogClose>
            <Button
              onClick={handleAssignProject}
              type="button"
              variant="ghost"
              className="text-primary"
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
