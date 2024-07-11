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
  useListC2cTransport,
  useListC2cAudience,
  useCreateC2cCampaign,
} from '@rahat-ui/query';

import { useParams, useRouter } from 'next/navigation';
import { paths } from 'apps/rahat-ui/src/routes/paths';
import { debounce } from 'lodash';
import { UUID } from 'crypto';
import { useGetAudio } from '@rumsan/communication-query';

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
  const { id } = useParams() as { id: UUID };

  const { data: transportData } = useListC2cTransport(id);
  const { data: audienceData } = useListC2cAudience(id);

  const { data: audioData } = useGetAudio();
  const createCampaign = useCreateC2cCampaign(id);
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

  const debouncedHandleSubmit = debounce(async (data) => {
    const transportId = transportData?.find(
      (t) => t?.name?.toLowerCase() === data?.campaignType?.toLowerCase(),
    )?.id;
    const uniquePhoneNumbers = new Set();
    const uniqueAudienceData: any = audienceData?.filter((data) => {
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
    await createCampaign.mutateAsync({
      audienceIds: audiences || [],
      name: data.campaignName,
      startTime: null,
      transportId: Number(transportId),
      type: data.campaignType,
      details: additionalData,
      status: 'ONGOING',
      projectId: id,
    });

    setIsSubmitting(false);
    router.push(`text`);
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
