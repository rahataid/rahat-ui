import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
  Check,
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
import EditCommunicationForm from './edit.communication.form';
import { ValidationContent } from '@rumsan/connect/src/types';
import { toast } from 'react-toastify';
import { Back, Heading } from 'apps/rahat-ui/src/common';
import { useUserList } from '@rumsan/react-query';
import { validateFile } from 'apps/rahat-ui/src/utils/file.validation';

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
  const router = useRouter();
  const uploadFile = useUploadFile();
  const updateActivity = useUpdateActivities();
  const { id: projectID, activityID } = useParams();
  const [open, setOpen] = React.useState(false);
  const { data: users, isSuccess } = useUserList({
    page: 1,
    perPage: 9999,
  });
  useActivitiesCategories(projectID as UUID);
  usePhases(projectID as UUID);
  const { data: activityDetail, isLoading } = useSingleActivity(
    projectID as UUID,
    activityID,
  );

  const { categories, hazardTypes } = useActivitiesStore((state) => ({
    categories: state.categories,

    hazardTypes: state.hazardTypes,
  }));

  const { phases } = usePhasesStore((state) => ({
    phases: state.phases,
  }));

  const [documents, setDocuments] = React.useState<
    { id: number; name: string }[]
  >([]);

  const [allFiles, setAllFiles] = React.useState<
    { mediaURL: string; fileName: string }[]
  >([]);

  const nextId = React.useRef(0);

  const [audioUploading, setAudioUploading] = React.useState<boolean>(false);

  useStakeholdersGroups(projectID as UUID, {});
  useBeneficiariesGroups(projectID as UUID, {});
  const appTransports = useListAllTransports();

  const activityDetailPath = `/projects/aa/${projectID}/activities/${activityID}`;
  const activitiesListPath = `/projects/aa/${projectID}/activities`;

  const newCommunicationSchema = {
    groupType: '',
    groupId: '',
    transportId: '',
    message: '',
    audioURL: { mediaURL: '', fileName: '' },
  };
  const FormSchema = z.object({
    title: z.string().min(2, { message: 'Title must be at least 4 character' }),
    responsibility: z
      .string()
      .min(2, { message: 'Please enter responsibility' }),
    source: z.string().min(2, { message: 'Please enter source' }),
    phaseId: z.string().min(1, { message: 'Please select phase' }),
    categoryId: z.string().min(1, { message: 'Please select category' }),
    leadTime: z.string().min(2, { message: 'Please enter lead time' }),
    description: z
      .string()
      .optional()
      .refine((val) => !val || val.length > 4, {
        message: 'Must be at least 5 characters',
      }),
    isAutomated: z.boolean().optional(),
    activityDocuments: z
      .array(
        z.object({
          mediaURL: z.string(),
          fileName: z.string(),
        }),
      )
      .optional(),
    activityCommunication: z.array(
      z.object({
        groupType: z.string().min(1, { message: 'Please select group type' }),
        groupId: z.string().min(1, { message: 'Please select group' }),
        transportId: z
          .string()
          .min(1, { message: 'Please select communication type' }),
        message: z.string().or(z.object({})).optional(),
        audioURL: z
          .string()
          .or(
            z.object({
              mediaURL: z.string().optional(),
              fileName: z.string().optional(),
            }),
          )
          .optional(),
        sessionId: z.string().optional(),
        communicationId: z.string().optional(),
      }),
    ),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: activityDetail?.title,
      responsibility: activityDetail?.manager?.id,
      source: activityDetail?.phase?.source?.source[0],
      phaseId: activityDetail?.phaseId,
      categoryId: activityDetail?.categoryId,
      leadTime: activityDetail?.leadTime,
      description: activityDetail?.description,
      activityDocuments: activityDetail?.activityDocuments,
      activityCommunication: activityDetail?.activityCommunication,
      isAutomated: activityDetail?.isAutomated,
    },
  });

  const {
    fields: activityCommunicationFields,
    append: activityCommunicationAppend,
    remove: activityCommunicationRemove,
  } = useFieldArray({
    control: form.control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'activityCommunication', // unique name for your Field Array
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const isDuplicateFile = documents?.some((d) => d?.name === file?.name);
      if (isDuplicateFile) {
        return toast.error('Cannot upload duplicate files.');
      }
      if (!validateFile(file)) {
        return;
      }

      const newFileName = `${Date.now()}-${file.name}`;
      const modifiedFile = new File([file], newFileName, { type: file.type });

      const newId = nextId.current++;
      setDocuments((prev) => [...prev, { id: newId, name: modifiedFile.name }]);
      const formData = new FormData();
      formData.append('file', modifiedFile);
      const { data: afterUpload } = await uploadFile.mutateAsync(formData);
      setAllFiles((prev) => [...prev, afterUpload]);
    }
  };

  const selectedPhaseId = form.watch('phaseId');
  const selectedPhase = phases.find((d) => d.uuid === selectedPhaseId);

  React.useEffect(() => {
    form.setValue('activityDocuments', allFiles);
  }, [allFiles, setAllFiles]);

  React.useEffect(() => {
    if (selectedPhase?.name === 'PREPAREDNESS') {
      form.setValue('isAutomated', false);
    }
  }, [selectedPhase]);

  React.useEffect(() => {
    if (activityDetail?.activityDocuments) {
      const files = activityDetail?.activityDocuments?.map((data: any) => data);
      const allDocs = activityDetail?.activityDocuments?.map(
        (data: any, index: number) => ({
          id: nextId.current++,
          name: data.fileName,
        }),
      );
      setAllFiles(files);
      setDocuments(allDocs);
    }
  }, [activityDetail]);

  const handleUpdateActivity = async (data: z.infer<typeof FormSchema>) => {
    // console.log(data);
    let payload;

    const activityCommunicationPayload = [];
    if (data?.activityCommunication?.length) {
      for (const comms of data.activityCommunication) {
        const selectedTransport = appTransports?.find(
          (t) => t.cuid === comms.transportId,
        );

        if (selectedTransport?.validationContent === ValidationContent.URL) {
          activityCommunicationPayload.push({
            groupType: comms.groupType,
            groupId: comms.groupId,
            transportId: comms.transportId,
            message: comms.audioURL,
            ...(comms.sessionId && { sessionId: comms.sessionId }),
            ...(comms.communicationId && {
              communicationId: comms.communicationId,
            }),
          });
          delete comms.audioURL;
        } else {
          activityCommunicationPayload.push({
            groupType: comms.groupType,
            groupId: comms.groupId,
            transportId: comms.transportId,
            message: comms.message,
            ...(comms.sessionId && { sessionId: comms.sessionId }),
            ...(comms.communicationId && {
              communicationId: comms.communicationId,
            }),
          });
        }
      }
      payload = {
        uuid: activityID,
        ...data,
        activityCommunication: activityCommunicationPayload,
      };
    } else {
      payload = { uuid: activityID, ...data };
    }
    try {
      await updateActivity.mutateAsync({
        projectUUID: projectID as UUID,
        activityUpdatePayload: payload,
      });
      router.push(activityDetailPath);
    } catch (e) {
      console.error('Error::', e);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleUpdateActivity)}>
        <div className="p-4">
          <div className=" mb-2 flex flex-col space-y-0">
            <Back path={`/projects/aa/${projectID}/activities/${activityID}`} />

            <div className="mt-4 flex justify-between items-center">
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
                    className="  w-36"
                    onClick={() => {
                      router.push(activitiesListPath);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="  w-36"
                    type="submit"
                    disabled={
                      updateActivity?.isPending ||
                      uploadFile?.isPending ||
                      audioUploading
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
                        // defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select responsibility" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users?.data.map((item) => (
                            <SelectItem
                              key={item.id}
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
                        defaultValue={field.value}
                        value={field.value}
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
                        defaultValue={field.value}
                        value={field.value}
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
                <FormField
                  control={form.control}
                  name="leadTime"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Lead Time</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter lead time"
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
                            onChange={handleFileChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-end text-orange-500">
                        *Files must be under 5 MB and of type JPEG, PNG, BMP,
                        PDF, XLSX, or CSV.
                      </p>
                      <div className="grid lg:grid-cols-5 gap-3">
                        {documents?.map((file) => (
                          <div
                            key={file.name}
                            className="flex justify-between border p-4 rounded-xl items-center space-x-2"
                          >
                            {uploadFile.isPending &&
                            documents?.[documents?.length - 1].name ===
                              file.name ? (
                              <LoaderCircle className="text-green-600 animate-spin w-9 h-9" />
                            ) : (
                              <FileCheck className="w-9 h-9 text-green-600" />
                            )}
                            <p className="text-sm  flex  items-center truncate w-28">
                              {file.name}
                            </p>
                            <X
                              strokeWidth={2.5}
                              onClick={() => {
                                const newDocuments = documents?.filter(
                                  (doc) => doc.name !== file.name,
                                );
                                setDocuments(newDocuments);
                                const newFiles = allFiles?.filter(
                                  (f) => f.fileName !== file.name,
                                );
                                setAllFiles(newFiles);
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

            {activityCommunicationFields.map((_, index) => (
              <EditCommunicationForm
                index={index}
                form={form}
                key={index}
                setLoading={setAudioUploading}
                appTransports={appTransports}
                onClose={() => {
                  activityCommunicationRemove(index);
                }}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              className="border-dashed border-primary text-primary text-md w-full mt-4"
              onClick={() =>
                activityCommunicationAppend(newCommunicationSchema)
              }
            >
              Add Communication
              <Plus className="ml-2" size={16} strokeWidth={3} />
            </Button>
          </ScrollArea>
        </div>
      </form>
    </Form>
  );
}
