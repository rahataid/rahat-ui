'use client';

import { Table, flexRender } from '@tanstack/react-table';
import { ChevronDown, Plus } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import BulkAssignToProjectModal from './components/bulkAssignToProjectModal';
import CreateGroupModal from './components/createGroupModal';
import { DatePicker } from '../../components/datePicker';
import FiltersTags from '../projects/components/filtersTags';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type IProps = {
  table: Table<ListBeneficiary>;
  handleBulkAssign: (selectedProject: string) => void;
  isBulkAssigning: boolean;
  projectModal: any;
  groupModal: any;
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
  filters,
  handleCreateGroup,
  groupModal,
  handleDateChange,
  setFilters,
}: IProps) {
  const router = useRouter();

  return (
    <>
      <BulkAssignToProjectModal
        handleSubmit={handleBulkAssign}
        projectModal={projectModal}
        selectedBeneficiaries={Object.keys(table.getState().rowSelection).filter(
          (k) => table.getState().rowSelection[k],
        )}
      />
      <CreateGroupModal
        handleSubmit={handleCreateGroup}
        groupModal={groupModal}
        selectedBeneficiaries={Object.keys(table.getState().rowSelection).filter(
          (k) => table.getState().rowSelection[k],
        )}
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
            selectedDate={filters?.startDate}
            maxDate={filters?.endDate}
          />
          <DatePicker
            placeholder="Pick End Date"
            handleDateChange={handleDateChange}
            type="end"
            selectedDate={filters?.endDate}
            minDate={filters?.startDate}
          />

          <Button
            variant={'default'}
            type="button"
            onClick={() => router.push(`/beneficiary/add`)}
          >
            <Plus size={18} className="mr-1" /> Create Beneficiary
          </Button>
          {Object.values(table.getState().rowSelection).filter(Boolean)
            .length ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="ml-2">
                  {Object.values(table.getState().rowSelection).filter(Boolean)
                    .length}{' '}
                  - Beneficiary Selected
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
