import { useMemo } from 'react';
import { Transport } from '@rumsan/connect/src/types';
import {
  activityFormSchema,
  createCommunicationFormSchema,
} from '../schemas/activity.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const useActivityForm = (appTransports?: Transport[]) => {
  const CommunicationFormSchema = useMemo(
    () => createCommunicationFormSchema(appTransports),
    [appTransports],
  );

  const defaultCommunicationValues = {
    communicationTitle: '',
    groupType: '',
    groupId: [],
    transportId: '',
    message: '',
    subject: '',
    audioURL: {
      mediaURL: '',
      fileName: '',
    },
    sessionId: '',
    communicationId: '',
  };

  const communicationForm = useForm<z.infer<typeof CommunicationFormSchema>>({
    resolver: zodResolver(CommunicationFormSchema),
    mode: 'onChange',
    defaultValues: defaultCommunicationValues,
  });

  const form = useForm<z.infer<typeof activityFormSchema>>({
    resolver: zodResolver(activityFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      responsibility: '',
      responsibleStation: '',
      phaseId: '',
      categoryId: '',
      leadTime: '',
      description: '',
      activityDocuments: [],
      isTemplate: false,
      isAutomated: false,
    },
  });

  return {
    FormSchema: activityFormSchema,
    CommunicationFormSchema,
    form,
    communicationForm,
    defaultCommunicationValues,
  };
};
