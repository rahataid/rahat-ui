import {
  useBeneficiariesGroupStore,
  useSingleBeneficiaryGroup,
  useSingleStakeholdersGroup,
  useStakeholdersGroupsStore,
  useUploadFile,
} from '@rahat-ui/query';
import {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
  ChangeEvent,
  useMemo,
  useCallback,
} from 'react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { Transport, ValidationContent } from '@rumsan/connect/src/types';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { AudioRecorder } from './recorder';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { MicIcon, Trash2, UploadIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { validateGroupEmails } from 'apps/rahat-ui/src/utils/validateGroupEmails';
import { renderGroups } from './renderGroup';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { createCommunicationFormSchema } from '../schemas/activity.schemas';

type CommunicationFormData = z.infer<
  ReturnType<typeof createCommunicationFormSchema>
>;

interface AddCommunicationFormProps {
  form: UseFormReturn<CommunicationFormData>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  appTransports: Transport[] | undefined;
  onSave: VoidFunction;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AddCommunicationForm({
  form,
  setLoading,
  appTransports,
  onSave,
  setOpen,
}: AddCommunicationFormProps) {
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

  const groupType = form.watch('groupType');
  const groupId = form.watch('groupId');

  const stakeholderId =
    groupType === 'STAKEHOLDERS' && groupId ? (groupId as UUID) : ('' as UUID);
  const beneficiaryId =
    groupType === 'BENEFICIARY' && groupId ? (groupId as UUID) : ('' as UUID);

  const { data: stakeholdersGroup, isLoading: stakeholdersGroupLoading } =
    useSingleStakeholdersGroup(projectId as UUID, stakeholderId);

  const { data: beneficiaryGroup, isLoading: beneficiaryGroupLoading } =
    useSingleBeneficiaryGroup(projectId as UUID, beneficiaryId);

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
    form.reset();
    form.setValue('audioURL', { fileName: '', mediaURL: '' });
    fileUpload.reset();
    setOpen(false);
  };

