'use client';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  Plus,
  CloudUpload,
  X,
  LoaderCircle,
  FileCheck,
  Minus,
} from 'lucide-react';
import {
  useActivitiesCategories,
  useActivitiesStore,
  useBeneficiariesGroups,
  useListAllTransports,
  usePhases,
  usePhasesStore,
  useSingleActivity,
  useStakeholdersGroups,
  useUpdateActivities,
  useUploadFile,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { toast } from 'react-toastify';
import { Back, Heading, NoResult } from 'apps/rahat-ui/src/common';
import { useUserList } from '@rumsan/react-query';
import { validateFile } from 'apps/rahat-ui/src/utils/file.validation';
import { DurationData } from '../add/add.activity.view';
import AddCommunicationForm from '../components/communication.form';
import CommunicationDataCard from '../components/communicationDataCard';
import {
  CommunicationData,
  GroupType,
} from 'apps/rahat-ui/src/types/communication';
import { useActivityForm } from '../hooks/useActivityForm';
import { buildCommunicationPayloads } from 'apps/rahat-ui/src/utils/buildCommunicationPayload';
import { transformCommunicationData } from 'apps/rahat-ui/src/utils/transformCommunicationData';
import Loader from 'apps/community-tool-ui/src/components/Loader';

// TODO: check pdf is not uploaded in the activity documents

// const activityDetail = {
//   id: 4,
//   uuid: '7b21ae50-41e2-4d68-8ba1-0b127f5d5af1',
//   app: 'fce687ec-c89e-4063-bf5f-9b965d7e22ac',
//   title: 'Release the fund AASAP',
//   leadTime: '2023-01-01',
//   phaseId: '5f428423-80a6-4d86-a282-e98d76b727ec',
//   categoryId: '01de4432-c4df-43c5-9266-597a4595c6e7',
//   managerId: 'adfasdfasdf',
//   description: 'This is for testing document description',
//   notes: null,
//   status: 'NOT_STARTED',
//   activityDocuments: [
//     {
//       fileName: '1743837385472-diagram-export-4-1-2025-2_50_01-PM.png',
//       mediaURL:
//         'https://rahat-rumsan.s3.us-east-1.amazonaws.com/aa/dev/QmToBxJLodxMYPMfi3wFPbbNzCtbah7Hqo79uegfTvLPY8',
//     },
//     {
//       fileName: '1743837409317-diagram-export-4-1-2025-2_51_13-PM.png',
//       mediaURL:
//         'https://rahat-rumsan.s3.us-east-1.amazonaws.com/aa/dev/QmaUXRkrrP7nJnQgTP1N2g3q5z3TEuzcYEyFSvdQGYwqQZ',
//     },
//   ],
//   activityPayout: [],
//   isAutomated: false,
//   isDeleted: false,
//   completedBy: 'ram',
//   completedAt: null,
//   differenceInTriggerAndActivityCompletion: null,
//   createdAt: '2025-04-05T07:18:03.703Z',
//   updatedAt: '2025-04-05T07:18:03.703Z',
//   category: {
//     id: 1,
//     uuid: '01de4432-c4df-43c5-9266-597a4595c6e7',
//     app: 'fce687ec-c89e-4063-bf5f-9b965d7e22ac',
//     name: 'Cleaning The Drains',
//     isDeleted: false,
//     createdAt: '2025-04-04T05:15:17.286Z',
//     updatedAt: '2025-04-04T05:15:17.286Z',
//   },
//   phase: {
//     id: 3,
//     uuid: '5f428423-80a6-4d86-a282-e98d76b727ec',
//     name: 'PREPAREDNESS',
//     activeYear: '2024',
//     requiredMandatoryTriggers: 0,
//     requiredOptionalTriggers: 0,
//     receivedMandatoryTriggers: 1,
//     receivedOptionalTriggers: 0,
//     canRevert: false,
//     canTriggerPayout: false,
//     isActive: false,
//     riverBasin: 'Karnali at Chisapani',
//     activatedAt: null,
//     createdAt: '2025-04-04T04:28:10.718Z',
//     updatedAt: '2025-04-04T07:34:20.739Z',
//     source: {
//       id: 1,
//       uuid: 'e4a1904b-fb8c-4452-b7a8-28278e179cb2',
//       source: ['DHM'],
//       riverBasin: 'Karnali at Chisapani',
//       createdAt: '2025-04-03T11:49:53.465Z',
//       updatedAt: '2025-04-03T11:49:53.465Z',
//     },
//   },
//   manager: {
//     id: 'adfasdfasdf',
//     name: 'test',
//     email: 'test@gmail.com',
//     phone: '9801234567',
//     createdAt: '2025-04-04T06:59:46.536Z',
//     updatedAt: '2025-04-04T06:59:46.536Z',
//   },
//   activityCommunication: [
//     {
//       groupId: '68e0d421-b358-4a3d-aef0-dbf84264602f',
//       message: 'This is a test email. ',
//       groupType: 'STAKEHOLDERS',
//       transportId: 'yp9gn0pahyy69hc0vjhi39h0',
//       communicationId: '757ac475-239c-4bb5-ab79-5e116a85475c',
//       groupName: 'informers',
//       transportName: 'SMS',
//       sessionStatus: 'PENDING',
//     },
//     {
//       groupId: 'e97998ed-8577-4a03-ab90-65ed9157ee1e',
//       message: {
//         fileName: 'file_example_MP3_700KB.mp3',
//         mediaURL:
//           'https://rahat-rumsan.s3.us-east-1.amazonaws.com/aa/dev/QmeJHC7HHv7aLYwyD7h2Ax36NGVn7dLHm7iwV5w2WR72XR',
//       },
//       groupType: 'STAKEHOLDERS',
//       transportId: 'i206fgnnpxzr4y4ts9qtrj0y',
//       communicationId: '0de299de-16df-4af8-8788-b716b07672ea',
//       transportName: 'IVR',
//       groupName: 'informers',
//       sessionStatus: 'FAILED',
//     },
//     {
//       groupId: '43835e86-dd8a-4f63-baaf-2838ac303d86',
//       message: {},
//       groupType: 'BENEFICIARY',
//       transportId: 'i206fgnnpxzr4y4ts9qtrj0y',
//       communicationId: 'ecf6c1fe-85eb-4a91-80ed-4cf275ae9b87',
//       transportName: 'IVR',
//       groupName: 'informers',
//       sessionStatus: 'COMPLETE',
//     },
//   ],
// };

export default function EditActivity() {
  const [open, setOpen] = useState(false);
  const [audioUploading, setAudioUploading] = useState<boolean>(false);
  const [communicationData, setCommunicationData] = useState<
    CommunicationData[]
  >([]);
  const [uploadingFileName, setUploadingFileName] = useState<string | null>(
    null,
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const backFrom = searchParams.get('backFrom');
  const uploadFile = useUploadFile();
  const updateActivity = useUpdateActivities();
  const { id: projectID, activityID } = useParams();
  const redirectTo = searchParams.get('from');

  const { data: users } = useUserList({
    page: 1,
    perPage: 9999,
  });

  useActivitiesCategories(projectID as UUID);

  usePhases(projectID as UUID);
  const {
    data: activityDetail,
    isLoading: isActivityLoading,
    error,
  } = useSingleActivity(projectID as UUID, activityID);

  const { categories } = useActivitiesStore((state) => ({
    categories: state.categories,
  }));

  const { phases } = usePhasesStore((state) => ({
    phases: state.phases,
  }));

  useStakeholdersGroups(projectID as UUID, {
    page: 1,
    perPage: 100,
  });
  useBeneficiariesGroups(projectID as UUID, {
    page: 1,
    perPage: 100,
  });
  const appTransports = useListAllTransports();

  const redirectUpdatePath = redirectTo
    ? `/projects/aa/${projectID}/activities/${activityID}`
    : `/projects/aa/${projectID}/activities/${activityID}${
        backFrom ? `?from=${backFrom}` : ''
      }`;

  const { FormSchema, form, communicationForm } = useActivityForm(
    phases,
    appTransports,
  );

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const filesArray = Array.from(files);

      for (const file of filesArray) {
        const currentFiles = form.getValues('activityDocuments') || [];
        const isDuplicateFile = currentFiles.some(
          (f) => f.fileName === file.name,
        );
        if (isDuplicateFile) {
          toast.error(`Cannot upload duplicate file: ${file.name}`);
          continue;
        }

        if (!validateFile(file)) {
          continue;
        }

        // Add temporary file entry immediately to show in UI
        const tempFile = {
          fileName: file.name,
          mediaURL: '', // Will be updated after upload completes
        };
        form.setValue('activityDocuments', [...currentFiles, tempFile]);
        setUploadingFileName(file.name);

        try {
          const formData = new FormData();
          formData.append('file', file);
          const { data: afterUpload } = await uploadFile.mutateAsync(formData);

          // Replace temporary file with actual uploaded file
          const updatedFiles = form.getValues('activityDocuments') || [];
          const fileIndex = updatedFiles.findIndex(
            (f) => f.fileName === file.name && f.mediaURL === '',
          );
          if (fileIndex !== -1) {
            updatedFiles[fileIndex] = afterUpload;
            form.setValue('activityDocuments', updatedFiles);
          } else {
            // Fallback: just add it if we can't find the temp entry
            form.setValue('activityDocuments', [...currentFiles, afterUpload]);
          }
        } catch (error) {
          // Remove temporary file entry on error
          const updatedFiles = form.getValues('activityDocuments') || [];
          const filteredFiles = updatedFiles.filter(
            (f) => !(f.fileName === file.name && f.mediaURL === ''),
          );
          form.setValue('activityDocuments', filteredFiles);
          toast.error(`Failed to upload ${file.name}`);
        } finally {
          setUploadingFileName(null);
        }
      }

      // Reset the input value to allow selecting the same files again
      event.target.value = '';
    }
  };

  const selectedPhaseId = form.watch('phaseId');
  const selectedPhase = phases.find((d) => d.uuid === selectedPhaseId);

  useEffect(() => {
    if (selectedPhase?.name === 'PREPAREDNESS') {
      form.setValue('isAutomated', false);
    }
  }, [selectedPhase, form]);

  const handleUpdateActivity = async (data: z.infer<typeof FormSchema>) => {
    let payload;

    if (communicationData?.length) {
      const activityCommunicationPayload = buildCommunicationPayloads(
        communicationData,
        appTransports,
      );

      payload = {
        uuid: activityID,
        ...data,
        activityCommunication: activityCommunicationPayload,
      };
    } else {
      payload = {
        uuid: activityID,
        ...data,
      };
    }
    try {
      await updateActivity.mutateAsync({
        projectUUID: projectID as UUID,
        activityUpdatePayload: payload,
      });
      router.push(redirectUpdatePath);
    } catch (e) {
      console.error('Error::', e);
    }
  };

  const handleSave = () => {
    const communicationFormData = communicationForm.getValues();
    const newCommunication: CommunicationData = {
      communicationTitle: communicationFormData?.communicationTitle || '',
      groupType: (communicationFormData?.groupType || '') as GroupType,
      groupId: communicationFormData?.groupId || '',
      transportId: communicationFormData?.transportId || '',
      message: communicationFormData?.message || '',
      subject: communicationFormData?.subject || '',
      audioURL: {
        mediaURL: communicationFormData?.audioURL?.mediaURL || '',
        fileName: communicationFormData?.audioURL?.fileName || '',
      },
      sessionId: communicationFormData?.sessionId || '',
      communicationId: communicationFormData?.communicationId || '',
    };
    setCommunicationData([...communicationData, newCommunication]);
  };

  const handleRemove = (index: number) => {
    const updatedCommunications = communicationData.filter(
      (_, i) => i !== index,
    );
    setCommunicationData(updatedCommunications);
  };

  const handleReset = () => {
    form.reset();
    communicationForm.reset();
    setOpen(false);

    if (
      activityDetail?.activityCommunication &&
      activityDetail?.activityCommunication?.length > 0
    ) {
      const transformedData = transformCommunicationData(
        activityDetail.activityCommunication,
        appTransports,
      );
      setCommunicationData(transformedData);
    }
  };

  // this will set default values when activity detail is loaded
  useEffect(() => {
    form.reset({
      title: activityDetail?.title,
      responsibility: activityDetail?.managerId,
      source: activityDetail?.phase?.source?.source[0],
      phaseId: activityDetail?.phaseId,
      categoryId: activityDetail?.categoryId,
      leadTime: activityDetail?.leadTime,
      description: activityDetail?.description,
      activityDocuments: activityDetail?.activityDocuments || [],
      isAutomated: activityDetail?.isAutomated,
    });

    if (
      activityDetail?.activityCommunication &&
      activityDetail?.activityCommunication?.length > 0
    ) {
      const transformedData = transformCommunicationData(
        activityDetail.activityCommunication,
        appTransports,
      );
      setCommunicationData(transformedData);
    }
  }, [activityDetail, form, appTransports]);

  // this code need to be removed after testing
  // const isVoiceAudioMissing = communicationData.some((comm) => {
  //   const transport = appTransports?.find((t) => t.cuid === comm.transportId);
  //   if (!transport) return false;

  //   // Assuming transport name or type indicates voice, e.g., 'IVR', 'Voice', or so.
  //   // Replace 'Voice' with your actual voice transport name or logic
  //   const isVoiceType =
  //     transport.name?.toLowerCase().includes('voice') ||
  //     transport.name?.toLowerCase().includes('ivr');

  //   if (isVoiceType) {
  //     // comm.audioURL can be string or object. Check if empty:
  //     if (!comm.audioURL) return true;
  //     if (typeof comm.audioURL === 'string' && comm.audioURL.trim() === '')
  //       return true;
  //     if (typeof comm.audioURL === 'object') {
  //       // Check mediaURL inside audioURL object
  //       if (!comm.audioURL.mediaURL || comm.audioURL.mediaURL.trim() === '')
  //         return true;
  //     }
  //   }
  //   return false;
  // });

  if (isActivityLoading) {
    return (
      <div className="p-4 h-full">
        <Back path={redirectUpdatePath} />
        <div className="flex justify-center items-center h-full">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 h-full">
        <Back path={redirectUpdatePath} />
        <div className="flex justify-center items-center h-full">
          <NoResult message="Error while loading activity details" />
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleUpdateActivity)}
        className="h-full"
      >
        <div className="p-4 h-full">
          <Back path={redirectUpdatePath} />
          <>
            <div className="mb-2 flex flex-col space-y-0">
              <div className="flex justify-between items-center">
                <div>
                  <Heading
                    title={`Edit Activity `}
                    description="Edit the form below to update  activity"
                  />
                </div>

                <div className="flex justify-end mt-8">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-36"
                      onClick={handleReset}
                    >
                      Reset
                    </Button>
                    <Button
                      className="  w-36"
                      type="submit"
                      disabled={
                        updateActivity?.isPending ||
                        uploadFile?.isPending ||
                        audioUploading ||
                        open
                      }
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <ScrollArea className=" h-[calc(100vh-230px)]">
              <div className="rounded-xl border p-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => {
                      return (
                        <FormItem className="col-span-2">
                          <FormLabel>Activity title</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter activity title"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="responsibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responsibility</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          key={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select responsibility" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {users?.data.map((item) => (
                              <SelectItem
                                key={item.uuid}
                                value={item.uuid as string}
                              >
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Responsible Station</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter responsible station"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="phaseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phase</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          key={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select phase" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {phases.map((item) => (
                              <SelectItem key={item.id} value={item.uuid}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          key={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((item) => (
                              <SelectItem key={item.id} value={item.uuid}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedPhase && selectedPhase?.name !== 'PREPAREDNESS' && (
                    <FormField
                      control={form.control}
                      name="isAutomated"
                      render={({ field }) => {
                        return (
                          <FormItem className="col-span-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={(checked) =>
                                  field.onChange(checked)
                                }
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal ml-2">
                              Is Automated Activity?
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  )}

                  {selectedPhaseId &&
                    selectedPhase?.name !== 'PREPAREDNESS' && (
                      <FormField
                        control={form.control}
                        name="leadTime"
                        render={({ field }) => {
                          const [lead, unitValue] = field.value?.split(' ') ?? [
                            '',
                            '',
                          ];
                          // Default unit to 'days' if not set
                          const unit = !unitValue ? 'days' : unitValue;
                          return (
                            <FormItem>
                              <FormLabel>Lead Time</FormLabel>
                              <div className="grid grid-cols-4">
                                <Input
                                  type="text"
                                  placeholder="Enter lead time"
                                  className="col-span-3 rounded-r-none "
                                  value={lead}
                                  onChange={(e) => {
                                    const newLead = e.target.value;
                                    field.onChange(
                                      newLead ? `${newLead} ${unit}` : '',
                                    );
                                  }}
                                />
                                <Select
                                  value={unit}
                                  onValueChange={(val) => {
                                    field.onChange(
                                      lead ? `${lead} ${val}` : ` ${val}`,
                                    );
                                  }}
                                >
                                  <FormControl>
                                    <SelectTrigger className="rounded-l-none">
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {DurationData.map((item) => (
                                      <SelectItem
                                        key={item.value}
                                        value={item.value}
                                      >
                                        {item.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    )}

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => {
                      return (
                        <FormItem className="col-span-2">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter description"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="activityDocuments"
                  render={({ field }) => {
                    const activityDocuments = field.value || [];
                    return (
                      <FormItem className="mt-4">
                        <FormControl>
                          <div className="relative border border-dashed rounded p-1.5">
                            <div className="absolute inset-0 flex gap-2 items-center justify-center">
                              <CloudUpload
                                size={25}
                                strokeWidth={2}
                                className="text-primary"
                              />
                              <p className="text-sm font-medium">
                                Drop files to upload, or{' '}
                                <span className="text-primary">browse</span>
                              </p>
                            </div>
                            <Input
                              className="opacity-0 cursor-pointer"
                              type="file"
                              multiple
                              onChange={handleFileChange}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-end text-orange-500">
                          *Files must be JPEG, PNG, BMP, PDF, XLSX, DOC, DOCX or
                          CSV under 5 MB.
                        </p>
                        <div className="grid sm:grid-cols-2  lg:grid-cols-3 xl:grid-cols-5 gap-4 p-2">
                          {activityDocuments?.map((file) => (
                            <div
                              key={file.fileName}
                              className="bg-white shadow-sm rounded-xl p-4 border border-gray-200 flex items-center gap-3 hover:cursor-pointer hover:bg-gray-100"
                            >
                              {uploadFile.isPending &&
                              uploadingFileName === file.fileName ? (
                                <LoaderCircle className="text-green-600 animate-spin w-9 h-9" />
                              ) : (
                                <FileCheck className="w-9 h-9 text-green-600" />
                              )}
                              <p className="text-xs  flex  items-center gap-2">
                                {file.fileName}
                              </p>
                              <X
                                strokeWidth={2.5}
                                onClick={() => {
                                  const updated = activityDocuments.filter(
                                    (f) => f.fileName !== file.fileName,
                                  );
                                  field.onChange(updated);
                                }}
                                className="cursor-pointer text-red-500 w-8 h-8"
                              />
                            </div>
                          ))}
                        </div>
                      </FormItem>
                    );
                  }}
                />
              </div>

              <Button
                type="button"
                variant="outline"
                className="border-dashed border-primary text-primary text-md w-full mt-4"
                onClick={() => {
                  setOpen(!open);
                }}
              >
                Add Communication
                {!open ? (
                  <Plus className="ml-2" size={16} strokeWidth={3} />
                ) : (
                  <Minus className="ml-2" size={16} strokeWidth={3} />
                )}
              </Button>

              {open && (
                <AddCommunicationForm
                  form={communicationForm}
                  setOpen={setOpen}
                  onSave={handleSave}
                  setLoading={setAudioUploading}
                  appTransports={appTransports}
                />
              )}

              <CommunicationDataCard
                form={communicationForm}
                communicationData={communicationData}
                appTransports={appTransports}
                onRemove={handleRemove}
                setOpen={setOpen}
                open={open}
              />
            </ScrollArea>
          </>
        </div>
      </form>
    </Form>
  );
}
