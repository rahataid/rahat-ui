'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { useParams, useRouter } from 'next/navigation';
import { Heading, Back } from 'apps/rahat-ui/src/common';
import { Save, Loader2, CalendarClock, Calendar as CalendarIcon, Lock } from 'lucide-react';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { Calendar } from '@rahat-ui/shadcn/src/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@rahat-ui/shadcn/src/components/ui/popover';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { cn } from '@rahat-ui/shadcn/src';
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
import { TriggeredNoticeBanner } from '../components/triggered-notice-banner';
import { CommunicationConfirmDialog } from '../components/communication-confirm-dialog';
import { ScheduleTimePicker } from '../components/schedule-time-picker';
import { useBroadcastForm } from '../hooks/useBroadcastForm';
import { useEditCommunication } from '../hooks/useEditCommunication';
import { getSmsInfo } from 'apps/rahat-ui/src/utils/buildCommunicationPayload';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
import { UUID } from 'crypto';

export default function EditCommunicationView() {
  const t = useTranslations('AA_PROJECT');
  const formatDigits = useLabelDigits();
  const formatDate = useDateFormat();
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
    isStillScheduled,
    beneficiaryGroups,
    stakeholderGroups,
    isLoadingGroups,
    detailsPath,
    confirmDialog,
    onSubmit,
    handleConfirmUpdate,
    uploadFile,
    scheduledAt,
  } = useEditCommunication({ projectId, commId, form });

  const channel = watch('channel');
  const message = watch('message') || '';
  const isScheduled = watch('isScheduled');

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
                {isStillScheduled && (
                  <div className="flex items-center gap-2.5 p-3 bg-blue-50/80 border border-blue-200 rounded-md text-blue-900 text-xs sm:text-sm">
                    <CalendarClock className="w-4 h-4 shrink-0 text-blue-600" />
                    <span>
                      {t('COMMUNICATION_SCHEDULED_NOTICE') ||
                        'This communication is scheduled for future delivery. You can update its details, recipient groups, message content, or schedule date and time.'}
                    </span>
                  </div>
                )}

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

                  <FormField
                    control={control}
                    name="channel"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel
                          required
                          className={cn(
                            'flex items-center gap-2',
                            isTriggered && 'text-muted-foreground',
                          )}
                        >
                          {t('COMMUNICATION_CHANNEL')}
                          {isTriggered && (
                            <span className="text-[11px] font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded flex items-center gap-1 border border-border/50">
                              <Lock className="w-3 h-3" />
                              {t('LOCKED') || 'Locked'}
                            </span>
                          )}
                        </FormLabel>
                        <Select
                          disabled={isTriggered}
                          onValueChange={field.onChange}
                          value={field.value || 'sms'}
                        >
                          <FormControl>
                            <FormSelectTrigger
                              className={cn(
                                isTriggered && 'opacity-70 cursor-not-allowed bg-muted/40',
                              )}
                            >
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

                <TargetAudienceSelector
                  beneficiaryGroups={beneficiaryGroups}
                  stakeholderGroups={stakeholderGroups}
                  isLoading={isLoadingGroups}
                  disabled={isTriggered}
                />

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
                          <div className="flex flex-wrap justify-between items-start gap-2 mt-1 min-w-0">
                            <div className="min-w-0 flex-1">
                              <FormMessage />
                            </div>
                            <div className="ml-auto flex flex-wrap items-center text-xs text-muted-foreground gap-3 pt-1 shrink-0">
                              {credits > 0 && (
                                <p className="text-xs text-muted-foreground whitespace-nowrap">
                                  <span className="font-medium text-foreground">
                                    {formatDigits(credits)}
                                  </span>{' '}
                                  {credits === 1 ? t('SMS_CREDIT') : t('SMS_CREDITS')}
                                </p>
                              )}
                              <p className={`whitespace-nowrap ${charsCount > maxChars ? 'text-destructive font-medium' : ''}`}>
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

                <div className="border rounded-md p-4 bg-slate-50 space-y-4">
                  <FormField
                    control={control}
                    name="isScheduled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            id="schedule-later"
                            disabled={isTriggered}
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              if (isTriggered) return;
                              field.onChange(checked);
                              if (!checked) {
                                form.setValue('scheduleDate', undefined);
                                form.setValue('scheduleTime', '');
                                form.clearErrors(['scheduleDate', 'scheduleTime']);
                              }
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel
                            htmlFor="schedule-later"
                            className={cn(
                              'text-sm font-semibold flex items-center gap-2',
                              isTriggered
                                ? 'cursor-not-allowed text-muted-foreground'
                                : 'cursor-pointer',
                            )}
                          >
                            <CalendarClock className="w-4 h-4 text-primary" />
                            {t('SCHEDULE_LATER')}
                            {isTriggered && (
                              <span className="text-[11px] font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded flex items-center gap-1 border border-border/50">
                                <Lock className="w-3 h-3" />
                                {t('LOCKED') || 'Locked'}
                              </span>
                            )}
                          </FormLabel>
                          <p className="text-xs text-muted-foreground">
                            {t('SCHEDULE_LATER_DESCRIPTION')}
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  {isScheduled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t">
                      <FormField
                        control={control}
                        name="scheduleDate"
                        render={({ field }) => (
                          <FormItem className="space-y-2 flex flex-col">
                            <FormLabel required>{t('SCHEDULE_DATE')}</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    disabled={isTriggered}
                                    className={cn(
                                      'w-full pl-3 text-left font-normal bg-white justify-between',
                                      !field.value && 'text-muted-foreground',
                                      isTriggered &&
                                        'opacity-70 cursor-not-allowed bg-muted/40',
                                    )}
                                  >
                                    {field.value ? (
                                      formatDate(field.value, 'PPP')
                                    ) : (
                                      <span>{t('PICK_SCHEDULE_DATE')}</span>
                                    )}
                                    <CalendarIcon className="h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={(date) => {
                                    field.onChange(date);
                                    form.trigger(['scheduleDate', 'scheduleTime']);
                                  }}
                                  disabled={(date) => {
                                    if (isTriggered) return true;
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    return date < today;
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="scheduleTime"
                        render={({ field }) => (
                          <FormItem className="space-y-2 flex flex-col">
                            <FormLabel required>{t('SCHEDULE_TIME')}</FormLabel>
                            <FormControl>
                              <ScheduleTimePicker
                                disabled={isTriggered}
                                value={field.value}
                                onChange={(val) => {
                                  field.onChange(val);
                                  form.trigger(['scheduleDate', 'scheduleTime']);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap justify-end gap-3 border-t p-4 sm:p-6">
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
                  ) : isScheduled ? (
                    <CalendarClock className="w-4 h-4 mr-2" />
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
