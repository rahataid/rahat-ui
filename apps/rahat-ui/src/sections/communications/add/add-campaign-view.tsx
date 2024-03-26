'use client';

import React from 'react';
import AddForm from './add-form';
import {
  ServiceContext,
  ServiceContextType,
} from 'apps/rahat-ui/src/providers/service.provider';
import { z } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
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
import { CAMPAIGN_TYPES } from '@rahat-ui/types';
import { toast } from 'react-toastify';

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

export type SelectedRowType = {
  name: string;
  phone: string;
  id?: number;
  beneficiaryId?: number;
};

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
  const [selectedRows, setSelectedRows] = React.useState<SelectedRowType[]>([]);

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
  const columns = useAudienceColumns(
    beneficiaryData,
    selectedRows,
    audienceData,
    createAudience,
    setSelectedRows,
  );

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
    data: tableData || [],
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

  const handleCreateCampaign = async (data: z.infer<typeof FormSchema>) => {
    let transportId;
    transportData?.data.map((tdata) => {
      if (tdata.name.toLowerCase() === data.campaignType.toLowerCase()) {
        transportId = tdata.id;
      }
    });

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
    if (data?.campaignType === CAMPAIGN_TYPES.PHONE && data?.file) {
      additionalData.audio = data.file;
    } else if (
      data?.campaignType === CAMPAIGN_TYPES.WHATSAPP &&
      data?.message
    ) {
      additionalData.body = data?.message;
    } else {
      additionalData.message = data?.message;
    }
    createCampaign
      .mutateAsync({
        audienceIds: audiences,
        name: data.campaignName,
        startTime: data.startTime,
        transportId: Number(transportId),
        type: data.campaignType,
        details: additionalData,
        status: 'ONGOING',
      })
      .then((data) => {
        if (data) {
          toast.success('Campaign Created Success.');
        }
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateCampaign)}
        className="h-add"
      >
        <AddForm
          title="Add Campaign"
          transports={transportData?.data || []}
          audios={audioData?.data || []}
          setShowAddAudience={showAddAudienceView.onToggle}
          showAddAudience={showAddAudienceView.value}
          form={form}
        />
        {showAddAudienceView.value ? (
          <AddAudience table={table} columns={columns} form={form} />
        ) : null}
      </form>
    </FormProvider>
  );
};

export default AddCampaignView;
