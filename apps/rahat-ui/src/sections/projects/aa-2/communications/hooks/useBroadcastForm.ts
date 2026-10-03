import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { buildBroadcastSchema } from '../schemas/communication.schemas';
import { BroadcastFormValues } from '../types';

const defaultBroadcastValues: BroadcastFormValues = {
  title: '',
  channel: 'sms',
  subject: '',
  message: '',
  beneficiaries: [],
  stakeholders: [],
  audioFile: undefined,
};

export const useBroadcastForm = () => {
  const t = useTranslations('AA_PROJECT');

  const broadcastSchema = useMemo(() => buildBroadcastSchema(t), [t]);

  const form = useForm<BroadcastFormValues>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: defaultBroadcastValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  return {
    broadcastSchema,
    form,
    defaultBroadcastValues,
  };
};
