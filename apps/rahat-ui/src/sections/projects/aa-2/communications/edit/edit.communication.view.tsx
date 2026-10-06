'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import { useParams, useRouter } from 'next/navigation';
import { Heading, Back } from 'apps/rahat-ui/src/common';
import { Save, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { FormInput, FormTextarea, FormSelectTrigger } from 'apps/rahat-ui/src/common/form-fields';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { TargetAudienceSelector } from '../components/target-audience-selector';
import { VoiceMessageSource } from '../components/voice-message-source';
import { LockedTargetAudience } from '../components/locked-target-audience';
import { LockedChannelField } from '../components/locked-channel-field';
import { TriggeredNoticeBanner } from '../components/triggered-notice-banner';
import { CommunicationConfirmDialog } from '../components/communication-confirm-dialog';
import { useBroadcastForm } from '../hooks/useBroadcastForm';
import { useEditCommunication } from '../hooks/useEditCommunication';
import { getSmsInfo } from 'apps/rahat-ui/src/utils/buildCommunicationPayload';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
import { UUID } from 'crypto';

export default function EditCommunicationView() {
  const t = useTranslations('AA_PROJECT');
  const formatDigits = useLabelDigits();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;
  const commId = params.commId as string;

  const { form } = useBroadcastForm();
  const { watch, handleSubmit, control } = form;

  const {
    isLoading,
    isSubmitting,
    isTriggered,
    beneficiaryGroups,
    stakeholderGroups,
    isLoadingGroups,
    initialBeneficiaries,
    initialStakeholders,
    detailsPath,
    confirmDialog,
    onSubmit,
    handleConfirmUpdate,
    uploadFile,
  } = useEditCommunication({ projectId, commId, form });

  const channel = watch('channel');
  const message = watch('message') || '';

  const smsInfo = channel === 'sms' && message ? getSmsInfo(message) : null;
  const isUnicode = /[\u0900-\u097F]/.test(message);
  const maxChars = isUnicode ? 350 : 700;
  const charsCount = smsInfo?.characterCount ?? message.length;
  const credits = smsInfo?.smsCredits ?? 0;

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-65px)] p-4">
        <Back path={detailsPath} />
        <div className="h-full flex flex-col justify-center items-center space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <p className="text-gray-500 text-sm">{t('LOADING') || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 space-y-5">
      <div className="mb-2 flex flex-col space-y-0">
        <Back path={detailsPath} />
        <div className="mt-4 flex justify-between items-center">
          <Heading
            title={t('EDIT_COMMUNICATION') || 'Edit Communication'}
            description={
              t('EDIT_COMMUNICATION_DESCRIPTION') ||
              'Update communication details, message content, and audience parameters.'
            }
          />
        </div>
      </div>

      <div className="w-full">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">
                  {t('COMMUNICATION_DETAILS') || 'Communication Details'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isTriggered && <TriggeredNoticeBanner />}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel required>{t('COMMUNICATION_TITLE')}</FormLabel>
                        <FormControl>
                          <FormInput
                            placeholder={t('BROADCAST_NAME_PLACEHOLDER')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isTriggered ? (
                    <LockedChannelField channel={channel} />
                  ) : (
                    <FormField
                      control={control}
                      name="channel"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel required>{t('COMMUNICATION_CHANNEL')}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || 'sms'}>
                            <FormControl>
                              <FormSelectTrigger>
                                <SelectValue placeholder={t('SELECT_CHANNEL')} />
                              </FormSelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sms">{t('SMS')}</SelectItem>
                              <SelectItem value="voice">{t('VOICE')}</SelectItem>
                              <SelectItem value="email">{t('EMAIL')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {channel === 'email' && (
                  <FormField
                    control={control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel required>{t('EMAIL_SUBJECT')}</FormLabel>
                        <FormControl>
                          <FormInput
                            placeholder={t('EMAIL_SUBJECT_PLACEHOLDER')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {isTriggered ? (
                  <LockedTargetAudience
                    beneficiaries={initialBeneficiaries}
                    stakeholders={initialStakeholders}
                  />
                ) : (
                  <TargetAudienceSelector
                    beneficiaryGroups={beneficiaryGroups}
                    stakeholderGroups={stakeholderGroups}
                    isLoading={isLoadingGroups}
                  />
                )}

                {channel === 'voice' && <VoiceMessageSource uploadFile={uploadFile} />}

                {channel !== 'voice' && (
                  <FormField
                    control={control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel required>{t('MESSAGE_CONTENT')}</FormLabel>
                        <FormControl>
                          <FormTextarea
                            placeholder={
                              channel === 'email'
                                ? t('EMAIL_BODY_PLACEHOLDER')
                                : t('SMS_MESSAGE_PLACEHOLDER')
                            }
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
                                  <span className="font-medium text-foreground">
                                    {formatDigits(credits)}
                                  </span>{' '}
                                  {credits === 1 ? t('SMS_CREDIT') : t('SMS_CREDITS')}
                                </p>
                              )}
                              <p className={charsCount > maxChars ? 'text-destructive font-medium' : ''}>
                                {formatDigits(charsCount)} / {formatDigits(maxChars)} {t('CHARACTERS')}
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(detailsPath)}
                  disabled={isSubmitting}
                >
                  {t('CANCEL') || 'Cancel'}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {t('SAVE_CHANGES') || 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>

      <CommunicationConfirmDialog
        isOpen={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        onConfirm={handleConfirmUpdate}
        dialogTitle={translateValue(t, 'EDIT_COMMUNICATION', { fallback: 'Edit Communication' })}
        isPending={isSubmitting}
        confirmLabel={t('SAVE_CHANGES') || 'Save Changes'}
        description={translateValue(t, 'EDIT_COMMUNICATION_CONFIRM', {
          fallback: 'Are you sure you want to update this communication?',
        })}
        values={watch()}
        credits={credits}
      />
    </div>
  );
}
