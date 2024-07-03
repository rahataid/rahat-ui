import * as React from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UUID } from 'crypto';
import {
  useBeneficiaryList,
  usePagination,
  useUpdateBeneficiaryGroup,
} from '@rahat-ui/query';
import MembersTable from '../../projects/aa/groups/members.table';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import useBeneficiaryTableColumn from './useBeneficiaryTableColumns';

type IProps = {
  groupUUID: UUID;
  groupName: string;
  groupedBeneficiaries: any;
  isGroupAssignedToProject: boolean;
};

export default function EditBeneficiaryGroups({
  groupUUID,
  groupName,
  groupedBeneficiaries,
  isGroupAssignedToProject,
}: IProps) {
  const { closeSecondPanel } = useSecondPanel();

  const { pagination, setNextPage, setPrevPage, setPerPage, setPagination } =
    usePagination();

  React.useEffect(() => {
    setPagination({ page: 1, perPage: 10, order: 'desc', sort: 'createdAt' });
  }, []);

  const { data } = useBeneficiaryList(pagination);

  const columns = useBeneficiaryTableColumn(
    groupedBeneficiaries,
    isGroupAssignedToProject,
  );

  const [rowSelection, setRowSelection] = React.useState({});

  const tableData = React.useMemo(() => {
    if (data?.data) {
      return data?.data?.map((d: any) => ({
        uuid: d.uuid,
        name: d.piiData.name,
        phone: d.piiData.phone,
        email: d.piiData.email,
        location: d.location,
      }));
    } else return [];
  }, [data?.data]);

  const table = useReactTable({
    manualPagination: true,
    data: tableData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Please enter group name.' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: groupName || '',
    },
  });

  const updateBeneficiaryGroup = useUpdateBeneficiaryGroup();

  const handleUpdateBeneficiaryGroup = async (
    data: z.infer<typeof FormSchema>,
  ) => {
    const members = table
      .getSelectedRowModel()
      .rows?.map((data) => ({ uuid: data?.original?.uuid }));
    const payload = { uuid: groupUUID, ...data, beneficiaries: members };
    try {
      await updateBeneficiaryGroup.mutateAsync(payload);
    } catch (e) {
      console.error('Error while creating beneficiary group::', e);
    }
  };

  React.useEffect(() => {
    updateBeneficiaryGroup.isSuccess && closeSecondPanel();
  }, [updateBeneficiaryGroup]);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleUpdateBeneficiaryGroup)}>
        <div className="p-4 h-[calc(100vh-310px)] bg-card">
          <h1 className="text-lg font-semibold mb-6">
            Edit : {isGroupAssignedToProject ? 'Members' : 'Beneficiary Group'}
          </h1>
          <div className="shadow-md p-4 rounded-sm">
            <div className="grid gap-4">
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
                          disabled={isGroupAssignedToProject}
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
                  <Button type="submit">Update Beneficiary Group</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 border rounded-sm shadow-md bg-card">
            <MembersTable
              table={table}
              scrollAreaHeight="h-[calc(100vh-590px)]"
            />
            <CustomPagination
              meta={data?.response?.meta || { total: 0, currentPage: 0 }}
              handleNextPage={setNextPage}
              handlePrevPage={setPrevPage}
              handlePageSizeChange={setPerPage}
              currentPage={pagination.page}
              perPage={pagination.perPage}
              total={data?.response?.meta.lastPage || 0}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
