import { useTranslations } from 'next-intl';
import {
  getBeneficiariesGroupByUuids,
  useBeneficiariesGroups,
  useBeneficiariesGroupStore,
  useStakeholdersGroupByUuids,
  useStakeholdersGroups,
  useStakeholdersGroupsStore,
  useUploadFile,
} from '@rahat-ui/query';
import {
  TargetAudienceSelector,
  AudienceGroupOption,
} from '../../communications/components/target-audience-selector';
import {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
  ChangeEvent,
  useMemo,
  useCallback,
  RefObject,
} from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Transport, ValidationContent } from '@rumsan/connect/src/types';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { AudioRecorder } from './recorder';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { CloudUpload, Mic, Trash2 } from 'lucide-react';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import {
  validateStakeholderGroupFields,
  validateBeneficiaryGroupFields,
} from 'apps/rahat-ui/src/utils/validateGroupEmails';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { createCommunicationFormSchema } from '../schemas/activity.schemas';
import Loader from 'apps/community-tool-ui/src/components/Loader';
import { UseBooleanReturnType } from 'apps/rahat-ui/src/hooks/use-boolean';
import {
  FormInput,
  FormSelectTrigger,
  FormTextarea,
} from 'apps/rahat-ui/src/common';
import { cn } from '@rahat-ui/shadcn/src';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { getSmsInfo } from 'apps/rahat-ui/src/utils/buildCommunicationPayload';
import { GroupPurpose } from 'apps/rahat-ui/src/constants/beneficiary.const';

type CommunicationFormData = z.infer<
  ReturnType<typeof createCommunicationFormSchema>
>;

interface AddCommunicationFormProps {
  form: UseFormReturn<CommunicationFormData>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  appTransports: Transport[] | undefined;
  onSave: VoidFunction;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isMultiSelect?: boolean;
  editMode?: UseBooleanReturnType;
  onCancelEdit?: VoidFunction;
}

