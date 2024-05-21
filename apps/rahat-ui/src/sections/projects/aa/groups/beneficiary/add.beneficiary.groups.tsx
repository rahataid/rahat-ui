import { zodResolver } from '@hookform/resolvers/zod';
import { usePagination, useProjectBeneficiaries } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useParams } from 'next/navigation';
import * as React from 'react';

import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { UUID } from 'crypto';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useProjectBeneficiaryTableColumns } from '../../beneficiary/use-table-column';
import BeneficiaryMembersTable from '../beneficiary.members.table';

export default function AddBeneficiaryGroups() {
  const [showMembers, setShowMembers] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const uuid = useParams().id as UUID;

  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setSelectedListItems,
    selectedListItems,
    filters,
  } = usePagination();

  const projectBeneficiaries = useProjectBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'updatedAt',
    projectUUID: uuid,
    ...filters,
  });

  React.useEffect(() => {
    setPagination({ page: 1, perPage: 10 });
  }, []);

  const columns = useProjectBeneficiaryTableColumns();

  const table = useReactTable({
    manualPagination: true,
    data: projectBeneficiaries?.data?.data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (row) => row.wallet,
    onRowSelectionChange: setSelectedListItems,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Please enter group name.' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    },
  });

  //   const handleCreateStakeholdersGroups = async (
  //     data: z.infer<typeof FormSchema>,
  //   ) => {
  //     const stakeHolders = table
  //       .getSelectedRowModel()
  //       .rows?.map((stakeholder: any) => ({ uuid: stakeholder?.original?.uuid }));
  //     try {
  //       if (!stakeHolders.length) {
  //         toast.error('Please select members to create group');
  //         return;
  //       }
  //       await createStakeholdersGroup.mutateAsync({
  //         projectUUID: projectId as UUID,
  //         stakeholdersGroupPayload: {
  //           ...data,
  //           stakeholders: stakeHolders,
  //         },
  //       });
  //     } catch (e) {
  //       console.error('Creating Stakeholders Group Error::', e);
  //     } finally {
  //       if (stakeHolders.length) {
  //         form.reset();
  //         table.resetRowSelection();
  //       }
  //     }
  //   };

  return (
    <Form {...form}>
      <form
      //   onSubmit={form.handleSubmit(handleCreateStakeholdersGroups)}
      >
        <div className="p-4 h-[calc(100vh-130px)] bg-card">
          <h1 className="text-lg font-semibold mb-6">
            Add : Beneficiaries Groups
          </h1>
          <div className="shadow-md p-4 rounded-sm">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Group name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <div className="flex justify-end">
                <div className="flex gap-4">
                  {table.getSelectedRowModel().rows.length ? (
                    <Badge className="rounded h-10 px-4 py-2 w-max">
                      {table.getSelectedRowModel().rows.length} - member
                      selected
                    </Badge>
                  ) : null}
                  <Button
                    type="button"
                    onClick={() => setShowMembers(!showMembers)}
                  >
                    {showMembers ? 'Hide Members' : 'Show Members'}
                  </Button>
                  <Button type="submit">Create Beneficiary Groups</Button>
                </div>
              </div>
            </div>
          </div>
          {showMembers && (
            <div className="mt-4">
              <div className="mt-2 border rounded-sm shadow-md bg-card">
                <BeneficiaryMembersTable table={table} />
                <CustomPagination
                  currentPage={pagination.page}
                  handleNextPage={setNextPage}
                  handlePageSizeChange={setPerPage}
                  handlePrevPage={setPrevPage}
                  meta={projectBeneficiaries.data?.response?.meta || {}}
                  perPage={pagination.perPage}
                />
              </div>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
