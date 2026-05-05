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
import Image from 'next/image';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import TooltipWrapper from '../../components/tooltip.wrapper';
import SelectComponent from '../projects/el-kenya/select.component';
import { Project } from '@rahataid/sdk/project/project.types';

export type IVendor = {
  id: string;
  name: string;
  projectName: Array<{ Project: { id: string; uuid: string; name: string } }>;
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
  selectedRow: IVendor | null;
};

export default function VendorsTable({
  table,
  selectedProject,
  setSelectedProject,
  handleAssignProject,
  projectModal,
  selectedRow,
}: IProps) {
  const projectList = useProjectList({ page: 1, perPage: 1000 });

  const handleProjectChange = (d: UUID) => setSelectedProject(d);
  const vendorNameFilter =
    (table.getColumn('name')?.getFilterValue() as string) || '';
  const statusFilter =
    (table.getColumn('status')?.getFilterValue() as string) || '';
  const projectFilter =
    (table.getColumn('projectName')?.getFilterValue() as string) || '';
  const projectNames =
    (projectList?.data?.data && projectList.data.data.length > 0
      ? projectList.data.data.map((project: Project) => project?.name)
      : []) || [];

  return (
    <div className="border rounded shadow p-3">
      <div className="flex items-center mb-2 space-x-2">
        <Input
          placeholder="Search Vendors"
          value={vendorNameFilter}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="rounded w-full"
        />

        <SelectComponent
          onChange={(event) => {
            const nextStatusFilter: string =
              !event || event === 'All' ? '' : event;
            table.getColumn('status')?.setFilterValue(nextStatusFilter);
          }}
          name="Status"
          options={['All', 'Assigned', 'Pending']}
          value={statusFilter || 'All'}
        />

        <SelectComponent
          onChange={(event) => {
            const nextProjectFilter: string =
              !event || event === 'All' ? '' : event;
            table.getColumn('projectName')?.setFilterValue(nextProjectFilter);
          }}
          name="Project Name"
          options={['All', ...projectNames]}
          value={projectFilter || 'All'}
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
                    const assignedProjects = Array.isArray(
                      selectedRow?.projectName,
                    )
                      ? selectedRow.projectName
                      : [];
                    const isAssigned = assignedProjects.some(
                      (projectDetail) =>
                        projectDetail.Project?.uuid === project.uuid,
                    );

                    return (
                      <TooltipWrapper
                        key={project.id}
                        tip="Project Already Assigned"
                        disable={!isAssigned}
                      >
                        <SelectItem
                          disabled={isAssigned}
                          className="data-[disabled]:pointer-events-auto data-[disabled]:cursor-not-allowed"
                          value={project.uuid}
                        >
                          {project.name}
                        </SelectItem>
                      </TooltipWrapper>
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
