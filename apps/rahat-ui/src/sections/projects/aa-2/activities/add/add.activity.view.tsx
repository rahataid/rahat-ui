import { zodResolver } from '@hookform/resolvers/zod';
import {
  useActivitiesCategories,
  useActivitiesStore,
  useBeneficiariesGroups,
  useCreateActivities,
  useListAllTransports,
  usePhases,
  usePhasesStore,
  useStakeholdersGroups,
  useUploadFile,
} from '@rahat-ui/query';
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
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import {
  ValidationAddress,
  ValidationContent,
} from '@rumsan/connect/src/types';
import { useUserList } from '@rumsan/react-query';
import { Back, Heading } from 'apps/rahat-ui/src/common';
import { validateFile } from 'apps/rahat-ui/src/utils/file.validation';
import { UUID } from 'crypto';
import {
  CloudUpload,
  FileCheck,
  LoaderCircle,
  Minus,
  Plus,
  X,
} from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import AddCommunicationForm from './add.communication.form';

export default function AddActivities() {
  const createActivity = useCreateActivities();
  const uploadFile = useUploadFile();
  const { id: projectID } = useParams();
  const searchParams = useSearchParams();
  const phaseId = searchParams.get('phaseId');
  const navPae = searchParams.get('nav');
  // console.log(navPae);
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { data: users, isSuccess } = useUserList({
    page: 1,
    perPage: 9999,
  });
  useActivitiesCategories(projectID as UUID);
  usePhases(projectID as UUID);
  const [communicationData, setCommunicationData] = React.useState<
    {
      groupType: string;
      groupId: string;
      transportId: string;
      message?: string;
      subject?: string;
      audioURL?: { mediaURL?: string; fileName?: string };
    }[]
  >([]);

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
  const activitiesListPath =
    navPae === 'mainPage'
      ? `/projects/aa/${projectID}/activities`
      : `/projects/aa/${projectID}/activities/list/${phases
          .find((p) => p.uuid === phaseId)
          ?.name.toLowerCase()}`;
  useStakeholdersGroups(projectID as UUID, {
    page: 1,
    perPage: 100,
  });
  useBeneficiariesGroups(projectID as UUID, {
    page: 1,
    perPage: 100,
  });
  const appTransports = useListAllTransports();

  const FormSchema = z.object({
    title: z.string().min(2, { message: 'Title must be at least 4 character' }),
    responsibility: z
      .string()
      .min(2, { message: 'Please Select responsibility' }),
    source: z.string().min(2, { message: 'Please enter responsible station' }),
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
        groupType: z.string().optional(),
        groupId: z.string().optional(),
        transportId: z.string().optional(),
        message: z.string().optional(),
        subject: z.string().optional(),
        audioURL: z
          .object({
            mediaURL: z.string().optional(),
            fileName: z.string().optional(),
          })
          .optional(),
      }),
    ),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      responsibility: '',
      source: '',
      phaseId: phaseId || '',
      categoryId: '',
      leadTime: '',
      description: '',
      isAutomated: false,
      activityDocuments: [],
      activityCommunication: [],
    },
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

  // Handle to add the communication data to  stored in a local state
  const handleSave = () => {
    const activityCommunications = form.getValues(
      'activityCommunication',
    ) as any;

    // Create a new communication entry
    const newCommunication = {
      groupType: activityCommunications?.groupType || '',
      groupId: activityCommunications?.groupId || '',
      transportId: activityCommunications?.transportId || '',
      message: activityCommunications?.message || '',
      subject: activityCommunications?.subject || '',
      audioURL: {
        mediaURL: activityCommunications?.audioURL?.mediaURL || '',
        fileName: activityCommunications?.audioURL?.fileName || '',
      },
    };
    // Append new communication to the array
    const updatedCommunications = [...communicationData, newCommunication];

    // Update form state
    setCommunicationData(updatedCommunications);
  };
  // Handle to remove the communication data from the array stored in a local state
  const handleRemove = (index: number) => {
    const updatedCommunications = communicationData.filter(
      (_, i) => i !== index,
    );
    setCommunicationData(updatedCommunications);
  };
  const handleCreateActivities = async (data: z.infer<typeof FormSchema>) => {
    console.log('objectadd');
    const manager =
      users?.data?.find((u) => u?.uuid === data.responsibility) || null;
    const { responsibility, activityCommunication, ...rest } = data;
    const payloadData = {
      manager: manager
        ? {
            id: manager.uuid?.toString(),
            name: manager.name,
            email: manager.email,
            phone: manager.phone ?? '',
          }
        : null,
      activityCommunication: communicationData,
      ...rest,
    };
    let payload;
    const activityCommunicationPayload = [];
    if (payloadData?.activityCommunication?.length) {
      for (const comms of payloadData.activityCommunication) {
        const selectedTransport = appTransports?.find(
          (t) => t.cuid === comms.transportId,
        );
        if (selectedTransport?.validationContent === ValidationContent.URL) {
          activityCommunicationPayload.push({
            groupType: comms.groupType,
            groupId: comms.groupId,
            transportId: comms.transportId,
            message: comms.audioURL,
          });
        } else if (
          selectedTransport?.validationAddress === ValidationAddress.EMAIL
        ) {
          activityCommunicationPayload.push({
            groupType: comms.groupType,
            groupId: comms.groupId,
            transportId: comms.transportId,
            subject: comms.subject,
            message: comms.message,
          });
        } else {
          activityCommunicationPayload.push({
            groupType: comms.groupType,
            groupId: comms.groupId,
            transportId: comms.transportId,
            message: comms.message,
          });
        }
      }
      payload = {
        ...payloadData,
        activityCommunication: activityCommunicationPayload,
      };
    } else {
      payload = payloadData;
    }
    try {
      console.log('checkPayloadcreateactivity', payload);
      await createActivity.mutateAsync({
        projectUUID: projectID as UUID,
        activityPayload: payload,
      });
      router.push(activitiesListPath);
    } catch (e) {
      console.error('Error::', e);
    } finally {
      form.reset();
      setAllFiles([]);
      setDocuments([]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateActivities)}>
        <div className="p-4">
          <div className=" mb-2 flex flex-col space-y-0">
            <Back path={activitiesListPath} />

            <div className="mt-4 flex justify-between items-center">
              <div>
                <Heading
                  title={`Add Activity `}
                  description="Fill the form below to create new activity"
                />
              </div>

              <div className="flex justify-end mt-8">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-36"
                    onClick={() => {
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="w-36"
                    type="submit"
                    disabled={
                      createActivity?.isPending ||
                      uploadFile?.isPending ||
                      audioUploading
                    }
                  >
                    Add
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
                        defaultValue={field.value}
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
                        disabled={phaseId ? true : false}
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
                        <FormLabel>Lead Time (hours)</FormLabel>
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
                              <LoaderCircle
                                strokeWidth={2.5}
                                className="text-green-600 animate-spin w-8 h-8"
                              />
                            ) : (
                              <FileCheck
                                strokeWidth={2.5}
                                className="w-8 h-8 text-green-600"
                              />
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
                form={form}
                onSave={() => {
                  handleSave();
                }}
                onRemove={handleRemove}
                setLoading={setAudioUploading}
                appTransports={appTransports}
                communicationData={communicationData}
              />
            )}
          </ScrollArea>
        </div>
      </form>
    </Form>
  );
}
