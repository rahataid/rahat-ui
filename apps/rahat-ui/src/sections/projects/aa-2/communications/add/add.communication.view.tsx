'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import { useParams, useRouter } from 'next/navigation';
import { Heading, Back } from 'apps/rahat-ui/src/common';
import { useListAllTransports, useBeneficiariesGroups, useStakeholdersGroups, useCreateCommunication, useUploadFile } from '@rahat-ui/query';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@rahat-ui/shadcn/src/components/ui/card';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { FormInput, FormTextarea, FormSelectTrigger } from 'apps/rahat-ui/src/common/form-fields';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { TargetAudienceSelector, AudienceGroupOption } from '../components/target-audience-selector';
import { VoiceMessageSource } from '../components/voice-message-source';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { useBroadcastForm } from '../hooks/useBroadcastForm';
import { BroadcastFormValues } from '../types';
import { resolveTransportByChannel } from '../utils/communications.utils';
import { getSmsInfo } from 'apps/rahat-ui/src/utils/buildCommunicationPayload';
import { UUID } from 'crypto';
import { toast } from 'react-toastify';
import { CommunicationConfirmDialog } from '../components/communication-confirm-dialog';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';

const toAudienceOptions = (groups: any[], countOf: (g: any) => number): AudienceGroupOption[] =>
  (Array.isArray(groups) ? groups : []).map((g: any) => ({
    id: g?.uuid,
    name: g?.name,
    count: countOf(g),
  })).filter((g) => g.id && g.name);

