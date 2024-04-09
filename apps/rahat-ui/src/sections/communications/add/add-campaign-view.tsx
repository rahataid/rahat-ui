'use client';

import React from 'react';
import AddForm from './add-form';

import { z } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAudienceColumns } from './use-audience-columns';
import AddAudience from './add-audiences';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import { Audience, CAMPAIGN_TYPES } from '@rahat-ui/types';
import { toast } from 'react-toastify';
import {
  useListTransport,
  useListAudience,
  useGetAudio,
  useCreateCampaign,
  useCreateAudience,
} from '@rumsan/communication-query';

import { useRouter } from 'next/navigation';
import { paths } from 'apps/rahat-ui/src/routes/paths';
import { useBeneficiaryPii, usePagination } from '@rahat-ui/query';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { useAudienceTable } from './use-audience-table';
import { debounce } from 'lodash';

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
  const {
    pagination,
    filters,
    setFilters,
    setNextPage,
    setPrevPage,
    setPerPage,
  } = usePagination();
  const { data: transportData } = useListTransport();
  const { data: audienceData } = useListAudience();

  const { data: audioData } = useGetAudio();
  const createCampaign = useCreateCampaign();
  const createAudience = useCreateAudience();
  const { data: beneficiaryData } = useBeneficiaryPii({
    ...pagination,
    ...filters,
  });
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedRows, setSelectedRows] = React.useState<SelectedRowType[]>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [columnVisibility, setColumnVisibility] = React.useState({});

  const showAddAudienceView = useBoolean(false);
  const router = useRouter();

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

  const table = useAudienceTable({
    columnVisibility,
    columns,
    globalFilter,
    rowSelection,
    setColumnVisibility,
    setGlobalFilter,
    setRowSelection,
    tableData,
  });

  const debouncedHandleSubmit = debounce((data) => {
    let transportId;
    transportData?.data.map((tdata) => {
      if (tdata.name.toLowerCase() === data.campaignType.toLowerCase()) {
        transportId = tdata.id;
      }
    });

    const audiences = audienceData?.data
      .filter((audienceObject: Audience) =>
        selectedRows?.some(
          (selectedObject) =>
            selectedObject.phone === audienceObject?.details?.phone,
        ),
      )
      .map((filteredObject: Audience) => filteredObject.id);
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
        audienceIds: audiences || [],
        name: data.campaignName,
        startTime: data.startTime,
        transportId: Number(transportId),
        type: data.campaignType,
        details: additionalData,
        status: 'ONGOING',
      })
      .then((data) => {
        if (data) {
          setIsSubmitting(false);

          toast.success('Campaign Created Success.');
          router.push(paths.dashboard.communication.text);
        }
      })
      .catch((e) => {
        setIsSubmitting(false);

        toast.error(e);
      });
  }, 1000);

  const handleCreateCampaign = async (
    data: z.infer<typeof FormSchema>,
    event: any,
  ) => {
    setIsSubmitting(true);
    event.preventDefault();
    debouncedHandleSubmit(data);
  };
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateCampaign)}
        className="h-add"
      >
        <AddForm
          title="Add Campaign"
          audios={audioData?.data || []}
          setShowAddAudience={showAddAudienceView.onToggle}
          showAddAudience={showAddAudienceView.value}
          form={form}
          isSubmitting={isSubmitting}
        />
        {showAddAudienceView.value ? (
          <>
            <AddAudience
              table={table}
              columns={columns}
              form={form}
              filters={filters}
              setFilters={setFilters}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              selectedRows={selectedRows}
            />
            <CustomPagination
              meta={
                beneficiaryData?.response?.meta || { total: 0, currentPage: 0 }
              }
              handleNextPage={setNextPage}
              handlePrevPage={setPrevPage}
              handlePageSizeChange={setPerPage}
              currentPage={pagination.page}
              perPage={pagination.perPage}
              total={beneficiaryData?.response?.meta?.lastPage || 0}
            />
          </>
        ) : null}
      </form>
    </FormProvider>
  );
};

export default AddCampaignView;
