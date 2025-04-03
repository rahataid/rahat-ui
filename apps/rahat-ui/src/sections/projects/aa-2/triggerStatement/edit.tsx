import React from 'react';
import { Back, Heading } from 'apps/rahat-ui/src/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AutomatedTriggerAddForm, ManualTriggerAddForm } from './components';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useSingleTriggerStatement } from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { capitalizeFirstLetter } from 'apps/rahat-ui/src/utils';

export default function EditTrigger() {
  const params = useParams();
  const projectId = params.id as UUID;
  const triggerRepeatKey = window.location.href.split('/').slice(-2, -1)[0];

  const trigger = useSingleTriggerStatement(projectId, triggerRepeatKey);

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
    dataSource: z.string().min(1, { message: 'Please select data source' }),
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
      dataSource: '',
      maxLeadTimeDays: '',
      minLeadTimeDays: '',
      probability: '',
      isMandatory: true,
      notes: '',
    },
  });

  React.useEffect(() => {
    if (trigger?.triggerStatement?.type === 'manual') {
      manualForm.reset({
        title: trigger?.title,
        notes: trigger?.notes,
        isMandatory: trigger?.isMandatory,
      });
    } else if (trigger?.triggerStatement?.type === 'automated') {
      automatedForm.reset({
        title: trigger?.title,
        dataSource: trigger?.phase?.source?.source,
        isMandatory: trigger?.isMandatory,
        maxLeadTimeDays: trigger?.triggerStatement?.maxLeadTimeDays,
        minLeadTimeDays: trigger?.triggerStatement?.maxLeadTimeDays,
        notes: trigger?.notes,
        probability: trigger?.triggerStatement?.probability,
      });
    }
  }, [trigger]);

  return (
    <div className="p-4">
      <Back />
      <Heading
        title={`Edit ${capitalizeFirstLetter(
          trigger?.triggerStatement?.type || '',
        )} Trigger`}
        description=""
      />
      <div className="px-4 pb-4 border rounded shadow">
        {trigger?.triggerStatement?.type === 'automated' ? (
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
          <Button type="button" variant="outline" className="w-40 mr-2">
            Cancel
          </Button>
          <Button type="submit" className="w-40 mr-2" disabled>
            Update
          </Button>
        </div>
      </div>
    </div>
  );
}
