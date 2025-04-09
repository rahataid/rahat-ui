import React from 'react';
import { Back, Heading } from 'apps/rahat-ui/src/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AutomatedTriggerAddForm, ManualTriggerAddForm } from './components';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  useSingleTriggerStatement,
  useUpdateTriggerStatement,
} from '@rahat-ui/query';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { capitalizeFirstLetter } from 'apps/rahat-ui/src/utils';

export default function EditTrigger() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;
  const triggerRepeatKey = window.location.href.split('/').slice(-2, -1)[0];

  const triggerDetailPage = `/projects/aa/${projectId}/trigger-statements/${triggerRepeatKey}`;

  const trigger = useSingleTriggerStatement(projectId, triggerRepeatKey);

  const triggerType = trigger?.source === 'MANUAL' ? 'manual' : 'automated';

  const updateTrigger = useUpdateTriggerStatement();

  const ManualFormSchema = z.object({
    title: z.string().min(2, { message: 'Please enter valid title' }),
    isMandatory: z.boolean().optional(),
    notes: z.string().optional(),
  });

  const manualForm = useForm<z.infer<typeof ManualFormSchema>>({
    resolver: zodResolver(ManualFormSchema),
    defaultValues: {
      title: '',
      isMandatory: true,
      notes: '',
    },
  });

  const AutomatedFormSchema = z.object({
    title: z.string().min(2, { message: 'Please enter valid name' }),
    source: z.string().min(1, { message: 'Please select data source' }),
    isMandatory: z.boolean().optional(),
    minLeadTimeDays: z
      .string()
      .min(1, { message: 'Please enter minimum lead time days' }),
    maxLeadTimeDays: z
      .string()
      .min(1, { message: 'Please enter maximum lead time days' }),
    probability: z
      .string()
      .min(1, { message: 'Please enter forecast probability' }),
    notes: z.string().optional(),
  });

  const automatedForm = useForm<z.infer<typeof AutomatedFormSchema>>({
    resolver: zodResolver(AutomatedFormSchema),
    defaultValues: {
      title: '',
      source: '',
      maxLeadTimeDays: '',
      minLeadTimeDays: '',
      probability: '',
      isMandatory: true,
      notes: '',
    },
  });

  const handleSubmitManualTrigger = async (
    data: z.infer<typeof ManualFormSchema>,
  ) => {
    handleUpdate(data);
  };

  const handleSubmitAutomatedTrigger = async (
    data: z.infer<typeof AutomatedFormSchema>,
  ) => {
    handleUpdate(data);
  };

  const handleUpdate = async (data: any) => {
    const {
      minLeadTimeDays,
      maxLeadTimeDays,
      probability,
      riverBasin,
      ...rest
    } = data;

    await updateTrigger.mutateAsync({
      projectUUID: projectId,
      triggerUpdatePayload: {
        ...rest,
        phaseId: trigger?.phaseId,
        uuid: trigger?.uuid,
        source: trigger?.source === 'MANUAL' ? 'MANUAL' : 'DHM',
        triggerStatement: {
          minLeadTimeDays,
          maxLeadTimeDays,
          probability,
        },
      },
    });
    router.push(triggerDetailPage);
  };

  const handleEditTriggers = () => {
    const formHandlers: { [key in 'manual' | 'automated']: () => void } = {
      manual: () => {
        manualForm.handleSubmit(handleSubmitManualTrigger)();
      },
      automated: () => {
        automatedForm.handleSubmit(handleSubmitAutomatedTrigger)();
      },
    };

    formHandlers[triggerType as 'manual' | 'automated']?.();
  };

  React.useEffect(() => {
    if (triggerType === 'manual') {
      manualForm.reset({
        title: trigger?.title,
        notes: trigger?.notes,
        isMandatory: trigger?.isMandatory,
      });
    } else if (triggerType === 'automated') {
      automatedForm.reset({
        title: trigger?.title,
        source: trigger?.source,
        isMandatory: trigger?.isMandatory,
        maxLeadTimeDays: trigger?.triggerStatement?.maxLeadTimeDays,
        minLeadTimeDays: trigger?.triggerStatement?.maxLeadTimeDays,
        notes: trigger?.notes || '',
        probability: trigger?.triggerStatement?.probability,
      });
    }
  }, [trigger]);

  return (
    <div className="p-4">
      <Back />
      <Heading
        title={`Edit ${capitalizeFirstLetter(triggerType || '')} Trigger`}
        description=""
      />
      <div className="px-4 pb-4 border rounded shadow">
        {triggerType === 'automated' ? (
          <AutomatedTriggerAddForm
            form={automatedForm}
            phase={{
              name: trigger?.phase?.name,
              riverBasin: trigger?.phase?.source?.riverBasin,
            }}
          />
        ) : (
          <ManualTriggerAddForm
            form={manualForm}
            phase={{
              name: trigger?.phase?.name,
              riverBasin: trigger?.phase?.source?.riverBasin,
            }}
          />
        )}
        <div className="flex justify-end mt-4">
          <Button
            type="button"
            variant="outline"
            className="w-40 mr-2"
            onClick={() => router.push(triggerDetailPage)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-40 mr-2"
            onClick={handleEditTriggers}
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
}