export default function AddCommunicationView() {
  const t = useTranslations('AA_PROJECT');
  const formatDigits = useLabelDigits();
  const router = useRouter();
  const { id: projectId } = useParams();
  const uuid = projectId as UUID;
  const appTransports = useListAllTransports();
  const { form } = useBroadcastForm();
  const createCommunication = useCreateCommunication();
  const uploadFile = useUploadFile();
  const confirmDialog = useBoolean();
  const pendingBroadcast = React.useRef<BroadcastFormValues | null>(null);

  const { data: beneficiaryGroupsData, isLoading: isLoadingBeneficiaries } = useBeneficiariesGroups(uuid, {
    page: 1,
    perPage: 100,
  });
  const { data: stakeholderGroupsData, isLoading: isLoadingStakeholders } = useStakeholdersGroups(uuid, {
    page: 1,
    perPage: 100,
  });

  const beneficiaryGroups = React.useMemo(
    () => toAudienceOptions(
      (beneficiaryGroupsData as any)?.data ?? beneficiaryGroupsData ?? [],
      (g) => g?._count?.beneficiaries ?? g?.groupedBeneficiaries?.length ?? 0,
    ),
    [beneficiaryGroupsData],
  );
  const stakeholderGroups = React.useMemo(
    () => toAudienceOptions(
      (stakeholderGroupsData as any)?.data ?? stakeholderGroupsData ?? [],
      (g) => g?._count?.stakeholders ?? g?.stakeholders?.length ?? 0,
    ),
    [stakeholderGroupsData],
  );

  const { watch, handleSubmit, control } = form;
  const channel = watch('channel');
  const message = watch('message') || '';

  const selectedTransport = React.useMemo(
    () => resolveTransportByChannel(appTransports, channel),
    [appTransports, channel],
  );

  const smsInfo = channel === 'sms' && message ? getSmsInfo(message) : null;
  const isUnicode = /[\u0900-\u097F]/.test(message);
  const maxChars = isUnicode ? 350 : 700;
  const charsCount = smsInfo?.characterCount ?? message.length;
  const credits = smsInfo?.smsCredits ?? 0;
  const isSubmitting = createCommunication.isPending || uploadFile.isPending;

  const onSubmit = (data: BroadcastFormValues) => {
    if (!selectedTransport?.cuid) return;

    pendingBroadcast.current = data;
    confirmDialog.onTrue();
  };

  const handleConfirmCreate = async () => {
    const data = pendingBroadcast.current;
    if (!data) return;
    if (!selectedTransport?.cuid) return;

    try {
      let audioURL: { fileName: string; mediaURL: string } | undefined;
      if (data.channel === 'voice' && data.audioFile) {
        if (typeof data.audioFile?.mediaURL === 'string') {
          audioURL = { fileName: data.audioFile.fileName, mediaURL: data.audioFile.mediaURL };
        } else {
          const file = data.audioFile instanceof File
            ? data.audioFile
            : new File([data.audioFile], `recording-${Date.now()}.wav`, { type: 'audio/wav' });
          const formData = new FormData();
          formData.append('file', file, file.name);
          const { data: uploaded } = await uploadFile.mutateAsync(formData);
          audioURL = { fileName: uploaded?.fileName, mediaURL: uploaded?.mediaURL };
        }
      }

      const targets = [
        ...(data.beneficiaries ?? []).map((g: any) => ({ groupId: g.id, groupType: 'BENEFICIARY' as const })),
        ...(data.stakeholders ?? []).map((g: any) => ({ groupId: g.id, groupType: 'STAKEHOLDERS' as const })),
      ];

      const created: any = await createCommunication.mutateAsync({
        projectUUID: uuid,
        broadcastPayload: {
          title: data.title,
          targets,
          ...(data.channel !== 'voice' && data.message ? { message: data.message } : {}),
          ...(data.channel === 'email' && data.subject ? { subject: data.subject } : {}),
          ...(data.channel === 'voice' && audioURL ? { audioURL } : {}),
          transportId: selectedTransport.cuid,
          xrefId: uuid,
        },
      });

      const communicationUUID = created?.data?.uuid ?? created?.response?.data?.uuid ?? created?.uuid;
      if (!communicationUUID) {
        toast.error(t('ERROR'));
        return;
      }

      router.push(`/projects/aa/${projectId}/communications`);
    } catch {
      return;
    } finally {
      confirmDialog.onFalse();
      pendingBroadcast.current = null;
    }
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
              <CardHeader><CardTitle className="text-xl">{t("COMMUNICATION_DETAILS")}</CardTitle></CardHeader>
              <CardContent className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel required>{t("COMMUNICATION_TITLE")}</FormLabel>
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <FormSelectTrigger><SelectValue placeholder={t("SELECT_CHANNEL")} /></FormSelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sms">{t("SMS")}</SelectItem>
                            <SelectItem value="voice">{t("VOICE")}</SelectItem>
                            <SelectItem value="email">{t("EMAIL")}</SelectItem>
                          </SelectContent>
                        </Select>
                        {!appTransports ? (
                          <p className="text-xs text-muted-foreground">{t("LOADING_TRANSPORTS")}</p>
                        ) : !selectedTransport ? (
                          <p className="text-xs text-destructive">
                            {t("TRANSPORT_NOT_CONFIGURED")}
                          </p>
                        ) : null}
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

                <TargetAudienceSelector
                  beneficiaryGroups={beneficiaryGroups}
                  stakeholderGroups={stakeholderGroups}
                  isLoading={isLoadingBeneficiaries || isLoadingStakeholders}
                />

                {channel === 'voice' && <VoiceMessageSource uploadFile={uploadFile} />}

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
                          <div className="flex flex-wrap justify-between items-start gap-2 mt-1 min-w-0">
                            <div className="min-w-0 flex-1">
                              <FormMessage />
                            </div>
                            <div className="ml-auto flex flex-wrap items-center text-xs text-muted-foreground gap-3 pt-1 shrink-0">
                              {credits > 0 && (
                                <p className="text-xs text-muted-foreground whitespace-nowrap">
                                  <span className="font-medium text-foreground">{formatDigits(credits)}</span>{' '}
                                  {credits === 1 ? t("SMS_CREDIT") : t("SMS_CREDITS")}
                                </p>
                              )}
                              <p className={`whitespace-nowrap ${charsCount > maxChars ? 'text-destructive font-medium' : ''}`}>
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
              <CardFooter className="flex flex-wrap justify-end gap-3 border-t p-4 sm:p-6">
                <Button type="button" variant="outline" onClick={() => router.push(`/projects/aa/${projectId}/communications`)}>
                  {t("CANCEL")}
                </Button>
                <Button type="submit" disabled={isSubmitting || !selectedTransport}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t("CREATE_COMMUNICATION")}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>

      <CommunicationConfirmDialog
        isOpen={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        onConfirm={handleConfirmCreate}
        dialogTitle={t('CREATE_COMMUNICATION')}
        isPending={isSubmitting}
        confirmLabel={t('CREATE_COMMUNICATION')}
        description={t('CREATE_COMMUNICATION_CONFIRM')}
        values={watch()}
        credits={credits}
      />
    </div>
  );
}

