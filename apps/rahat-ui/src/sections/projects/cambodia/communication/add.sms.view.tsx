import { UUID } from 'crypto';
import HeaderWithBack from '../../components/header.with.back';
import { useParams, useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
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
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import SearchInput from '../../components/search.input';
import ViewColumns from '../../components/view.columns';
import SelectComponent from '../select.component';
import CambodiaTable from '../table.component';
import { usePagination } from '@rahat-ui/query';
import React from 'react';
import { useAudienceTableColumns } from './use.audience.table.columns';

export default function AddSMSView() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();

  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 4 character' }),
    message: z
      .string()
      .min(5, { message: 'message must be at least 5 character' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      message: '',
    },
  });

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const {
    pagination,
    filters,
    setFilters,
    setNextPage,
    setPrevPage,
    setPerPage,
    selectedListItems,
    setSelectedListItems,
    setPagination,
    resetSelectedListItems,
  } = usePagination();

  const columns = useAudienceTableColumns();
  const table = useReactTable({
    manualPagination: true,
    data: [
      { uuid: '123', name: 'A1' },
      { uuid: '456', name: 'B1' },
    ],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setSelectedListItems,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId(originalRow) {
      return originalRow.uuid;
    },

    state: {
      columnVisibility,
      rowSelection: selectedListItems,
    },
  });

  const handleAddSMS = async (data: z.infer<typeof FormSchema>) => {};
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAddSMS)}>
          <div className="p-4">
            <HeaderWithBack
              title="Add SMS"
              subtitle="Create a new SMS text"
              path={`/projects/el-cambodia/${id}/communication`}
            />
            <div className="border rounded-md p-4 mb-4 flex flex-col space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Campaign Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter campaign name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type your message here"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="border rounded-md p-4">
              <div className="flex justify-between space-x-2 mb-2">
                <SearchInput
                  className="w-full"
                  name="Audience"
                  onSearch={() => {}}
                />
                <SelectComponent
                  className="w-72"
                  name="project"
                  options={['a', 'b', 'c']}
                />
                <ViewColumns table={table} />
              </div>
              <CambodiaTable
                table={table}
                tableHeight="h-[calc(100vh-582px)]"
              />
            </div>
          </div>
          <div className="border-t flex justify-between items-center p-4">
            <p className="text-muted-foreground text-sm">
              {Object.keys(selectedListItems)?.length ?? 0} Audience Selected
            </p>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  router.push(`/projects/el-cambodia/${id}/communication`)
                }
              >
                Cancel
              </Button>
              <Button className="px-10">Add</Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