export default function AddCommunicationForm({
  form,
  setLoading,
  appTransports,
  onSave,
  setOpen,
  isMultiSelect = false,
  editMode,
  onCancelEdit,
}: AddCommunicationFormProps) {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();
  const { id: projectId } = useParams();
  const [contentType, setContentType] = useState<ValidationContent | ''>('');
  const [customFileName, setCustomFileName] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timer, setTimer] = useState(0);
  const [recordedFile, setRecordedFile] = useState<string | null>(null);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isEmailValidated, setIsEmailValidated] = useState<boolean | undefined>(
    true,
  );

  const mediaRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isResettingRef = useRef(false);

  const pad = (num: number) => String(num).padStart(2, '0');
  const hh = pad(Math.floor(timer / 3600));
  const mm = pad(Math.floor((timer % 3600) / 60));
  const ss = pad(timer % 60);

  const fileUpload = useUploadFile();
  const stakeholdersGroups = useStakeholdersGroupsStore(
    (state) => state.stakeholdersGroups,
  );
  const beneficiaryGroups = useBeneficiariesGroupStore(
    (state) => state.beneficiariesGroups,
  );

  const { data: benGroupsData, isLoading: benGroupsLoading } =
    useBeneficiariesGroups(projectId as UUID, {
      excludeGroupPurpose: GroupPurpose.GENERAL,
      page: 1,
      perPage: 100,
    });
  const { data: stakeGroupsData, isLoading: stakeGroupsLoading } =
    useStakeholdersGroups(projectId as UUID, {
      page: 1,
      perPage: 100,
    });

  const beneficiaryAudienceOptions: AudienceGroupOption[] = useMemo(() => {
    const rawList =
      (benGroupsData as any)?.data ??
      (Array.isArray(beneficiaryGroups) && beneficiaryGroups.length > 0
        ? beneficiaryGroups
        : []);

    return (Array.isArray(rawList) ? rawList : [])
      .filter((g: any) => g?.groupPurpose !== GroupPurpose.GENERAL)
      .map((g: any) => ({
        id: g?.uuid,
        name: g?.name,
        count:
          g?._count?.beneficiaries ??
          g?.groupedBeneficiaries?.length ??
          g?.beneficiaries?.length ??
          0,
      }))
      .filter((g) => g.id && g.name);
  }, [benGroupsData, beneficiaryGroups]);

  const stakeholderAudienceOptions: AudienceGroupOption[] = useMemo(() => {
    const rawList =
      (stakeGroupsData as any)?.data ??
      (Array.isArray(stakeholdersGroups) && stakeholdersGroups.length > 0
        ? stakeholdersGroups
        : []);
    return (Array.isArray(rawList) ? rawList : [])
      .map((g: any) => ({
        id: g?.uuid,
        name: g?.name,
        count:
          g?._count?.stakeholders ??
          g?.stakeholders?.length ??
          0,
      }))
      .filter((g) => g.id && g.name);
  }, [stakeGroupsData, stakeholdersGroups]);

  const selectedBeneficiaries = form.watch('beneficiaries' as any) || [];
  const selectedStakeholders = form.watch('stakeholders' as any) || [];

  const groupType = form.watch('groupType');
  const groupId = form.watch('groupId');
  const { errors } = form.formState;

  // Hydrate legacy single-group communication into TargetAudienceSelector when editing
  useEffect(() => {
    const hasSelection =
      (Array.isArray(selectedBeneficiaries) && selectedBeneficiaries.length > 0) ||
      (Array.isArray(selectedStakeholders) && selectedStakeholders.length > 0);

    if (
      !hasSelection &&
      Array.isArray(groupId) &&
      groupId.length > 0 &&
      groupType
    ) {
      if (groupType === 'BENEFICIARY' && beneficiaryAudienceOptions.length > 0) {
        const matching = beneficiaryAudienceOptions.filter((opt) =>
          groupId.includes(opt.id),
        );
        if (matching.length > 0) {
          form.setValue('beneficiaries' as any, matching, { shouldValidate: true });
        }
      } else if (
        groupType === 'STAKEHOLDERS' &&
        stakeholderAudienceOptions.length > 0
      ) {
        const matching = stakeholderAudienceOptions.filter((opt) =>
          groupId.includes(opt.id),
        );
        if (matching.length > 0) {
          form.setValue('stakeholders' as any, matching, { shouldValidate: true });
        }
      }
    }
  }, [
    groupId,
    groupType,
    beneficiaryAudienceOptions,
    stakeholderAudienceOptions,
    selectedBeneficiaries.length,
    selectedStakeholders.length,
    form,
  ]);

  const benGroupIds = useMemo(() => {
    if (selectedBeneficiaries.length > 0) {
      return selectedBeneficiaries.map((b: any) => b.id).filter(Boolean);
    }
    if (groupType === 'BENEFICIARY' && Array.isArray(groupId)) {
      return groupId.filter(Boolean);
    }
    return [];
  }, [selectedBeneficiaries, groupType, groupId]);

  const stakeGroupIds = useMemo(() => {
    if (selectedStakeholders.length > 0) {
      return selectedStakeholders.map((s: any) => s.id).filter(Boolean);
    }
    if (groupType === 'STAKEHOLDERS' && Array.isArray(groupId)) {
      return groupId.filter(Boolean);
    }
    return [];
  }, [selectedStakeholders, groupType, groupId]);

  const enableStakeholdersGroupQuery = stakeGroupIds.length > 0;
  const enableBeneficiaryGroupQuery = benGroupIds.length > 0;

  const { data: stakeholdersGroup, isLoading: stakeholdersGroupLoading } =
    useStakeholdersGroupByUuids(
      projectId as UUID,
      stakeGroupIds,
      enableStakeholdersGroupQuery,
    );

  const { data: beneficiaryGroup, isLoading: beneficiaryGroupLoading } =
    getBeneficiariesGroupByUuids(benGroupIds, enableBeneficiaryGroupQuery);

  const handleAudioFileChange = async (
    fileOrEvent: File | ChangeEvent<HTMLInputElement>,
  ) => {
    let file: File | undefined;

    // If it's from <input>, extract the file
    if ('target' in fileOrEvent) {
      file = fileOrEvent.target.files?.[0];
    } else {
      file = fileOrEvent;
    }

    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const { data: afterUpload } = await fileUpload.mutateAsync(formData);
      form.setValue('audioURL', afterUpload);
      // resetRecording(); // if this was from recording flow
    } catch (err) {
      console.error('File upload failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isEmailValidated) {
      return;
    }

    const isAllValidated = await form.trigger();
    if (!isAllValidated) return;

    onSave();
    // form.reset();
    form.setValue('audioURL', { fileName: '', mediaURL: '' });
    fileUpload.reset();
    setOpen(false);
    editMode?.onFalse();
  };

  const clearCommunicationForm = () => {
    if (editMode?.value && onCancelEdit) {
      onCancelEdit();
      setOpen(false);
      editMode.onFalse();
      form.reset();
      return;
    }
    form.reset();
    fileUpload.reset();
  };

  const charactersText = t('CHARACTERS');

  const updateTimer = () => {
    setTimer((t) => t + 1);
    timerRef.current = setTimeout(updateTimer, 1000);
  };

  const startRecording = async () => {
    try {
      isResettingRef.current = false;
      setRecordedFile(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      analyserRef.current = analyser;
      audioCtxRef.current = ctx;

      const recorder = new MediaRecorder(stream);
      mediaRef.current = recorder;

      const localChunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        localChunks.push(e.data);
      };
      recorder.onstop = () => {
        if (isResettingRef.current) {
          isResettingRef.current = false;
          return; // 🧹 skip blob creation on reset
        }
        const blob = new Blob(localChunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setRecordedFile(url);
        setChunks(localChunks);
        setIsFinished(true);
      };

      recorder.start();
      setIsRecording(true);
      setTimer(0);
      updateTimer();
    } catch (error) {
      console.error(error);
      alert(t('MICROPHONE_ACCESS_IS_REQUIRED'));
    }
  };

  const stopRecording = () => {
    if (mediaRef.current?.state !== 'inactive') {
      mediaRef.current?.stop();
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    stopAll();
    setIsPaused(false);
  };

  const resetRecording = () => {
    isResettingRef.current = true;
    mediaRef.current?.stop(); // stop the recorder
    stopAll(); // cleanup audio stream, timer, etc.
    setChunks([]);
    setRecordedFile(null); // clear local preview URL
    setIsFinished(false);
    form.setValue('audioURL', { fileName: '', mediaURL: '' });
    fileUpload.reset(); // reset upload state
    setIsPaused(false);
  };

  const pauseRecording = useCallback(() => {
    if (mediaRef.current?.state === 'recording') {
      mediaRef.current.pause();
      setIsPaused(true);
      clearTimeout(timerRef.current);
    }
  }, []);

  const resumeRecording = () => {
    if (mediaRef.current?.state === 'paused') {
      mediaRef.current.resume();
      setIsPaused(false);
      updateTimer(); // resume timerresumeRecording
    }
  };

  const stopAll = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRecording(false);
    analyserRef.current?.disconnect();
    audioCtxRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const removeFile = () => {
    form.setValue('audioURL', { fileName: '', mediaURL: '' });
    setRecordedFile(null);
    fileUpload.reset();
  };

  const transportId = form.watch('transportId');
  const audioFile = form.watch('audioURL');

  const isLoading = useMemo(
    () =>
      stakeholdersGroupLoading ||
      beneficiaryGroupLoading ||
      benGroupsLoading ||
      stakeGroupsLoading,
    [
      stakeholdersGroupLoading,
      beneficiaryGroupLoading,
      benGroupsLoading,
      stakeGroupsLoading,
    ],
  );

  const transportData = useMemo(() => {
    if (!transportId || !appTransports?.length) {
      return;
    }
    return appTransports?.find((t) => t.cuid === transportId);
  }, [transportId, appTransports]);

  const isVoice =
    transportData?.name === 'VOICE' ||
    contentType === ValidationContent.URL;
  const isEmail = transportData?.name === 'EMAIL';
  const isText =
    transportData?.name === 'SMS' ||
    transportData?.name === 'EMAIL' ||
    contentType === ValidationContent.TEXT;

  // Validate emails whenever group or transport changes
  useEffect(() => {
    if (!transportData) return;

    if (benGroupIds.length === 0 && stakeGroupIds.length === 0) {
      setIsEmailValidated(true);
      return;
    }

    if (transportData?.name === 'VOICE') {
      setIsEmailValidated(true);
      return;
    }

    const fieldName = transportData.name === 'EMAIL' ? 'email' : 'phone';
    const invalidGroups: string[] = [];

    if (benGroupIds.length > 0 && beneficiaryGroup) {
      const benResult = validateBeneficiaryGroupFields(
        beneficiaryGroup,
        fieldName,
      );
      if (!benResult.valid) {
        invalidGroups.push(...benResult.invalidGroups);
      }
    }

    if (stakeGroupIds.length > 0 && stakeholdersGroup) {
      const stakeResult = validateStakeholderGroupFields(
        stakeholdersGroup,
        fieldName,
      );
      if (!stakeResult.valid) {
        invalidGroups.push(...stakeResult.invalidGroups);
      }
    }

    if (invalidGroups.length > 0) {
      form.setError('targetAudience', {
        type: 'manual',
        message: t('FIELD_MISSING_FOR_SOME_BENEFICIARIES', {
          field: fieldName,
          groups: invalidGroups.join(', '),
        }),
      });
      setIsEmailValidated(false);
    } else {
      const currentError = form.formState.errors.targetAudience;
      if (currentError?.type === 'manual') {
        form.clearErrors('targetAudience');
      }
      setIsEmailValidated(true);
    }
  }, [
    stakeholdersGroup,
    beneficiaryGroup,
    transportData,
    benGroupIds.length,
    stakeGroupIds.length,
    t,
  ]);

  // When transport type changes, reset relevant fields
  useEffect(() => {
    if (!transportData) {
      return;
    }

    setContentType(transportData?.validationContent as ValidationContent);

    if (transportData?.name === 'SMS' || transportData?.name === 'EMAIL') {
      form.setValue('audioURL', { fileName: '', mediaURL: '' });
    }

    if (transportData?.name === 'SMS') {
      form.setValue('subject', '');
    }

    if (transportData.name === 'VOICE') {
      form.setValue('message', '');
      form.setValue('subject', '');
    }
  }, [transportData]);

  return (
    <Form {...form}>
      <Card className="shadow-sm my-6 border">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">
            {editMode?.value ? t('EDIT_COMMUNICATION') : t('ADD_COMMUNICATION')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="communicationTitle"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel required>{t('COMMUNICATION_TITLE')}</FormLabel>
                  <FormControl>
                    <FormInput
                      placeholder={t('WRITE_COMMUNICATION_TITLE')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transportId"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel required>{t('COMMUNICATION_TYPE')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <FormSelectTrigger value={field.value}>
                        <SelectValue placeholder={t('SELECT_COMMUNICATION_TYPE')} />
                      </FormSelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {appTransports?.map((transport) => {
                        return (
                          <SelectItem
                            key={transport?.cuid}
                            value={transport?.cuid as string}
                          >
                            {tg(transport?.name as any) || transport?.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {isEmail && (
            <FormField
              control={form.control}
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
            beneficiaryGroups={beneficiaryAudienceOptions}
            stakeholderGroups={stakeholderAudienceOptions}
            isLoading={isLoading}
          />

          {isVoice && (
            <div className="space-y-4">
              <div className="flex flex-col space-y-1">
                <Label className="text-base font-semibold">
                  {t('VOICE_MESSAGE_SOURCE')}
                </Label>
                {errors.audioURL && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.audioURL.message as string}
                  </p>
                )}
              </div>
              <Tabs
                defaultValue="upload"
                className="w-full border rounded-md p-4 bg-slate-50"
              >
                <TabsList className="mb-4">
                  <TabsTrigger
                    value="upload"
                    disabled={fileUpload.isPending}
                    className="gap-2"
                  >
                    <CloudUpload className="w-4 h-4" />
                    {t('UPLOAD_AUDIO')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="record"
                    disabled={fileUpload.isPending}
                    className="gap-2"
                  >
                    <Mic className="w-4 h-4" />
                    {t('RECORD_AUDIO')}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="audio/*"
                      disabled={fileUpload.isPending}
                      className={cn(
                        errors.audioURL &&
                        'shadow-[inset_4px_0_0_0_hsl(var(--destructive))] bg-red-50 focus-visible:ring-2 focus-visible:ring-destructive',
                        !errors.audioURL &&
                        Boolean(audioFile?.mediaURL) &&
                        'shadow-[inset_4px_0_0_0_hsl(var(--primary))] bg-blue-50 pl-2',
                      )}
                      onChange={handleAudioFileChange}
                    />
                    {fileUpload.isPending && (
                      <p className="text-xs text-muted-foreground">
                        {t('UPLOADING_AUDIO')}
                      </p>
                    )}
                    {Boolean(audioFile?.fileName) && !fileUpload.isError && (
                      <p className="text-xs text-muted-foreground">
                        {audioFile?.fileName}
                      </p>
                    )}
                    {fileUpload.isError && (
                      <p className="text-xs text-destructive">
                        {t('UPLOAD_ERROR')}
                      </p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="record" className="space-y-4">
                  <AudioRecorder
                    isRecording={isRecording}
                    isFinished={isFinished}
                    timer={`${hh}:${mm}:${ss}`}
                    recordedFile={recordedFile}
                    chunks={chunks}
                    setChunks={setChunks}
                    startRecording={startRecording}
                    stopRecording={stopRecording}
                    resetRecording={resetRecording}
                    animationRef={animationRef}
                    analyserRef={analyserRef}
                    resumeRecording={resumeRecording}
                    pauseRecording={pauseRecording}
                    isPaused={isPaused}
                    handleUpload={() => {
                      setShowConfirmDialog(true);
                    }}
                    canvasRef={canvasRef}
                    fileUploadPending={fileUpload.isPending}
                  />
                  {fileUpload.isError && isFinished && (
                    <p className="text-xs text-destructive">
                      {t('UPLOAD_ERROR')}
                    </p>
                  )}
                </TabsContent>
              </Tabs>

              {Boolean(audioFile?.fileName && audioFile?.mediaURL) && (
                <div className="p-3 rounded-md border bg-white space-y-2">
                  <h3 className="text-sm font-medium">
                    {audioFile?.fileName}
                  </h3>
                  <div className="flex gap-2 items-center justify-between">
                    <audio
                      src={audioFile?.mediaURL}
                      controls
                      className="w-full h-10 bg-none"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={removeFile}
                      type="button"
                      className="text-destructive hover:text-destructive shrink-0"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {isText && (
            <FormField
              control={form.control}
              name="message"
              rules={{
                validate: (value) => {
                  if (!value) return true;

                  if (/[\u0900-\u097F]/.test(value)) {
                    return (
                      value.length <= 350 ||
                      t('NEPALI_MESSAGE_LIMIT')
                    );
                  } else {
                    return (
                      value.length <= 700 ||
                      t('ENGLISH_MESSAGE_LIMIT')
                    );
                  }
                },
              }}
              render={({ field }) => {
                const isNep = /[\u0900-\u097F]/.test(field.value || '');
                const maxLen = isNep ? 350 : 700;
                const smsInfo =
                  transportData?.name === 'SMS' && field.value
                    ? getSmsInfo(field.value)
                    : null;
                return (
                  <FormItem className="space-y-2">
                    <FormLabel required>{t('MESSAGE_CONTENT')}</FormLabel>

                    <FormControl>
                      <FormTextarea
                        placeholder={
                          transportData?.name === 'EMAIL'
                            ? t('EMAIL_BODY_PLACEHOLDER')
                            : t('SMS_MESSAGE_PLACEHOLDER')
                        }
                        {...field}
                        className="h-32 resize-none"
                        maxLength={maxLen}
                      />
                    </FormControl>
                    <div className="flex flex-wrap justify-between items-start gap-2 mt-1 min-w-0">
                      <div className="min-w-0 flex-1">
                        <FormMessage />
                      </div>

                      <div className="ml-auto flex flex-wrap items-center text-xs text-muted-foreground gap-3 pt-1 shrink-0">
                        {smsInfo && smsInfo.smsCredits > 0 && (
                          <p className="text-xs text-muted-foreground whitespace-nowrap">
                            <span className="font-medium text-foreground">
                              {formatNum(smsInfo.smsCredits)}
                            </span>{' '}
                            {smsInfo.smsCredits === 1
                              ? t('SMS_CREDIT')
                              : t('SMS_CREDITS')}
                          </p>
                        )}
                        <p
                          className={`whitespace-nowrap ${(field.value?.length ?? 0) > maxLen
                            ? 'text-destructive font-medium'
                            : ''
                            }`}
                        >
                          {formatNum(field.value?.length ?? 0)} / {formatNum(maxLen)}{' '}
                          {charactersText}
                        </p>
                      </div>
                    </div>
                  </FormItem>
                );
              }}
            />
          )}
        </CardContent>

        <CardFooter className="flex flex-wrap justify-end gap-3 border-t p-4 sm:p-6">
          <Button
            variant="outline"
            onClick={clearCommunicationForm}
            type="button"
          >
            {editMode?.value ? tg('CANCEL') : tg('CLEAR')}
          </Button>
          <Button
            onClick={handleSave}
            type="button"
            disabled={fileUpload.isPending}
          >
            {tg('SAVE')}
          </Button>
        </CardFooter>

        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
          >
            <DialogHeader>
              <DialogTitle>{t('ENTER_A_FILE_NAME')}</DialogTitle>
              <DialogDescription>
                <Input
                  placeholder={t('ENTER_FILE_NAME')}
                  value={customFileName}
                  onChange={(e) => setCustomFileName(e.target.value)}
                />
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowConfirmDialog(false)}
                type="button"
              >
                {tg('CANCEL')}
              </Button>

              <Button
                onClick={() => {
                  const blob = new Blob(chunks, { type: 'audio/wav' });
                  const file = new File([blob], `${customFileName}.wav`, {
                    type: 'audio/wav',
                  });
                  handleAudioFileChange(file);
                  setShowConfirmDialog(false);
                }}
                type="button"
                disabled={!customFileName}
              >
                {t('CONFIRM_UPLOAD')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    </Form>
  );
}
