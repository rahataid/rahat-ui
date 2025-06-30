'use client';

import { Table, flexRender } from '@tanstack/react-table';
import { ChevronDown, Plus, Settings2 } from 'lucide-react';

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
import { ListBeneficiary } from '@rahat-ui/types';
import { useEffect, useState } from 'react';
import BulkAssignToProjectModal from './components/bulkAssignToProjectModal';
import CreateGroupModal from './components/createGroupModal';
import { DatePicker } from '../../components/datePicker';
import FiltersTags from '../projects/components/filtersTags';
import Image from 'next/image';
import AddButton from '../projects/components/add.btn';
import { useRouter } from 'next/navigation';

type IProps = {
  table: Table<ListBeneficiary>;
  handleBulkAssign: (selectedProject: string) => void;
  isBulkAssigning: boolean;
  projectModal: any;
  groupModal: any;
  projects: any;
  handleFilterProjectSelect: (selectedProject: string) => void;
  filters: Record<string, any>;
  handleCreateGroup: any;
  handleDateChange: any;
  setFilters?: any;
};

export default function ListView({
  table,
  handleBulkAssign,
  isBulkAssigning,
  projectModal,
  projects,
  handleFilterProjectSelect,
  filters,
  handleCreateGroup,
  groupModal,
  handleDateChange,
  setFilters,
}: IProps) {
  const [selectedProject, setSelectedProject] = useState<null | Record<
    string,
    any
  >>(null);

  const handleSelectProject = (project: Record<string, any>) => {
    setSelectedProject(project);
    handleFilterProjectSelect(project.value);
  };
  const router = useRouter();
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
      <BulkAssignToProjectModal
        handleSubmit={handleBulkAssign}
        projectModal={projectModal}
        selectedBeneficiaries={table
          .getSelectedRowModel()
          .rows.map((row) => row.original.walletAddress)}
      />
      <CreateGroupModal
        handleSubmit={handleCreateGroup}
        groupModal={groupModal}
        selectedBeneficiaries={table
          .getSelectedRowModel()
          .rows.map((row) => row.original.uuid)}
      />
      <div className="border rounded shadow p-3">
        <div className="flex space-x-2 items-center mb-2">
          <Input
            placeholder="Search name..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="rounded"
          />

          <DatePicker
            placeholder="Pick Start Date"
            handleDateChange={handleDateChange}
            type="start"
          />
          <DatePicker
            placeholder="Pick End Date"
            handleDateChange={handleDateChange}
            type="end"
          />

          {/* <DropdownMenu>
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
          </DropdownMenu> */}

          {/* <DropdownMenu>
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
          </DropdownMenu> */}
          <Button
            variant={'default'}
            type="button"
            onClick={() => router.push(`/beneficiary/add`)}
          >
            <Plus size={18} className="mr-1" /> Create Beneficiary
          </Button>
          {table.getSelectedRowModel().rows.length ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="ml-2">
                  {table.getSelectedRowModel().rows.length} - Beneficiary
                  Selected
                  <ChevronDown className="ml-1" strokeWidth={1.5} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={projectModal.onTrue}
                  disabled={isBulkAssigning}
                >
                  Bulk Assign Project
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={groupModal.onTrue}
                  // disabled={isBulkAssigning}
                >
                  Create Group
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>

        {Object.keys(filters).length != 0 && (
          <FiltersTags
            filters={filters}
            setFilters={setFilters}
            total={table.getRowModel().rows?.length}
          />
        )}
        <ScrollArea className="h-[calc(100vh-340px)]">
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
                    <div className="flex flex-col items-center justify-center">
                      <Image
                        src="/noData.png"
                        height={250}
                        width={250}
                        alt="no data"
                      />
                      <p className="text-medium text-base mb-1">
                        No Data Available
                      </p>
                      <p className="text-sm mb-4 text-gray-500">
                        There are no beneficiaries to display at the moment
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </TableComponent>
        </ScrollArea>
      </div>
    </>
  );
}
