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
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getColumnLabel } from 'apps/rahat-ui/src/utils/getColumnLabel';
// import BulkAssignToProjectModal from './components/bulkAssignToProjectModal';
// import CreateGroupModal from './components/createGroupModal';

type IProps = {
  table: Table<ListBeneficiaryGroup>;
  handleBulkAssign: (selectedProject: string) => void;
  isBulkAssigning: boolean;
  groupModal: any;
  projects: any;
  handleFilterProjectSelect: (selectedProject: string) => void;
  filters: Record<string, any>;
};

export default function ListView({
  table,
  handleBulkAssign,
  isBulkAssigning,
  projects,
  handleFilterProjectSelect,
  filters,
  groupModal,
}: IProps) {
  const [selectedProject, setSelectedProject] = useState<null | Record<
    string,
    any
  >>(null);
  const t = useTranslations('GLOBAL');

  const handleSelectProject = (project: Record<string, any>) => {
    setSelectedProject(project);
    handleFilterProjectSelect(project.value);
  };

  const selectFilterProjectItems = [
    {
      name: t('ALL') || 'All',
      value: undefined,
    },
    {
      name: t('NOT_ASSIGNED'),
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
      <div className="border rounded shadow p-3">
        <div className="flex items-center mb-2">
          <Input
            placeholder={t('FILTER_BENEFICIARY_GROUPS')}
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="rounded"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                {selectedProject ? selectedProject.name : t('SELECT_PROJECT')}
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
                {t('VIEW')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('TOGGLE_COLUMNS')}</DropdownMenuLabel>
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
                      {getColumnLabel(column)}
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
              {/* <DropdownMenuContent align="end"> */}
              {/* <DropdownMenuItem
                // onClick={projectModal.onTrue}
                // disabled={isBulkAssigning}
                >
                  Bulk Assign Project
                </DropdownMenuItem> */}
              {/* </DropdownMenuContent> */}
            </DropdownMenu>
          ) : null}
        </div>
        <TableComponent>
          <ScrollArea className="h-[calc(100vh-340px)]">
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
                        {t('NO_DATA_AVAILABLE')}
                      </p>
                      <p className="text-sm mb-4 text-gray-500">
                        {t('THERE_ARE_NO_GROUPS_TO_DISPLAY')}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ScrollArea>
        </TableComponent>
      </div>
    </>
  );
}
