'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';
import * as React from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { useProjectAction } from '@rahat-ui/query';
import { PROJECT_SETTINGS } from '../../constants/project.const';
import { MS_ACTIONS } from '@rahataid/sdk/constants';

import { useRumsanService } from '../../providers/service.provider';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  DialogClose,
  DialogFooter,
  DialogContent,
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { useBoolean } from '../../hooks/use-boolean';
import { useTableColumns } from './useTableColumns';
import { useAddVendors } from '../../hooks/el/contracts/el-contracts';
import { useSwal } from '../../components/swal';

export type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
  walletAddress: `0x${string}`;
};

export default function DataTableDemo() {
  const { vendorQuery, projectQuery } = useRumsanService();

  const projectModal = useBoolean();
  const [selectedProject, setSelectedProject] = React.useState('');
  const [selectedRow, setSelectedRow] = React.useState(null) as any;

  const updateVendor = useAddVendors(selectedProject, selectedRow?.id);

  const handleAssignModalClick = (row: any) => {
    setSelectedRow(row);
    projectModal.onTrue();
  };

  // const assignVendorToProjet = (project: string, payment: any) => {
  //   const updateVendor = useAddVendors(project, payment.id);
  //   return updateVendor.writeContractAsync({
  //     address: '0x9C8Ee9931BEc18EA883c8F23c7427016bBDeF171',
  //     args: [payment.walletAddress, true],
  //   });
  // };

  const columns = useTableColumns(handleAssignModalClick);

  const projectClient = useProjectAction();
  const projectsList = projectQuery.useProjectList({});
  const d = projectsList.data;
  const projectList = d?.data || [];

  const alert = useSwal();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { data: vendorData } = vendorQuery.useVendorList({
    perPage: 5,
    page: 1,
  });

  const table = useReactTable({
    data: vendorData?.data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleAssignProject = async () => {
    if (!selectedProject) return alert('Please select a project');

    const res = await projectClient.mutateAsync({
      uuid: selectedProject,
      data: {
        action: MS_ACTIONS.VENDOR.ASSIGN_TO_PROJECT,
        payload: {
          vendorUuid: selectedRow?.id,
        },
      },
    });

    // const res = await projectClient.mutateAsync({
    //   uuid: selectedProject,
    //   data: {
    //     action: MS_ACTIONS.SETTINGS.GET,
    //     payload: {
    //       name: PROJECT_SETTINGS.CONTRACTS,
    //     },
    //   },
    // });
    // if (!res.data.value) return alert('No contract found!');
    // const { value } = res.data;
    // console.log('Vendor==>', selectedRow.id);
    // console.log('Project==>', selectedProject);
    // return updateVendor.writeContractAsync({
    //   address: value.el.address, // value.el.address
    //   args: [selectedRow.walletAddress, true], // selecteWalletAddress
    // });
  };

  React.useEffect(() => {
    if (!projectClient) return;
    if (projectClient.isSuccess) {
      alert.fire({
        title: 'Vendor Assigned Successfully',
        icon: 'success',
      });
      projectClient.reset();
    }
    if (projectClient.isError) {
      alert.fire({
        title: 'Error while updating Vendor',
        icon: 'error',
      });
      projectClient.reset();
    }
  }, [projectClient, alert]);

  const handleProjectChange = (d: string) => setSelectedProject(d);

  return (
    <>
      <div className="w-full h-full -mt-2 p-2 bg-secondary">
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
        <div className="rounded border h-[calc(100vh-180px)]  bg-card">
          <Table>
            <ScrollArea className="w-full h-withPage p-4">
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
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </ScrollArea>
          </Table>
        </div>
      </div>

      <div className="sticky bottom-0 flex items-center justify-end space-x-4 px-4 py-1 border-t-2 bg-card">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} Users
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">Rows per page</div>
          <Select
            defaultValue="50"
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-16 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <div className="py-2 w-full border-t">
        <div className="p-4 flex flex-col gap-0.5 text-sm">
          <Dialog
            open={projectModal.value}
            onOpenChange={projectModal.onToggle}
          >
            {/* <DialogTrigger className=" hover:bg-muted p-1 rounded text-left">
              Assign Projects
            </DialogTrigger> */}
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Project</DialogTitle>
                <DialogDescription>
                  Select the project to be assigned to the beneficiary
                </DialogDescription>
              </DialogHeader>
              <div>
                <Select onValueChange={handleProjectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Projects" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectList.length > 0 &&
                      projectList.map((project: any) => {
                        return (
                          <SelectItem key={project.id} value={project.id}>
                            {project.title}
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
        </div>
      </div>
    </>
  );
}
