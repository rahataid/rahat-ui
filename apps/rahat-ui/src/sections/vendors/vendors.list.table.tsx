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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import { UUID } from 'crypto';
import Image from 'next/image';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import TooltipWrapper from '../../components/tooltip.wrapper';
import { SearchInput } from '../../common';
import { Project } from '@rahataid/sdk/project/project.types';
import { useTranslations } from 'next-intl';
import { getColumnLabel } from 'apps/rahat-ui/src/utils/getColumnLabel';
import {
  VendorFilterTags,
  VendorProjectFilter,
  VendorStatusFilter,
} from './vendors.table.filters';

export type IVendor = {
  id: string;
  name: string;
  projectName: Array<{ Project: { id: string; uuid: string; name: string } }>;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
  walletAddress: `0x${string}`;
  phone: string;
  gender: 'MALE' | 'FEMALE' | 'UNKNOWN';
  projectArea?: string;
  registeredApps?: string[];
};

type ProjectModalType = {
  value: boolean;
  onToggle: () => void;
};

type ColumnMeta = {
  className?: string;
};
type IProps = {
  table: Table<IVendor>;
  selectedProject: UUID | undefined;
  setSelectedProject: (id: UUID) => void;
  handleAssignProject: VoidFunction;
  projectModal: ProjectModalType;
  selectedRow: IVendor | null;
  total: number;
};

export default function VendorsTable({
  table,
  selectedProject,
  setSelectedProject,
  handleAssignProject,
  projectModal,
  selectedRow,
  total,
}: IProps) {
  const t = useTranslations('VENDORS_LIST');
  const g = useTranslations('GLOBAL');
  const projectList = useProjectList({ page: 1, perPage: 1000 });

  const handleProjectChange = (d: UUID) => setSelectedProject(d);
  const vendorNameFilter =
    (table.getColumn('name')?.getFilterValue() as string) || '';
  const statusFilter =
    (table.getColumn('status')?.getFilterValue() as string) || '';
  const projectFilter =
    (table.getColumn('projectName')?.getFilterValue() as string) || '';
  const projectNames =
    projectList?.data?.data
      ?.map((project: Project) => project.name)
      .filter((name): name is string => Boolean(name)) ?? [];
  const activeFilters = [
    {
      key: 'name',
      label: g('NAME'),
      value: vendorNameFilter,
      clear: () => table.getColumn('name')?.setFilterValue(''),
    },
    {
      key: 'status',
      label: g('STATUS'),
      value:
        statusFilter === 'Assigned'
          ? g('ASSIGNED')
          : statusFilter === 'Pending'
          ? g('PENDING')
          : statusFilter,
      clear: () => table.getColumn('status')?.setFilterValue(''),
    },
    {
      key: 'projectName',
      label: g('PROJECT_NAME'),
      value: projectFilter,
      clear: () => table.getColumn('projectName')?.setFilterValue(''),
    },
  ].filter((filter) => filter.value);

  return (
    <div className="border rounded shadow p-3">
      <div className="grid grid-cols-1 gap-3 mb-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_minmax(180px,1fr)_minmax(220px,1fr)_auto]">
        <SearchInput
          className="w-full"
          name={t('VENDORS')}
          placeholder={t('SEARCH_VENDORS_BY_NAME')}
          value={vendorNameFilter}
          onSearch={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
        />
        {/* Status Filter Section */}
        <VendorStatusFilter
          onChange={(value) => table.getColumn('status')?.setFilterValue(value)}
        />
        {/* Project Filter Section */}
        <VendorProjectFilter
          projectNames={projectNames}
          onChange={(value) =>
            table.getColumn('projectName')?.setFilterValue(value)
          }
        />

        {/* Column Hide and Reveal */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Settings2 className="mr-2 h-4 w-5" />
              {g('VIEW')}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{g('TOGGLE_COLUMNS')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {getColumnLabel(column)}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <VendorFilterTags
        filters={activeFilters}
        total={total}
        onClearAll={() => table.resetColumnFilters()}
      />
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
                          <TableHead
                            key={header.id}
                            className={
                              (
                                header.column.columnDef.meta as
                                  | ColumnMeta
                                  | undefined
                              )?.className
                            }
                          >
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
                        <TableCell
                          key={cell.id}
                          className={
                            (
                              cell.column.columnDef.meta as
                                | ColumnMeta
                                | undefined
                            )?.className
                          }
                        >
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
              <p className="text-medium text-base mb-1">
                {g('NO_DATA_AVAILABLE')}
              </p>
              <p className="text-sm mb-4 text-gray-500">
                {t('THERE_ARE_NO_VENDORS_TO_DISPLAY')}
              </p>
            </div>
          </div>
        )}
      </div>
      <Dialog open={projectModal.value} onOpenChange={projectModal.onToggle}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{g('ASSIGN_PROJECT')}</DialogTitle>
            <DialogDescription>
              {!selectedProject && <p>{t('SELECT_A_PROJECT_TO_ASSIGN_THE')}</p>}
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label>{t('PROJECT')}</Label>
            <Select onValueChange={handleProjectChange}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder={t('SELECT_PROJECT_NAME')} />
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
                        tip={t('PROJECT_ALREADY_ASSIGNED')}
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
                  <p className="text-xs">{t('NO_PROJECT_FOUND')}</p>
                )}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="w-full" type="button" variant="secondary">
                {g('CLOSE')}
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                className="w-full"
                onClick={handleAssignProject}
                type="button"
              >
                {g('CONFIRM')}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
