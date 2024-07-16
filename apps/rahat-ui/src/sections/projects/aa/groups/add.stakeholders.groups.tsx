import * as React from 'react';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UUID } from 'crypto';
import useMembersTableColumn from './useMembersTable';
import {
  useStakeholders,
  useStakeholdersStore,
  usePagination,
  useCreateStakeholdersGroups,
} from '@rahat-ui/query';
import CustomPagination from '../../../../components/customPagination';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { toast } from 'react-toastify';
import StakeholdersTableFilters from '../stakeholders/stakeholders.table.filters';
import StakeholdersTable from '../stakeholders/stakeholders.table';

export default function AddStakeholdersGroups() {
  const params = useParams();
  const projectId = params.id as UUID;
  const router = useRouter();
  const [showMembers, setShowMembers] = React.useState(false);

  const groupsListPath = `/projects/aa/${projectId}/groups`;

  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setFilters,
    filters,
  } = usePagination();

  React.useEffect(() => {
    setPagination({ page: 1, perPage: 10 });
  }, []);

  useStakeholders(projectId, { ...pagination, ...filters });

  const { stakeholders, stakeholdersMeta } = useStakeholdersStore((state) => ({
    stakeholders: state.stakeholders,
    stakeholdersMeta: state.stakeholdersMeta,
  }));

  const columns = useMembersTableColumn();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    manualPagination: true,
    data: stakeholders ?? [],
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

  const createStakeholdersGroup = useCreateStakeholdersGroups();

  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Please enter group name.' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleCreateStakeholdersGroups = async (
    data: z.infer<typeof FormSchema>,
  ) => {
    const stakeHolders = table
      .getSelectedRowModel()
      .rows?.map((stakeholder: any) => ({ uuid: stakeholder?.original?.uuid }));
    try {
      if (!stakeHolders.length) {
        toast.error('Please select members to create group');
        return;
      }
      await createStakeholdersGroup.mutateAsync({
        projectUUID: projectId,
        stakeholdersGroupPayload: {
          ...data,
          stakeholders: stakeHolders,
        },
      });
    } catch (e) {
      console.error('Creating Stakeholders Group Error::', e);
    } finally {
      if (stakeHolders.length) {
        form.reset();
        table.resetRowSelection();
      }
    }
  };

  React.useEffect(() => {
    if (createStakeholdersGroup.isSuccess) {
      router.push(groupsListPath);
    }
  }, [createStakeholdersGroup.isSuccess]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateStakeholdersGroups)}>
        <div className="p-4 h-[calc(100vh-130px)] bg-card">
          <h1 className="text-lg font-semibold mb-6">
            Add : Stakeholders Groups
          </h1>
          <div className="shadow-md p-4 rounded-sm">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Group Name</FormLabel>
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
                <div className="flex gap-4 items-end">
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
                  <Button type="submit">Create Stakeholders Groups</Button>
                </div>
              </div>
            </div>
          </div>
          {showMembers && (
            <div className="mt-4">
              <StakeholdersTableFilters
                projectID={projectId}
                filters={filters}
                setFilters={setFilters}
              />
              <div className="mt-2 border rounded-sm shadow-md bg-card">
                <StakeholdersTable
                  table={table}
                  tableScrollAreaHeight="h-[calc(100vh-418px)]"
                />
                <CustomPagination
                  meta={
                    stakeholdersMeta || {
                      total: 0,
                      currentPage: 0,
                      lastPage: 0,
                      perPage: 0,
                      next: null,
                      prev: null,
                    }
                  }
                  handleNextPage={setNextPage}
                  handlePrevPage={setPrevPage}
                  handlePageSizeChange={setPerPage}
                  currentPage={pagination.page}
                  perPage={pagination.perPage}
                  total={stakeholdersMeta?.lastPage || 0}
                />
              </div>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
