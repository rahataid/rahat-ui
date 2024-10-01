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
  TableBody,
  TableCell,
  Table as TableComponent,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Table, flexRender } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';

import { useProjectList } from '@rahat-ui/query';
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
import { UUID } from 'crypto';
import TableLoader from '../../components/table.loader';
import Image from 'next/image';

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
  selectedRow: any;
};

export default function VendorsTable({
  table,
  selectedProject,
  setSelectedProject,
  handleAssignProject,
  projectModal,
  selectedRow,
}: IProps) {
  const projectList = useProjectList({});
  const handleProjectChange = (d: UUID) => setSelectedProject(d);

  return (
    <div className="border rounded shadow p-3">
      <div className="flex items-center mb-2">
        <Input
          placeholder="Search User..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
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
      <div>
        {table.getRowModel().rows?.length ? (
          <>
            <TableComponent>
              <ScrollArea className="h-[calc(100vh-290px)]">
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
                  {table.getRowModel().rows.map((row) => (
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
                  ))}
                </TableBody>
              </ScrollArea>
            </TableComponent>
          </>
        ) : (
          <div className="w-full h-[calc(100vh-290px)]">
            <div className="flex flex-col items-center justify-center">
              <Image src="/noData.png" height={250} width={250} alt="no data" />
              <p className="text-medium text-base mb-1">No Data Available</p>
              <p className="text-sm mb-4 text-gray-500">
                There are no vendors to display at the moment
              </p>
            </div>
          </div>
        )}
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
                      <SelectItem
                        // disabled={selectedRow?.projectName === project.name} //TODO FROM ID
                        key={project.id}
                        value={project.uuid}
                      >
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
            <DialogClose asChild>
              <Button
                onClick={handleAssignProject}
                type="button"
                variant="ghost"
                className="text-primary"
              >
                Assign
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
