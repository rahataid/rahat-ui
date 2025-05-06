'use client';

import React from 'react';
import AddForm from './add-form';

import { z } from 'zod';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import AddAudience from './add-audiences';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import { CAMPAIGN_TYPES } from '@rahat-ui/types';
import { useListC2cTransport, useCreateC2cCampaign } from '@rahat-ui/query';

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
  phone: string;
  email: string;
};

const AddCampaignView = () => {
  const { id } = useParams() as { id: UUID };

  const { data: transportData } = useListC2cTransport(id);

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
    console.log(selectedRows, transportData);

    const addresses = selectedRows?.map((row) =>
      data?.campaignType === CAMPAIGN_TYPES.EMAIL ? row?.email : row?.phone,
    );

    await createCampaign.mutateAsync({
      addresses: addresses || [],
      name: data.campaignName,
      transportId: data.campaignType,
      message: data.message,
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
          transport={transportData}
        />

        {showAddAudienceView.value ? (
          <div className="p-2">
            <AddAudience
              form={form}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
            />
          </div>
        ) : null}
      </form>
    </FormProvider>
  );
};

export default AddCampaignView;