  const clearCommunicationForm = () => {
    form.reset();
    fileUpload.reset();
  };

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
      alert('Microphone access is required.');
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
    () => stakeholdersGroupLoading || beneficiaryGroupLoading,
    [stakeholdersGroupLoading, beneficiaryGroupLoading],
  );

  const transportData = useMemo(() => {
    if (!transportId || !appTransports?.length) {
      return;
    }
    return appTransports?.find((t) => t.cuid === transportId);
  }, [transportId, appTransports]);

  // Validate emails whenever group or transport changes
  useEffect(() => {
    if (transportData?.name !== 'EMAIL') {
      // Clear any previous errors if transport doesn't require email
      form.clearErrors('groupId');
      return;
    }

    let isEmailValidated = false;
    if (groupType === 'STAKEHOLDERS') {
      isEmailValidated = validateGroupEmails({
        group: stakeholdersGroup?.stakeholders,
        type: 'stakeholders',
        extractEmail: (s) => s?.email,
        form,
      });
    } else if (groupType === 'BENEFICIARY') {
      isEmailValidated = validateGroupEmails({
        group: beneficiaryGroup?.groupedBeneficiaries,
        type: 'beneficiaries',
        extractEmail: (s) => s?.Beneficiary?.pii?.email,
        form,
      });
    }
    setIsEmailValidated(isEmailValidated);
  }, [stakeholdersGroup, beneficiaryGroup, transportData]);

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
    <div className="border border-dashed rounded p-4 my-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold">Add : Communication</h1>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="communicationTitle"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Communication Title</FormLabel>
              <FormControl>
                <Input placeholder="Write Communication title" {...field} />
              </FormControl>
              {form.formState.errors.communicationTitle && (
                <FormMessage>
                  {form.formState.errors.communicationTitle.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="groupType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="STAKEHOLDERS">Stakeholders</SelectItem>
                  <SelectItem value="BENEFICIARY">Beneficiary</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.groupType && (
                <FormMessage>
                  {form.formState.errors.groupType.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="groupId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={'Select group'} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {renderGroups(
                      form,
                      stakeholdersGroups,
                      beneficiaryGroups,
                      isLoading,
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {form.formState.errors.groupId && (
                <FormMessage>
                  {form.formState.errors.groupId.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transportId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Communication Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select communication type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {appTransports?.map((transport) => {
                    return (
                      <SelectItem
                        key={transport?.cuid}
                        value={transport?.cuid as string}
                      >
                        {transport?.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {form.formState.errors.transportId && (
                <FormMessage>
                  {form.formState.errors.transportId.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        {contentType === ValidationContent.URL && !fileUpload.isSuccess && (
          <div className="col-span-2">
            <Tabs defaultValue="upload" className="items-center">
              <TabsList className="">
                <TabsTrigger value="upload" className="group gap-2">
                  <UploadIcon className="w-5 h-5" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="record" className="group gap-2">
                  <MicIcon className="w-5 h-5" />
                  Record
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <FormField
                  control={form.control}
                  name="audioURL"
                  render={() => (
                    <FormItem className="col-span-2">
                      <FormControl>
                        <Input
                          type="file"
                          accept="audio/*"
                          onChange={handleAudioFileChange}
                        />
                      </FormControl>
                      <div className="flex justify-end">
                        {fileUpload.isPending && (
                          <p className="text-green-600 text-xs">uploading...</p>
                        )}
                        {fileUpload.isError && (
                          <p className="text-red-600 text-xs">upload error</p>
                        )}
                        {fileUpload.isSuccess && (
                          <p className="text-green-600 text-xs">
                            upload complete
                          </p>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="record">
                <FormField
                  control={form.control}
                  name="audioURL"
                  render={() => {
                    return (
                      <FormItem>
                        <FormControl>
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
                        </FormControl>
                        <div className="flex justify-end">
                          {fileUpload.isPending && (
                            <p className="text-green-600 text-xs">
                              uploading...
                            </p>
                          )}

                          {fileUpload.isError && (
                            <p className="text-red-600 text-xs">upload error</p>
                          )}

                          {fileUpload.isSuccess && (
                            <p className="text-green-600 text-xs">
                              upload complete
                            </p>
                          )}
                        </div>

                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </TabsContent>
            </Tabs>
            {form.formState.errors.audioURL && (
              <FormMessage>
                {form.formState.errors.audioURL.message}
              </FormMessage>
            )}
          </div>
        )}

        {contentType === ValidationContent.URL &&
          audioFile?.fileName &&
          audioFile?.mediaURL && (
            <div className="pt-2 w-full">
              <h3 className="text-sm font-medium mb-2">
                {audioFile?.fileName}
              </h3>
              <div className="flex gap-2 items-center justify-center">
                <audio
                  src={audioFile?.mediaURL}
                  controls
                  className="w-full h-10 bg-none"
                />
                <Trash2
                  onClick={removeFile}
                  className="h-5 w-5s hover:cursor-pointer"
                  color="red"
                />
              </div>
            </div>
          )}

        {transportData?.name === 'EMAIL' && (
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Enter subject" {...field} />
                </FormControl>
                {form.formState.errors.subject && (
                  <FormMessage>
                    {form.formState.errors.subject.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
        )}

        {contentType === ValidationContent.TEXT && (
          <FormField
            control={form.control}
            name="message"
            rules={{
              validate: (value) => {
                if (!value) return true;

                if (/[\u0900-\u097F]/.test(value)) {
                  return (
                    value.length <= 350 ||
                    'Nepali message cannot exceed 350 characters'
                  );
                } else {
                  return (
                    value.length <= 700 ||
                    'English message cannot exceed 700 characters'
                  );
                }
              },
            }}
            render={({ field }) => {
              const isNep = /[\u0900-\u097F]/.test(field.value || '');
              const maxLen = isNep ? 350 : 700;
              return (
                <FormItem className="col-span-2">
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write message"
                      {...field}
                      maxLength={maxLen}
                    />
                  </FormControl>
                  <div className="flex justify-between items-center">
                    {form.formState.errors.message && (
                      <FormMessage>
                        {form.formState.errors.message.message}
                      </FormMessage>
                    )}
                    <p className="ml-auto text-xs text-muted-foreground">
                      {field.value?.length || 0} / {maxLen} characters
                    </p>
                  </div>
                </FormItem>
              );
            }}
          />
        )}
      </div>

      <div className="flex justify-end mt-4 gap-4">
        <Button
          variant="outline"
          onClick={clearCommunicationForm}
          type="button"
        >
          Remove
        </Button>
        <Button
          variant="outline"
          onClick={handleSave}
          type="button"
          disabled={fileUpload.isPending}
        >
          Save
        </Button>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Enter a file name</DialogTitle>
            <DialogDescription>
              <Input
                placeholder="Enter file name"
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
              Cancel
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
              Confirm Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
