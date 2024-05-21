'use client';

import React from 'react';
import AddForm from './add-form';

import { z } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import AddAudience from './add-audiences';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import { Audience, CAMPAIGN_TYPES } from '@rahat-ui/types';
import { toast } from 'react-toastify';
import {
  useListTransport,
  useListAudience,
  useGetAudio,
  useCreateCampaign,
  useGetApprovedTemplate,
} from '@rumsan/communication-query';

import { useParams, useRouter } from 'next/navigation';
import { paths } from 'apps/rahat-ui/src/routes/paths';
import { debounce } from 'lodash';

const FormSchema = z.object({
  campaignName: z.string().min(2, {
    message: 'Campaign Name must be at least 2 characters.',
  }),
  // startTime: z.date({
  //   required_error: 'Start time is required.',
  // }),
  campaignType: z.string({
    required_error: 'Camapign Type is required.',
  }),

  message: z.string().optional(),
  messageSid: z.string().optional(),
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
  const { data: transportData } = useListTransport();
  const { data: audienceData } = useListAudience();
  const { id } = useParams();

  const { data: audioData } = useGetAudio();
  const createCampaign = useCreateCampaign();
  const [selectedRows, setSelectedRows] = React.useState<SelectedRowType[]>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

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

  const debouncedHandleSubmit = debounce((data) => {
    let transportId;
    transportData?.data.map((tdata) => {
      if (tdata.name.toLowerCase() === data?.campaignType.toLowerCase()) {
        transportId = tdata.id;
      }
    });
    const uniquePhoneNumbers = new Set();
    const uniqueAudienceData: any = audienceData?.data.filter((data) => {
      if (!uniquePhoneNumbers.has(data.details?.phone)) {
        uniquePhoneNumbers.add(data.details?.phone);
        return true;
      }
    });
    const audiences = uniqueAudienceData
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
      messageSid?: string;
    };
    const additionalData: AdditionalData = {};
    if (data?.campaignType === CAMPAIGN_TYPES.PHONE && data?.file) {
      additionalData.audio = data.file;
    } else if (
      data?.campaignType === CAMPAIGN_TYPES.WHATSAPP &&
      data?.message
    ) {
      additionalData.body = data?.message;
    } else if (
      data?.campaignType === CAMPAIGN_TYPES.WHATSAPP &&
      data?.messageSid
    ) {
      additionalData.messageSid = data?.messageSid;
      additionalData.body = data?.message;
    } else {
      additionalData.message = data?.message;
    }
    createCampaign
      .mutateAsync({
        audienceIds: audiences || [],
        name: data.campaignName,
        startTime: null,
        transportId: Number(transportId),
        type: data.campaignType,
        details: additionalData,
        status: 'ONGOING',
        projectId: id,
      })
      .then((data) => {
        if (data) {
          setIsSubmitting(false);

          toast.success('Campaign Created Success.');
          router.push(`text`);
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
    debouncedHandleSubmit(data);
  };

  return (
    <FormProvider {...form}>
      <form className="h-add">
        <AddForm
          title="Add Campaign"
          audios={audioData?.data || []}
          setShowAddAudience={showAddAudienceView.onToggle}
          showAddAudience={showAddAudienceView.value}
          form={form}
          isSubmitting={isSubmitting}
          handleSubmit={form.handleSubmit(handleCreateCampaign)}
        />

        {showAddAudienceView.value ? (
          <div className="p-2">
            <AddAudience
              form={form}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              audienceData={audienceData}
            />
          </div>
        ) : null}
      </form>
    </FormProvider>
  );
};

export default AddCampaignView;
