'use client';

import React from 'react';
import AddForm from './add-form';
import {
  ServiceContext,
  ServiceContextType,
} from 'apps/rahat-ui/src/providers/service.provider';
import { z } from 'zod';
import { Form, FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useAudienceColumns } from './use-audience-columns';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import AddAudience from './add-audiences';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';

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
  message: z.string().optional(),
  audiences: z.array(
    z.object({
      name: z.string(),
      phone: z.string(),
      beneficiaryId: z.number(),
    }),
  ),
  file: z.string().optional(),
});

const AddCampaignView = () => {
  // TODO: Implement the new structure
  const { communicationQuery, beneficiaryQuery } = React.useContext(
    ServiceContext,
  ) as ServiceContextType;
  const { data: transportData } = communicationQuery.useListTransport();
  const { data: audienceData } = communicationQuery.useListAudience();
  const { data: audioData } = communicationQuery.useGetAudio();
  const createCampaign = communicationQuery.useCreateCampaign();
  const createAudience = communicationQuery.useCreateAudience();
  const { data: beneficiaryData } = beneficiaryQuery.useBeneficiaryPii();

  const [rowSelection, setRowSelection] = React.useState({});

  const showAddAudienceView = useBoolean(false);

  const handleisAlreadyAudience = (id: number) => {
    return Object.keys(rowSelection).includes(id.toString());
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      campaignName: '',
      audiences: [],
    },
    mode: 'onChange',
  });
  const columns = useAudienceColumns();

  const table = useReactTable({
    data:
      beneficiaryData?.data.map((b) => ({
        name: b?.name,
        id: b?.beneficiaryId,
        phone: b?.phone,
      })) || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.id,
    state: {
      rowSelection,
    },
  });

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            console.log('data', data);
          })}
          className="h-add"
        >
          <AddForm
            title="Add Campaign"
            transports={transportData?.data || []}
            audios={audioData?.data || []}
            setShowAddAudience={() => showAddAudienceView.onToggle()}
            showAddAudience={showAddAudienceView.value}
            form={form}
          />
          {showAddAudienceView.value ? (
            <AddAudience table={table} columns={columns} form={form} />
          ) : null}
        </form>
      </Form>
    </FormProvider>
  );
};

export default AddCampaignView;
