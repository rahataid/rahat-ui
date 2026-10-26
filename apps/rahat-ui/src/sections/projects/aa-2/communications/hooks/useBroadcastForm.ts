import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { buildBroadcastSchema } from '../schemas/communication.schemas';
import { BroadcastFormValues, BroadcastChannel } from '../types';

const defaultBroadcastValues: BroadcastFormValues = {
  title: '',
  channel: 'sms',
  subject: '',
  message: '',
  beneficiaries: [],
  stakeholders: [],
  audioFile: undefined,
};

export const useBroadcastForm = (
  initialValuesOrChannel?: BroadcastChannel | Partial<BroadcastFormValues>,
) => {
  const t = useTranslations('AA_PROJECT');

  const broadcastSchema = useMemo(() => buildBroadcastSchema(t), [t]);

  const defaultValues = useMemo<BroadcastFormValues>(() => {
    if (!initialValuesOrChannel) return defaultBroadcastValues;
    if (typeof initialValuesOrChannel === 'string') {
      return {
        ...defaultBroadcastValues,
        channel: initialValuesOrChannel,
      };
    }
    return {
      ...defaultBroadcastValues,
      ...initialValuesOrChannel,
    };
  }, [initialValuesOrChannel]);

  const form = useForm<BroadcastFormValues>({
    resolver: zodResolver(broadcastSchema),
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  return {
    broadcastSchema,
    form,
    defaultBroadcastValues,
  };
};

export const useCommunicationForm = useBroadcastForm;
export const defaultCommunicationValues = defaultBroadcastValues;
