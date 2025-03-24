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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { UUID } from 'crypto';
import TableLoader from '../../components/table.loader';
import Image from 'next/image';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import SelectComponent from '../projects/el-kenya/select.component';

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
  const projectNames =
    (projectList?.data?.data?.length > 0 &&
      projectList?.data?.data?.map((project: any) => ({
        label: project?.name,
        value: project?.name,
      }))) ||
    [];
  console.log(projectNames);

  return (
    <div className="border rounded shadow p-3">
      <div className="flex items-center mb-2 space-x-2">
        <Input
          placeholder="Search Vendors"
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="rounded w-full"
        />

        <SelectComponent
          onChange={(event) => {
            table
              .getColumn('status')
              ?.setFilterValue(event === 'All' ? '' : event);
          }}
          name="Status"
          options={[
            { label: 'All', value: 'All' },
            { label: 'Assigned', value: 'Assigned' },
            { label: 'Not Assigned', value: 'Not Assigned' },
            { label: 'Pending', value: 'Pending' },
          ]}
          value={(table.getColumn('status')?.getFilterValue() as string) || ''}
        />

        <SelectComponent
          onChange={(event) => {
            table
              .getColumn('projectName')
              ?.setFilterValue(event === 'All' ? '' : event);
          }}
          name="Project Name"
          options={['All', ...projectNames]}
          value={
            (table.getColumn('projectName')?.getFilterValue() as string) || ''
          }
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
            <ScrollArea className="h-[calc(100vh-285px)]">
              <TableComponent>
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
              </TableComponent>
            </ScrollArea>
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
                <p>Select a project to assign the selected vendor</p>
              )}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label>Project</Label>
            <Select onValueChange={handleProjectChange}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select Project Name" />
              </SelectTrigger>
              <SelectContent>
                {projectList.data?.data.length ? (
                  projectList.data?.data.map((project: any) => {
                    return (
                      <SelectItem
                        disabled={selectedRow?.projectName === project.name} //TODO FROM ID
                        key={project.id}
                        value={project.uuid}
                      >
                        {project.name}
                      </SelectItem>
                    );
                  })
                ) : (
                  <p className="text-xs">No project found</p>
                )}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="w-full" type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                className="w-full"
                onClick={handleAssignProject}
                type="button"
              >
                Confirm
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
