'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import { useParams, useRouter } from 'next/navigation';
import { Heading, Back } from 'apps/rahat-ui/src/common';
import { Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@rahat-ui/shadcn/src/components/ui/card';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { FormInput, FormTextarea, FormSelectTrigger } from 'apps/rahat-ui/src/common/form-fields';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { TargetAudienceSelector } from '../components/target-audience-selector';
import { VoiceMessageSource } from '../components/voice-message-source';

// React Hook Form & Zod
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';

// 1. Zod Validation Schema Factory
const getBroadcastSchema = (t: (key: string) => string) =>
  z.object({
    title: z.string().min(1, t('BROADCAST_TITLE_REQUIRED')),
    channel: z.enum(['sms', 'voice', 'email']),
    subject: z.string().optional(),
    message: z.string().optional(),
    beneficiaries: z.array(z.any()).default([]),
    stakeholders: z.array(z.any()).default([]),
    audioFile: z.any().optional(),
  }).superRefine((data, ctx) => {
    if (data.channel === 'email' && !data.subject?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: t('EMAIL_SUBJECT_REQUIRED'), path: ['subject'] });
    }
    if (data.channel === 'voice' && !data.audioFile) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: t('AUDIO_FILE_REQUIRED'), path: ['audioFile'] });
    }
    if (data.channel !== 'voice' && !data.message?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: t('MESSAGE_REQUIRED'), path: ['message'] });
    }
    if (data.channel !== 'voice' && data.message) {
      const isUni = /[\u0900-\u097F]/.test(data.message);
      const max = isUni ? 350 : 700;
      if (data.message.length > max) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: t('MAX_CHARS_EXCEEDED'), path: ['message'] });
      }
    }
    if (data.beneficiaries.length === 0 && data.stakeholders.length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: t('TARGET_AUDIENCE_REQUIRED'), path: ['targetAudience'] });
    }
  });

export type BroadcastFormValues = {
  title: string;
  channel: 'sms' | 'voice' | 'email';
  subject?: string;
  message?: string;
  beneficiaries: any[];
  stakeholders: any[];
  audioFile?: any;
};

// ----------------------------------------------------------------------
// Main View
// ----------------------------------------------------------------------
export default function AddCommunicationView() {
  const t = useTranslations('AA_PROJECT');
  const formatDigits = useLabelDigits();
  const router = useRouter();
  const { id: projectId } = useParams();

  const broadcastSchema = React.useMemo(() => getBroadcastSchema(t), [t]);

  // Initialize the form with React Hook Form + Zod
  const form = useForm<BroadcastFormValues>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: {
      title: '',
      channel: 'sms',
      subject: '',
      message: '',
      beneficiaries: [],
      stakeholders: [],
    }
  });

  const { watch, handleSubmit, control } = form;
  const channel = watch('channel');
  const message = watch('message') || '';

  // Credit Calculation Logic
  const isUnicode = /[\u0900-\u097F]/.test(message);
  const maxChars = isUnicode ? 350 : 700;
  const charsCount = message.length;

  let credits = 0;
  if (charsCount > 0) {
    if (isUnicode) {
      credits = charsCount <= 70 ? 1 : Math.ceil(charsCount / 67);
    } else {
      credits = charsCount <= 160 ? 1 : Math.ceil(charsCount / 153);
    }
  }

  const onSubmit = (data: BroadcastFormValues) => {
    console.log("Valid Broadcast Form Data:", data);
    // TODO: Connect to backend mutation
    router.push(`/projects/aa/${projectId}/communications`);
  };

  return (
    <div className="flex flex-col p-4 space-y-5">
      <div className="mb-2 flex flex-col space-y-0">
        <Back path={`/projects/aa/${projectId}/communications`} />
        <div className="mt-4 flex justify-between items-center">
          <Heading title={t("NEW_COMMUNICATION")} description={t("NEW_COMMUNICATION_DESCRIPTION")} />
        </div>
      </div>

      <div className="w-full">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="shadow-sm">
              <CardHeader><CardTitle className="text-xl">{t("BROADCAST_DETAILS")}</CardTitle></CardHeader>
              <CardContent className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel required>{t("BROADCAST_NAME_TITLE")}</FormLabel>
                        <FormControl><FormInput placeholder={t("BROADCAST_NAME_PLACEHOLDER")} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="channel"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel required>{t("COMMUNICATION_CHANNEL")}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <FormSelectTrigger><SelectValue placeholder={t("SELECT_CHANNEL")} /></FormSelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sms">{t("SMS")}</SelectItem>
                            <SelectItem value="voice">{t("VOICE")}</SelectItem>
                            <SelectItem value="email">{t("EMAIL")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {channel === 'email' && (
                  <FormField
                    control={control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel required>{t("EMAIL_SUBJECT")}</FormLabel>
                        <FormControl><FormInput placeholder={t("EMAIL_SUBJECT_PLACEHOLDER")} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Extracted Audience Selector Sub-component */}
                <TargetAudienceSelector />

                {channel === 'voice' && <VoiceMessageSource />}

                {channel !== 'voice' && (
                  <FormField
                    control={control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel required>{t("MESSAGE_CONTENT")}</FormLabel>
                        <FormControl>
                          <FormTextarea
                            placeholder={channel === 'email' ? t("EMAIL_BODY_PLACEHOLDER") : t("SMS_MESSAGE_PLACEHOLDER")}
                            className="h-32 resize-none"
                            {...field}
                          />
                        </FormControl>

                        {channel === 'sms' && (
                          <div className="flex justify-between items-start mt-1">
                            <FormMessage />
                            <div className="ml-auto flex text-xs text-muted-foreground gap-4 pt-1">
                              {credits > 0 && (
                                <p className="text-xs text-muted-foreground">
                                  <span className="font-medium text-foreground">{formatDigits(credits)}</span>{' '}
                                  {credits === 1 ? t("SMS_CREDIT") : t("SMS_CREDITS")}
                                </p>
                              )}
                              <p className={charsCount > maxChars ? 'text-destructive font-medium' : ''}>
                                {formatDigits(charsCount)} / {formatDigits(maxChars)} {t("CHARACTERS")}
                              </p>
                            </div>
                          </div>
                        )}
                        {channel !== 'sms' && <FormMessage />}
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-3 border-t p-6">
                <Button type="button" variant="outline" onClick={() => router.push(`/projects/aa/${projectId}/communications`)}>
                  {t("CANCEL")}
                </Button>
                <Button type="submit">
                  <Send className="w-4 h-4 mr-2" />
                  {t("SEND_BROADCAST")}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
