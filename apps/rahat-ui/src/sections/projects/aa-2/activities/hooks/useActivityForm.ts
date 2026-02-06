import { useMemo } from 'react';
import { Transport } from '@rumsan/connect/src/types';
import {
  createActivityFormSchema,
  createCommunicationFormSchema,
} from '../schemas/activity.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const useActivityForm = (
  phases: Array<{ uuid: string; name: string }>,
  appTransports?: Transport[],
) => {
  const FormSchema = useMemo(() => createActivityFormSchema(phases), [phases]);

  const CommunicationFormSchema = useMemo(
    () => createCommunicationFormSchema(appTransports),
    [appTransports],
  );

  const communicationForm = useForm<z.infer<typeof CommunicationFormSchema>>({
    resolver: zodResolver(CommunicationFormSchema),
    mode: 'onChange',
    defaultValues: {
      communicationTitle: '',
      groupType: '',
      groupId: '',
      transportId: '',
      message: '',
      subject: '',
      audioURL: {
        mediaURL: '',
        fileName: '',
      },
      sessionId: '',
      communicationId: '',
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      responsibility: '',
      source: '',
      phaseId: '',
      categoryId: '',
      leadTime: '',
      description: '',
      activityDocuments: [],
      isAutomated: false,
    },
  });

  return {
    FormSchema,
    CommunicationFormSchema,
    form,
    communicationForm,
  };
};
