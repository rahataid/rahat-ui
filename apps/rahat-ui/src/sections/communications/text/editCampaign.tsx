'use client';

import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@rahat-ui/shadcn/src/utils';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/components/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/components/table';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/components/form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';

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

import { Audience, CAMPAIGN_TYPES } from '@rahat-ui/types';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Input } from '@rahat-ui/shadcn/components/input';
import { Calendar } from '@rahat-ui/shadcn/components/calendar';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import {
  ServiceContext,
  ServiceContextType,
  useRumsanService,
} from 'apps/rahat-ui/src/providers/service.provider';
import {
  useListTransport,
  useListAudience,
  useCreateAudience,
  useUpdateCampaign,
  useGetCampaign,
} from '@rumsan/communication-query';

export default function EditCampaign() {
  const params = useParams<{ tag: string; id: string }>();
  const [showAudiences, setShowAudiences] = useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedRows, setSelectedRows] = useState<
    Array<{ id: number; phone: string; name: string }>
  >([]);

  // const { communicationQuery, beneficiaryQuery } = React.useContext(
  //   ServiceContext,
  // ) as ServiceContextType;
  const { data: transportData } = useListTransport();
  const { data: audienceData } = useListAudience();
  let beneficiaryData;
  // = beneficiaryQuery.useBeneficiaryPii();

  const { data, isSuccess, isLoading } = useGetCampaign({
    id: Number(params.id),
  });
  const createAudience = useCreateAudience();

  const editCampaign = useUpdateCampaign();

  const FormSchema = z.object({
    campaignName: z.string().min(2, {
      message: 'Campaign Name must be at least 2 characters.',
    }),
    startTime: z.date({
      required_error: 'Start time is required.',
    }),
    campaignType: z.string({
      required_error: 'Camapign Type is required.',
    }),
    transport: z.string({
      required_error: 'Transport is required.',
    }),
    message: z.string({}),
    audiences: z.array(z.number()),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      campaignName: '',
      audiences: [],
    },
  });
  useEffect(() => {
    if (data) {
      // const audienceIds =
      //   data?.data?.audiences?.map((audience) => audience?.id) || [];

      data?.data?.audiences?.map((audience) => {
        setSelectedRows((prevSelectedRows) => [
          ...prevSelectedRows,
          {
            name: audience?.details.name,
            id: audience?.id,
            phone: audience?.details?.phone,
          },
        ]);
      });

      form.setValue('campaignName', data?.data?.name);
      form.setValue(
        'message',
        data?.data?.details.body
          ? data?.data?.details.body
          : data?.data?.details.message || '',
      );
      console.log(data.data);

      form.setValue('campaignType', data?.data?.type);
      form.setValue('startTime', new Date(data?.data?.startTime));
      form.setValue('transport', data?.data?.transport?.id.toString());
      // form.setValue('audiences', audienceIds);
    }
  }, [data, form]);

  const handleEditCampaign = async (data: z.infer<typeof FormSchema>) => {
    // const audiences = data.audiences.map((data) => Number(data));
    console.log(audienceData);

    const audiences = audienceData?.data
      .filter((audienceObject: any) =>
        selectedRows?.some(
          (selectedObject) =>
            selectedObject.phone === audienceObject?.details?.phone,
        ),
      )
      .map((filteredObject: any) => filteredObject.id);
    type AdditionalData = {
      audio?: any;
      message?: string;
      body?: string;
    };

    const additionalData: AdditionalData = {};

    // if (data?.campaignType === 'PHONE' && data?.file) {
    //   additionalData.audio = data.file;
    // }

    if (data?.campaignType === 'WHATSAPP' && data?.message) {
      additionalData.body = data?.message;
    }
    if (
      data?.campaignType !==
        (CAMPAIGN_TYPES.PHONE && CAMPAIGN_TYPES.WHATSAPP) &&
      data?.message
    ) {
      additionalData.message = data?.message;
    }
    editCampaign
      .mutateAsync({
        audienceIds: audiences,
        name: data.campaignName,
        startTime: data.startTime,
        transportId: Number(data.transport),
        type: data.campaignType,
        details: additionalData,
        id: params.id,
      })
      .then((data) => {
        if (data) {
          toast.success('Campaign Edit Success.');
        }
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  const columns: ColumnDef<any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={beneficiaryData?.data?.length === selectedRows.length}
          onCheckedChange={(value) => {
            if (value && selectedRows.length === 0) {
              // const item = beneficiaryData && beneficiaryData?.data;
              beneficiaryData?.data?.map((item) => {
                const checkAudienceExist = audienceData?.data.some(
                  (audience: Audience) =>
                    audience?.details?.phone === item.phone,
                );

                if (!checkAudienceExist) {
                  createAudience.mutateAsync({
                    details: {
                      name: item.name,
                      phone: item.phone,
                    },
                  });
                }
                console.log(selectedRows, item);

                setSelectedRows((prevSelectedRows) => [
                  ...prevSelectedRows,
                  {
                    name: item.name,
                    id: item.beneficiaryId,
                    phone: item.phone,
                  },
                ]);
              });
            } else if (!value) {
              setSelectedRows([]);
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={
            selectedRows &&
            selectedRows.some((data) => data.phone === row?.original.phone)
          }
          aria-label="Select row"
          onCheckedChange={(checked) => {
            const item = row.original;

            const checkAudienceExist = audienceData?.data.some(
              (audience: Audience) => audience?.details?.phone === item.phone,
            );

            if (!checkAudienceExist) {
              createAudience.mutateAsync({
                details: {
                  name: item.name,
                  phone: item.phone,
                },
              });
            }
            console.log(selectedRows, checked, item, selectedRows[row.id], row);

            setSelectedRows((prevSelectedRows) =>
              checked
                ? [...prevSelectedRows, item]
                : selectedRows?.filter((value) => value.id !== item.id),
            );
          }}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
  ];

  const tableData = React.useMemo(() => {
    return (
      beneficiaryData &&
      beneficiaryData?.data?.map((item: any) => ({
        name: item?.name,
        id: item?.beneficiaryId,
        phone: item?.phone,
      }))
    );
  }, [beneficiaryData]);

  const table = useReactTable({
    data: tableData,
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

  return (
    <>
      {isLoading || data === undefined ? (
        <p>Loading . . .</p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleEditCampaign)}
            className="h-add"
          >
            <div className="w-full p-4 bg-white">
              <h2 className="text-lg font-semibold mb-4">Campaign: Edit</h2>
              <div className="shadow-md p-4 rounded-sm">
                <div className="mb-4 w-full grid grid-cols-3 gap-4 ">
                  <FormField
                    control={form.control}
                    name="campaignName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="rounded"
                            placeholder="Campaign Name"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        {/* <FormLabel>Start time</FormLabel> */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                // className={cn(
                                //   '!mt-[15px] w-[240px] pl-3 text-left font-normal',
                                //   !field.value && 'text-muted-foreground'
                                // )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Start time</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="campaignType"
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel>Campaign Type</FormLabel> */}
                        <Select
                          // onValueChange={(e) => {
                          //   field.onChange(e);
                          //   handleTypeChange(e);
                          // }}
                          onValueChange={field.onChange}
                          defaultValue={field.value || data?.data?.type}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded">
                              <SelectValue placeholder="Select campaign type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.keys(CAMPAIGN_TYPES).map((key) => {
                              if (key !== CAMPAIGN_TYPES.PHONE)
                                return (
                                  <SelectItem value={key}>{key}</SelectItem>
                                );
                            })}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* show only if selected is sms */}
                  {/* {!showSelectAudio ? ( */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel>Message</FormLabel> */}
                        <FormControl>
                          <Input
                            placeholder="Message"
                            {...field}
                            className="rounded"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="transport"
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel>Transport</FormLabel> */}
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={
                            field?.value?.toString() ||
                            data?.data?.transport?.id.toString()
                          }
                        >
                          <FormControl>
                            <SelectTrigger className="rounded">
                              <SelectValue placeholder="Select transport" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {transportData !== undefined &&
                              transportData?.data?.map((data) => {
                                return (
                                  <SelectItem
                                    key={data.id}
                                    value={data.id.toString()}
                                  >
                                    {data.name}
                                  </SelectItem>
                                );
                              })}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    className="text-primary border-primary mr-4"
                    onClick={() => setShowAudiences(!showAudiences)}
                    type="button"
                  >
                    {showAudiences ? 'Hide Audiences' : 'Select Audiences'}
                  </Button>
                  <Button>Edit Campaign</Button>
                </div>
              </div>

              {showAudiences && (
                <div className="mt-6 shadow-md rounded-sm p-4">
                  <div className="flex justify-between">
                    <p>Select Audiences</p>
                    <Input
                      placeholder="Filter campaigns..."
                      value={
                        (table.getColumn('name')?.getFilterValue() as string) ??
                        ''
                      }
                      onChange={(event) =>
                        table
                          .getColumn('name')
                          ?.setFilterValue(event.target.value)
                      }
                      className="max-w-sm mr-3"
                    />
                    <Button
                      variant="ghost"
                      onClick={() => setShowAudiences(false)}
                    >
                      Close
                    </Button>
                  </div>
                  <FormField
                    control={form.control}
                    name="audiences"
                    render={() => (
                      <FormItem>
                        {/* <div className="mb-4">
                    <FormLabel className="text-base">Audiences</FormLabel>
                  </div> */}
                        <div className="rounded-md border max-h-[300px] overflow-y-auto">
                          {beneficiaryData && (
                            <Table>
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
                                      data-state={
                                        row.getIsSelected() && 'selected'
                                      }
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
                            </Table>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
