import {
  useBeneficiariesGroupStore,
  useSingleBeneficiaryGroup,
  useSingleStakeholdersGroup,
  useStakeholdersGroupsStore,
  useUploadFile,
} from '@rahat-ui/query';
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { Transport, ValidationContent } from '@rumsan/connect/src/types';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { get } from 'react-hook-form';
import { AudioRecorder } from '../components/recorder';
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

type IProps = {
  form: any;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  appTransports: Transport[] | undefined;
  onSave: VoidFunction;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddCommunicationForm({
  form,
  setLoading,
  appTransports,
  onSave,
  setOpen,
}: IProps) {
  const { id: projectId } = useParams();
  const [audioFile, setAudioFile] = React.useState({
    fileName: '',
    mediaURL: '',
  });
  const [contentType, setContentType] = React.useState<ValidationContent | ''>(
    '',
  );
  const [address, setAddress] = React.useState(false);

  const [customFileName, setCustomFileName] = React.useState('');

  const [isRecording, setIsRecording] = React.useState(false);
  const [isFinished, setIsFinished] = React.useState(false);
  const [timer, setTimer] = React.useState(0);
  const [recordedFile, setRecordedFile] = React.useState<string | null>(null);
  const [chunks, setChunks] = React.useState<Blob[]>([]);
  const [isPaused, setIsPaused] = React.useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);

  const mediaRef = React.useRef<MediaRecorder | null>(null);
  const timerRef = React.useRef<any>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const animationRef = React.useRef<number | null>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  const audioCtxRef = React.useRef<AudioContext | null>(null);
  const isResettingRef = React.useRef(false);

  const pad = (num: number) => String(num).padStart(2, '0');
  const hh = pad(Math.floor(timer / 3600));
  const mm = pad(Math.floor((timer % 3600) / 60));
  const ss = pad(timer % 60);

  const [isPlaying, setIsPlaying] = React.useState(false);
  const fileUpload = useUploadFile();

  const stakeholdersGroups = useStakeholdersGroupsStore(
    (state) => state.stakeholdersGroups,
  );

  const beneficiaryGroups = useBeneficiariesGroupStore(
    (state) => state.beneficiariesGroups,
  );

  const activityCommunication = form.watch('activityCommunication') || {};

  const fieldName = (name: string) => `activityCommunication.${name}`; // Dynamic field name generator
  const selectedTransport = form.watch(fieldName('transportId'));
  const groupType = form.watch(fieldName('groupType'));
  const groupId = form.watch(fieldName('groupId'));

  const transportData = appTransports?.find(
    (t) => t.cuid === selectedTransport,
  );
  const isMessageRequired =
    transportData?.name === 'EMAIL' || transportData?.name === 'SMS';

  const isMessage =
    isMessageRequired &&
    (!activityCommunication.message ||
      activityCommunication.message.trim() === '');
  const isSaveDisabled =
    !activityCommunication.groupType ||
    !activityCommunication.groupId ||
    fileUpload.isPending ||
    !!get(form.formState.errors, fieldName('groupId')) ||
    !activityCommunication.transportId ||
    isMessage;

  const stakeholderId = groupType === 'STAKEHOLDERS' && groupId;
  const beneficiaryId = groupType === 'BENEFICIARY' && groupId;

  const { data: stakeholdersGroup, isLoading } = useSingleStakeholdersGroup(
    projectId as UUID,
    stakeholderId,
  );

  const { data: beneficiaryGroup, isLoading: isLoadingss } =
    useSingleBeneficiaryGroup(projectId as UUID, beneficiaryId);

  /* validate group email is to check if there are any missing  emails in beneficiaries group and stakeholders group before adding any  data 
   for the communication type email
  */
  const validateGroupEmails = ({
    group,
    type,
    extractEmail,
    form,
    fieldName,
  }: {
    group: any;
    type: 'stakeholders' | 'beneficiaries';
    extractEmail: (item: any) => string | undefined;
    form: any;
    fieldName: (key: string) => string;
  }) => {
    if (group && Array.isArray(group)) {
      const hasValidEmail = group.some((item) => {
        const email = extractEmail(item);
        return email?.trim() !== '';
      });

      if (!hasValidEmail) {
        form.setError(fieldName('groupId'), {
          type: 'manual',
          message: `Email address is missing for some ${
            type === 'stakeholders' ? 'stakeholders' : 'beneficiaries'
          } in this group.`,
        });
      } else {
        form.clearErrors(fieldName('groupId'));
      }
    }
  };

  React.useEffect(() => {
    if (!address) {
      // Clear any previous errors if transport doesn't require email
      form.clearErrors(fieldName('groupId'));
      return;
    }
    validateGroupEmails({
      group: stakeholdersGroup?.stakeholders,
      type: 'stakeholders',
      extractEmail: (s) => s?.email,
      form,
      fieldName,
    });

    validateGroupEmails({
      group: beneficiaryGroup?.groupedBeneficiaries,
      type: 'beneficiaries',
      extractEmail: (s) => s?.Beneficiary?.pii?.email,
      form,
      fieldName,
    });
  }, [address, stakeholdersGroup, beneficiaryGroup]);

  React.useEffect(() => {
    // const transportData = appTransports?.find(
    //   (t) => t.cuid === selectedTransport,
    // );
    setContentType(transportData?.validationContent as ValidationContent);
    if (transportData?.validationAddress === 'EMAIL') {
      setAddress(true);
      form.setValue(fieldName('audioURL'), '');
    } else {
      setAddress(false);
    }
  }, [selectedTransport]);
  const renderGroups = () => {
    const selectedGroupType = form.watch(fieldName('groupType'));
    let groups = <SelectLabel>Please select group type</SelectLabel>;
    switch (selectedGroupType) {
      case 'STAKEHOLDERS':
        groups = stakeholdersGroups.map((group: any) => (
          <SelectItem key={group.id} value={group.uuid}>
            {group.name}
          </SelectItem>
        ));
        break;
      case 'BENEFICIARY':
        groups = beneficiaryGroups.map((group: any) => (
          <SelectItem key={group.id} value={group.uuid}>
            {group.name}
          </SelectItem>
        ));
        break;
      default:
        break;
    }

    return groups;
  };

  const handleAudioFileChange = async (
    fileOrEvent: File | React.ChangeEvent<HTMLInputElement>,
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

    try {
      const { data: afterUpload } = await fileUpload.mutateAsync(formData);
      setAudioFile(afterUpload);
      // resetRecording(); // if this was from recording flow
    } catch (err) {
      console.error('File upload failed', err);
    }
  };

  React.useEffect(() => {
    form.setValue(fieldName('audioURL'), audioFile);
  }, [audioFile, setAudioFile]);

  React.useEffect(() => {
    setLoading(fileUpload.isPending);
  }, [fileUpload.isPending, !fileUpload.isPending]);

  const handleSave = () => {
    onSave(); // Call the save function

    form.setValue(fieldName('groupId'), '');
    form.setValue(fieldName('groupType'), '');
    form.setValue(fieldName('message'), '');
    form.setValue(fieldName('transportId'), '');
    form.setValue(fieldName('audioURL'), '');
    form.setValue(fieldName('subject'), '');
    form.clearErrors(fieldName('groupId'));
    setAudioFile({
      fileName: '',
      mediaURL: '',
    });
    fileUpload.reset();
    setOpen(false);
    // form.setValue('activityCommunication', {});
  };

  const clearCommunicationForm = () => {
    form.setValue(fieldName('groupId'), '');
    form.setValue(fieldName('groupType'), '');
    form.setValue(fieldName('message'), '');
    form.setValue(fieldName('transportId'), '');
    form.setValue(fieldName('audioURL'), '');
    setAudioFile({
      fileName: '',
      mediaURL: '',
    });
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
    }
  };

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
  React.useEffect(() => {
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
        form.setValue(fieldName('audioURL'), {});
        setAudioFile({ fileName: '', mediaURL: '' });
        setRecordedFile(null);
        fileUpload.reset();
      }
    }

    setAddress(transportData?.validationAddress === 'EMAIL');
  }, [selectedTransport]);

  const removeFile = () => {
    form.setValue(fieldName('audioURL'), {});
    setAudioFile({ fileName: '', mediaURL: '' });
    setRecordedFile(null);
    fileUpload.reset();
  };
  const isVoiceTransport =
    transportData?.name?.toLowerCase().includes('voice') ||
    transportData?.name?.toLowerCase().includes('ivr');

  const isVoiceAudioMissing =
    isVoiceTransport &&
    (!activityCommunication.audioURL ||
      (typeof activityCommunication.audioURL === 'string' &&
        activityCommunication.audioURL.trim() === '') ||
      (typeof activityCommunication.audioURL === 'object' &&
        !activityCommunication.audioURL.mediaURL));

  return (
    <div className="border border-dashed rounded p-4 my-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold">Add : Communication</h1>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={fieldName('groupType')}
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
              <Select value={field.value} onValueChange={field.onChange}>
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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select communication type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {appTransports?.map((transport) => {
                    return (
                      <>
                        <SelectItem value={transport?.cuid as string}>
                          {transport?.name}
                        </SelectItem>
                      </>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
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
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                <Trash2
                  onClick={() => removeFile()}
                  className="h-5 w-5s hover:cursor-pointer"
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
                    <Textarea
                      placeholder="Write message"
                      {...field}
                      maxLength={maxLen}
                    />
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
          disabled={isSaveDisabled || isVoiceAudioMissing}
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
