import React from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  CustomPagination,
  DemoTable,
  Heading,
  SearchInput,
} from 'apps/rahat-ui/src/common';
import {
  useCreateBeneficiaryGroup,
  usePagination,
  useProjectBeneficiaries,
} from '@rahat-ui/query';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useSelectBeneficiaryColumns } from './useSelectBeneficiaryColumns';
import { toast } from 'react-toastify';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function CreateBeneficiaryGroup() {
  const { id: projectUUID } = useParams() as { id: UUID };
  const router = useRouter();

  const FormSchema = z.object({
    name: z
      .string()
      .min(4, { message: 'Group name must be at least 4 character' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    },
  });

  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    selectedListItems,
    setSelectedListItems,
    setPagination,
  } = usePagination();

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  console.log({ selectedListItems });

  const projectBeneficiaries = useProjectBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID,
  });

  const beneficiaries = projectBeneficiaries.data?.response?.data || [];
  const meta = projectBeneficiaries?.data?.response?.meta || {};

  const tableData = React.useMemo(
    () =>
      beneficiaries?.map((ben) => ({
        uuid: ben.uuid,
        name: ben.piiData?.name,
        phoneNumber: ben.piiData?.phone,
        walletAddress: ben.walletAddress,
      })),

    [beneficiaries],
  );

  const columns = useSelectBeneficiaryColumns();

  const table = useReactTable({
    manualPagination: true,
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setSelectedListItems,
    getRowId: (row) => row.uuid,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      rowSelection: selectedListItems,
      columnFilters,
    },
  });

  const selectedBeneficiaryCount = Object.keys(selectedListItems).length || 0;

  const selectedBeneficiaries = table
    .getSelectedRowModel()
    .rows?.map((row) => ({ uuid: row.original?.uuid }));

  const handleClear = () => {
    setSelectedListItems({});
  };

  const createBeneficiaryGroup = useCreateBeneficiaryGroup();

  const handleBeneficiaryGroupCreation = async (
    data: z.infer<typeof FormSchema>,
  ) => {
    try {
      const payload = {
        name: data?.name,
        beneficiaries: selectedBeneficiaries,
        projectId: projectUUID,
      };

      const result = await createBeneficiaryGroup.mutateAsync(payload);
      if (result) {
        toast.success('Beneficiary group added successfully!');
        router.push(
          `/projects/aidlink/${projectUUID}/beneficiary?tab=beneficiaryGroups`,
        );
      }
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || 'Failed to add beneficiary group!',
      );
    }
  };

  return (
    <div className="p-4 space-y-4 bg-gray-50">
      {/* Header */}
      <Heading
        title="Create Beneficiary Group"
        description="Select beneficiaries from the list below to create a group"
        backBtn
        path={`/projects/aidlink/${projectUUID}/beneficiary?tab=beneficiaryGroups`}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleBeneficiaryGroupCreation)}>
          {/* Group Name Input */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <FormItem className="mb-4">
                  <FormLabel>Beneficiary Group Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter group name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="border rounded-sm p-4">
            {/* Select Beneficiaries Section */}
            <div className="space-y-4">
              <Heading
                title="Select Beneficiaries"
                titleStyle="text-lg font-semibold"
                description="Select beneficiaries from the list below to create a group"
              />

              {/* Search Input */}
              <SearchInput
                name="beneficiary name"
                value={
                  (table.getColumn('name')?.getFilterValue() as string) ?? ''
                }
                onSearch={(event: React.ChangeEvent<HTMLInputElement>) =>
                  table.getColumn('name')?.setFilterValue(event.target.value)
                }
              />

              {/* Beneficiary Table */}
              <DemoTable table={table} tableHeight="h-[calc(100vh-530px)]" />
              <CustomPagination
                currentPage={pagination.page}
                handleNextPage={setNextPage}
                handlePageSizeChange={setPerPage}
                handlePrevPage={setPrevPage}
                perPage={pagination.perPage}
                setPagination={setPagination}
                meta={meta || { total: 0, currentPage: 0 }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={handleClear}>
                Clear
              </Button>
              <Button disabled={selectedBeneficiaryCount === 0}>
                Add ({selectedBeneficiaryCount} beneficiaries)
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
