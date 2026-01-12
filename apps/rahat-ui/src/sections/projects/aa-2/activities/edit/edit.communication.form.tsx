import {
  useBeneficiariesGroupStore,
  useSingleBeneficiaryGroup,
  useSingleStakeholdersGroup,
  useStakeholdersGroupsStore,
  useUploadFile,
} from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from 'react';
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { Transport, ValidationContent } from '@rumsan/connect/src/types';
import { UUID } from 'crypto';
import { Trash2, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { AudioRecorder } from '../components/recorder';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { MicIcon, UploadIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useWatch } from 'react-hook-form';
type IProps = {
  form: any;
  appTransports: Transport[] | undefined;
  setLoading: Dispatch<SetStateAction<boolean>>;
  index: number;
  onClose: VoidFunction;
  setIsRecording: Dispatch<SetStateAction<boolean>>;
  setIsFinished: Dispatch<SetStateAction<boolean>>;
  setRecordedFile: Dispatch<SetStateAction<string | null>>;
  isRecording: boolean;
  isFinished: boolean;
  recordedFile: string | null;
  setAudioIsUploaded: Dispatch<SetStateAction<boolean>>;
};

export default function EditCommunicationForm({
  form,
  appTransports,
  setLoading,
  index,
  onClose,
  setIsRecording,
  setIsFinished,
  setRecordedFile,
  isRecording,
  isFinished,
  recordedFile,
  setAudioIsUploaded,
}: IProps) {
  const { id: projectId } = useParams();

  const [audioFile, setAudioFile] = useState({});
  const [contentType, setContentType] = useState<ValidationContent | ''>('');
  const [address, setAddress] = useState(false);
  const [customFileName, setCustomFileName] = useState('');

  const [timer, setTimer] = useState(0);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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
  const [isPlaying, setIsPlaying] = useState(false);
  const stakeholdersGroups = useStakeholdersGroupsStore(
    (state) => state.stakeholdersGroups,
  );

  const beneficiaryGroups = useBeneficiariesGroupStore(
    (state) => state.beneficiariesGroups,
  );

  const fieldName = (name: string) => `activityCommunication.${index}.${name}`; // Dynamic field name generator
  const initialMessageRef = useRef(form.getValues(fieldName('message')));
  const initialAudioURLRef = useRef(form.getValues(fieldName('audioURL')));

  const selectedTransport = form.watch(fieldName('transportId'));
  const sessionId = form.watch(fieldName('sessionId'));
  const message = form.watch(fieldName('message'));

  useEffect(() => {
    if (!selectedTransport || !appTransports?.length) return;

    const transportData = appTransports.find(
      (t) => t.cuid === selectedTransport,
    );
    const newContentType =
      transportData?.validationContent as ValidationContent;

    if (newContentType) {
      setContentType(newContentType);
      if (
        newContentType === ValidationContent.URL &&
        typeof message === 'object'
      ) {
        setAudioFile(message);
      }
    }

    if (transportData?.validationAddress === 'EMAIL') {
      setAddress(true);
    } else {
      setAddress(false);
    }
  }, [selectedTransport, appTransports, message]);

  const fileUpload = useUploadFile();
  const activityCommunication = form.watch('activityCommunication') || {};

  const groupType = form.watch(fieldName('groupType'));
  const groupId = form.watch(fieldName('groupId'));

  const stakeholderId = groupType === 'STAKEHOLDERS' && groupId;
  const beneficiaryId = groupType === 'BENEFICIARY' && groupId;

  const { data: stakeholdersGroup, isLoading } = useSingleStakeholdersGroup(
    projectId as UUID,
    stakeholderId,
  );

  const { data: beneficiaryGroup, isLoading: isLoadingss } =
    useSingleBeneficiaryGroup(projectId as UUID, beneficiaryId);

  useEffect(() => {
    const transportData = appTransports?.find(
      (t) => t.cuid === selectedTransport,
    );

    if (transportData?.validationAddress !== 'EMAIL') return;

    if (stakeholdersGroup && Array.isArray(stakeholdersGroup.stakeholders)) {
      const hasValidEmail = stakeholdersGroup.stakeholders.some(
        (s: any) => s?.email?.trim() !== '',
      );

      if (!hasValidEmail) {
        form.setError(fieldName('groupId'), {
          type: 'manual',
          message:
            'Email address is missing for some stakeholders in this group.',
        });
      } else {
        form.clearErrors(fieldName('groupId'));
      }
    }
  }, [stakeholdersGroup, selectedTransport]);

  useEffect(() => {
    const transportData = appTransports?.find(
      (t) => t.cuid === selectedTransport,
    );

    if (transportData?.validationAddress !== 'EMAIL') return;

    if (
      beneficiaryGroup &&
      Array.isArray(beneficiaryGroup?.groupedBeneficiaries)
    ) {
      const hasValidEmail = beneficiaryGroup?.groupedBeneficiaries?.some(
        (s: any) => s?.Beneficiary?.pii?.email.trim() !== '',
      );

      if (!hasValidEmail) {
        form.setError(fieldName('groupId'), {
          type: 'manual',
          message:
            'Email address is missing for some beneficiaries in this group.',
        });
      } else {
        form.clearErrors(fieldName('groupId'));
      }
    }
  }, [beneficiaryGroup, selectedTransport]);

  const isSaveDisabled =
    !activityCommunication.groupType || !activityCommunication.groupId;

  const renderGroups = () => {
    const selectedGroupType = form.watch(fieldName('groupType'));
    let groups = <SelectLabel>Please select group type</SelectLabel>;
    if (selectedGroupType === 'STAKEHOLDERS') {
      const stakeholdersGroupsList = stakeholdersGroups.filter(
        (a: any) => a?._count?.stakeholders > 0,
      );
      if (stakeholdersGroupsList.length > 0) {
        groups = stakeholdersGroupsList.map((group: any) => (
          <SelectItem key={group.id} value={group.uuid}>
            {group?.name}
          </SelectItem>
        ));
      } else {
        groups = <SelectLabel>No stakeholders groups found</SelectLabel>;
      }
    }

    if (selectedGroupType === 'BENEFICIARY') {
      const beneficiaryGroupsList = beneficiaryGroups.filter(
        (a: any) => a?._count?.groupedBeneficiaries > 0,
      );
      if (beneficiaryGroupsList.length > 0) {
        groups = beneficiaryGroupsList.map((group: any) => (
          <SelectItem key={group.id} value={group.uuid}>
            {group?.name}
          </SelectItem>
        ));
      } else {
        groups = <SelectLabel>No beneficiary groups found</SelectLabel>;
      }
    }

    return groups;
  };

  const handleAudioFileChange = async (
    fileOrEvent: File | ChangeEvent<HTMLInputElement>,
  ) => {
    let file: File | undefined;

    if ('target' in fileOrEvent) {
      file = fileOrEvent.target.files?.[0];
    } else {
      file = fileOrEvent;
    }

    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data: afterUpload } = await fileUpload.mutateAsync(formData);
      setAudioFile(afterUpload);
      setRecordedFile(null);
    } catch (err) {
      console.error('File upload failed', err);
    }
  };

  useEffect(() => {
    form.setValue(fieldName('audioURL'), audioFile);
  }, [audioFile, setAudioFile]);

  useEffect(() => {
    setLoading(fileUpload.isPending);
  }, [fileUpload.isPending, !fileUpload.isPending]);
  const isSessionComplete = Boolean(sessionId);

  const isMediaFromBackend =
    (typeof initialMessageRef.current === 'object' &&
      initialMessageRef.current?.mediaURL) ||
    (typeof initialAudioURLRef.current === 'object' &&
      initialAudioURLRef.current?.mediaURL);

  const updateTimer = () => {
    setTimer((t) => t + 1);
    timerRef.current = setTimeout(updateTimer, 1000);
  };

  const startRecording = async () => {
    try {
      setAudioIsUploaded(true);
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
    setAudioIsUploaded(false);

    setIsPaused(false);
  };

  const resetRecording = () => {
    isResettingRef.current = true;
    mediaRef.current?.stop(); // stop the recorder
    stopAll(); // cleanup audio stream, timer, etc.
    setChunks([]);
    setRecordedFile(null); // clear local preview URL
    setIsFinished(false);
    setAudioFile({ fileName: '', mediaURL: '' }); // clear uploaded file
    form.setValue(fieldName('audioURL'), ''); // reset form field
    fileUpload.reset(); // reset upload state
    setIsPaused(false);
  };
  const pauseRecording = () => {
    if (mediaRef.current?.state === 'recording') {
      mediaRef.current.pause();
      setIsPaused(true);
      clearTimeout(timerRef.current);
      setAudioIsUploaded(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRef.current?.state === 'paused') {
      mediaRef.current.resume();
      setIsPaused(false);
      updateTimer(); // resume timer
      setAudioIsUploaded(true);
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
  useEffect(() => {
    if (!selectedTransport || !appTransports?.length) return;

    const transportData = appTransports.find(
      (t) => t.cuid === selectedTransport,
    );

    const newContentType =
      transportData?.validationContent as ValidationContent;

    if (newContentType) {
      setContentType(newContentType);

      // 🧼 Reset fields if type changes
      if (newContentType === ValidationContent.TEXT) {
        form.setValue(fieldName('message'), '');
        form.setValue(fieldName('audioURL'), {});
      } else if (newContentType === ValidationContent.URL) {
        form.setValue(fieldName('message'), {}); // assuming audio goes in message sometimes
        form.setValue(fieldName('audioURL'), {});
      }
    }

    setAddress(transportData?.validationAddress === 'EMAIL');
  }, [selectedTransport]);

  const removeFile = () => {
    // Clear form field
    form.setValue(fieldName('audioURL'), {});

    // Reset audio-related states
    setAudioFile({ fileName: '', mediaURL: '' });
    setRecordedFile(null);
    // Reset file upload state
    fileUpload.reset();
  };

  return (
    <div className="border border-dashed rounded p-4 my-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold">Communication</h1>
        {sessionId ? (
          <span>
            <Badge className="bg-green-200">communication completed</Badge>
          </span>
        ) : (
          <div className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-600 cursor-pointer">
            <X size={20} strokeWidth={3} onClick={onClose} />
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={fieldName('communicationTitle')}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Communication Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter communication title"
                  {...field}
                  disabled={isSessionComplete}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={fieldName('groupType')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || ''}
                disabled={isSessionComplete}
              >
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={fieldName('groupId')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isSessionComplete}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={'Select group'} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>{renderGroups()}</SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={fieldName('transportId')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Communication Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isSessionComplete || isMediaFromBackend}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select communication type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {appTransports?.map((transport) => {
                    return (
                      <SelectItem
                        value={transport?.cuid as string}
                        key={transport?.cuid}
                      >
                        {transport?.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {contentType === ValidationContent.URL &&
          !fileUpload.isSuccess &&
          !isSessionComplete &&
          !form.watch(fieldName('audioURL'))?.mediaURL && (
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
                    name={fieldName('audioURL')}
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
                    )}
                  />
                </TabsContent>
                <TabsContent value="record">
                  <FormField
                    control={form.control}
                    name={fieldName('audioURL')}
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
                                if (showConfirmDialog && !customFileName) {
                                  const backendFileName = form.watch(
                                    fieldName('audioURL'),
                                  )?.fileName;
                                  if (backendFileName) {
                                    setCustomFileName(
                                      backendFileName.replace('.wav', ''),
                                    ); // remove extension
                                  }
                                }
                                setAudioIsUploaded(true);
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
                              <p className="text-red-600 text-xs">
                                upload error
                              </p>
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
            </div>
          )}

        {form.watch(fieldName('audioURL'))?.mediaURL && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              {form.watch(fieldName('audioURL'))?.fileName}
            </p>
            <div className="flex gap-2 items-center justify-center">
              <audio
                controls
                src={form.watch(fieldName('audioURL'))?.mediaURL}
                className="bg-none w-full"
                style={{
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  border: 'none',
                }}
              />
              <Trash2
                onClick={() => removeFile()}
                className={`h-5 w-5s hover:cursor-pointer ${
                  isSessionComplete && 'hidden'
                }`}
                color="red"
              />
            </div>
          </div>
        )}
        {address && (
          <FormField
            control={form.control}
            name={fieldName('subject')}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Enter subject" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {contentType === ValidationContent.TEXT && (
          <FormField
            control={form.control}
            name={fieldName('message')}
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
                    {typeof message === 'string' ? (
                      <Textarea
                        placeholder="Write message"
                        {...field}
                        disabled={isSessionComplete}
                        maxLength={maxLen}
                      />
                    ) : (
                      <div className="flex flex-col gap-2">
                        <p className="text-sm text-muted-foreground">
                          {message?.fileName}
                        </p>
                        <audio controls src={message?.mediaURL} />
                      </div>
                    )}
                  </FormControl>
                  <div className="text-right text-xs text-muted-foreground">
                    {field.value?.length || 0} / {maxLen} characters
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )}
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
                onChange={(e) => {
                  setCustomFileName(e.target.value);
                }}
              />
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setShowConfirmDialog(false);
                setAudioIsUploaded(true);
              }}
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
                setAudioIsUploaded(false);
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
