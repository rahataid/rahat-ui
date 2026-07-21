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
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('Beneficiary List');
  const g = useTranslations('GLOBAL');

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
            placeholder={t('SEARCH_NAME')}
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="rounded"
          />

          <DatePicker
            placeholder={t('PICK_START_DATE')}
            handleDateChange={handleDateChange}
            type="start"
            selectedDate={filters?.startDate}
            maxDate={filters?.endDate}
          />
          <DatePicker
            placeholder={t('PICK_END_DATE')}
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
            <Plus size={18} className="mr-1" /> {t('CREATE_BENEFICIARY')}
          </Button>
          {Object.values(table.getState().rowSelection).filter(Boolean)
            .length ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="ml-2">
                  {Object.values(table.getState().rowSelection).filter(Boolean)
                    .length}{' '}
                  - {t('BENEFICIARY_SELECTED')}
                  <ChevronDown className="ml-1" strokeWidth={1.5} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={projectModal.onTrue}
                  disabled={isBulkAssigning}
                >
                  {t('BULK_ASSIGN_PROJECT')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={groupModal.onTrue}
                  // disabled={isBulkAssigning}
                >
                  {g('CREATE_GROUP')}
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
                        {g('NO_DATA_AVAILABLE')}
                      </p>
                      <p className="text-sm mb-4 text-gray-500">
                        {t('THERE_ARE_NO_BENEFICIARIES_TO_DISPLAY')}
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
