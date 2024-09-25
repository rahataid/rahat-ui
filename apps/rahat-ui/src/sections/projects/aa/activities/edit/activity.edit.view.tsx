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
import { Plus, CloudUpload, Check, X, LoaderCircle } from 'lucide-react';
import {
  useActivitiesStore,
  useBeneficiariesGroups,
  useListAllTransports,
  useSingleActivity,
  useStakeholdersGroups,
  useUpdateActivities,
  useUploadFile,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import EditCommunicationForm from './edit.communication.form';
import { validateFile } from '../../file.validation';
import { ValidationContent } from '@rumsan/connect/src/types';
import { toast } from 'react-toastify';

export default function EditActivity() {
  const router = useRouter();
  const uploadFile = useUploadFile();
  const updateActivity = useUpdateActivities();
  const { id: projectID, activityID } = useParams();
  const { data: activityDetail, isLoading } = useSingleActivity(
    projectID as UUID,
    activityID,
  );

  const { categories, phases, hazardTypes } = useActivitiesStore((state) => ({
    categories: state.categories,
    phases: state.phases,
    hazardTypes: state.hazardTypes,
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
  const appTransports = useListAllTransports()


  const activityDetailPath = `/projects/aa/${projectID}/activities/${activityID}`;

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
            })
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
      responsibility: activityDetail?.responsibility,
      source: activityDetail?.source,
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
    if (activityDetail?.activityDocuments && !isLoading) {
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
  }, [activityDetail, isLoading]);

  const handleUpdateActivity = async (data: z.infer<typeof FormSchema>) => {
    let payload;
    const activityCommunicationPayload = [];
    if (data?.activityCommunication?.length) {
      for (const comms of data.activityCommunication) {
        const selectedTransport = appTransports?.find((t) => t.cuid === comms.transportId)
        if (selectedTransport?.validationContent === ValidationContent.URL) {
          activityCommunicationPayload.push({
            groupType: comms.groupType,
            groupId: comms.groupId,
            transportId: comms.transportId,
            message: comms.audioURL,
            ...(comms.sessionId && { sessionId: comms.sessionId }),
            ...(comms.communicationId && { communicationId: comms.communicationId })
          });
          delete comms.audioURL;
        } else {
          activityCommunicationPayload.push({
            groupType: comms.groupType,
            groupId: comms.groupId,
            transportId: comms.transportId,
            message: comms.message,
            ...(comms.sessionId && { sessionId: comms.sessionId }),
            ...(comms.communicationId && { communicationId: comms.communicationId })
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
        <div className="p-2 bg-secondary">
          <ScrollArea className="h-[calc(100vh-80px)]">
            <div className="p-4 rounded bg-card">
              <h1 className="text-lg font-semibold mb-6">Edit : Activities</h1>
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
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Responsibility</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter responsibility"
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
                  name="source"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Source</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter source"
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
                      <p className="text-xs text-orange-500">
                        *Files must be under 5 MB and of type JPEG, PNG, BMP,
                        PDF, XLSX, or CSV.
                      </p>
                      {documents?.map((file) => (
                        <div
                          key={file.name}
                          className="flex justify-between items-center"
                        >
                          <p className="text-sm flex gap-2 items-center">
                            {uploadFile.isPending &&
                              documents?.[documents?.length - 1].name ===
                              file.name ? (
                              <LoaderCircle
                                size={16}
                                strokeWidth={2.5}
                                className="text-green-600 animate-spin"
                              />
                            ) : (
                              <Check
                                size={16}
                                strokeWidth={2.5}
                                className="text-green-600"
                              />
                            )}
                            {file.name}
                          </p>
                          <div className="p-0.5 rounded-full border-2 hover:border-red-500 text-muted-foreground  hover:text-red-500 cursor-pointer">
                            <X
                              size={16}
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
                            />
                          </div>
                        </div>
                      ))}
                    </FormItem>
                  );
                }}
              />

              {activityCommunicationFields.map((_, index) => (
                <EditCommunicationForm
                  onClose={() => {
                    activityCommunicationRemove(index);
                  }}
                  form={form}
                  index={index}
                  appTransports={appTransports}
                  setLoading={setAudioUploading}
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
              <div className="flex justify-end mt-8">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="bg-red-100 text-red-600 w-36"
                    onClick={() => {
                      router.push(activityDetailPath);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      updateActivity?.isPending || uploadFile?.isPending || audioUploading
                    }
                  >
                    Update Activity
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </form>
    </Form>
  );
}
