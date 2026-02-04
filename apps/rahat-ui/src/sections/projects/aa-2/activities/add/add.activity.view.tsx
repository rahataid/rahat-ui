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
import React, { useMemo, useEffect, useState, ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import { z } from 'zod';
import AddCommunicationForm from '../components/communication.form';
import CommunicationDataCard from '../components/communicationDataCard';
import {
  CommunicationData,
  GroupType,
} from 'apps/rahat-ui/src/types/communication';
import { useActivityForm } from '../hooks/useActivityForm';
import { buildCommunicationPayloads } from 'apps/rahat-ui/src/utils/buildCommunicationPayload';

export const DurationData = [
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
];

export default function AddActivities() {
  const [open, setOpen] = useState(false);
  const [audioUploading, setAudioUploading] = useState<boolean>(false);
  const [communicationData, setCommunicationData] = useState<
    CommunicationData[]
  >([]);
  const [uploadingFileName, setUploadingFileName] = useState<string | null>(
    null,
  );

  const createActivity = useCreateActivities();
  const uploadFile = useUploadFile();
  const { id: projectID } = useParams();
  const searchParams = useSearchParams();
  const phaseId = searchParams.get('phaseId');
  const navPae = searchParams.get('nav');
  const router = useRouter();

  const { data: users } = useUserList({
    page: 1,
    perPage: 9999,
    sort: 'createdAt',
    roles: 'admin , manager',
  });
  useActivitiesCategories(projectID as UUID);
  usePhases(projectID as UUID);

  const { categories } = useActivitiesStore((state) => ({
    categories: state.categories,
  }));
  const { phases } = usePhasesStore((state) => ({
    phases: state.phases,
  }));

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
  const responsibility = form.watch('responsibility');
  const selectedPhase = useMemo(
    () => phases.find((d) => d.uuid === selectedPhaseId),
    [phases, selectedPhaseId],
  );

  useEffect(() => {
    if (selectedPhase?.name === 'PREPAREDNESS') {
      form.setValue('isAutomated', false);
    }
  }, [selectedPhase, form]);

  useEffect(() => {
    if (phaseId && phases.length > 0) {
      const phaseExists = phases.find((p) => p.uuid === phaseId);
      if (phaseExists) {
        form.setValue('phaseId', phaseId, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, [phaseId, phases, form]);

  // Handle to add the communication data to  stored in a local state
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
  // Handle to remove the communication data from the array stored in a local state
  const handleRemove = (index: number) => {
    const updatedCommunications = communicationData.filter(
      (_, i) => i !== index,
    );
    setCommunicationData(updatedCommunications);
  };

  const handleCreateActivities = async (data: z.infer<typeof FormSchema>) => {
    const manager =
      users?.data?.find((u) => u?.uuid === data.responsibility) || null;
    const { responsibility, ...rest } = data;
    const payloadData = {
      manager: manager
        ? {
            id: manager.uuid?.toString(),
            name: manager.name,
            email: manager.email,
            phone: manager.phone ?? '',
          }
        : null,
      ...rest,
    };
    let payload;

    if (communicationData?.length) {
      const activityCommunicationPayload = buildCommunicationPayloads(
        communicationData,
        appTransports,
      );

      payload = {
        ...payloadData,
        activityCommunication: activityCommunicationPayload,
      };
    } else {
      payload = payloadData;
    }
    try {
      await createActivity.mutateAsync({
        projectUUID: projectID as UUID,
        activityPayload: payload,
      });
      router.push(activitiesListPath);
    } catch (e) {
      console.error('Error::', e);
    } finally {
      form.reset();
      setCommunicationData([]);
    }
  };

  const resetForm = () => {
    form.reset();
    communicationForm.reset();
    setOpen(false);
    setCommunicationData([]);
  };

  useEffect(() => {
    if (!responsibility) return;

    const selectedUser = users?.data?.find((u) => u.uuid === responsibility);

    if (selectedUser && !selectedUser.email) {
      form.setError('responsibility', {
        type: 'manual',
        message: 'Selected user has no email',
      });
    } else {
      form.clearErrors('responsibility');
    }
  }, [responsibility, users, form]);

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
                    onClick={resetForm}
                  >
                    Clear
                  </Button>
                  <Button
                    className="w-36"
                    type="submit"
                    disabled={
                      createActivity?.isPending ||
                      uploadFile?.isPending ||
                      audioUploading ||
                      open ||
                      !!form.formState.errors.responsibility
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
                        defaultValue={phaseId || field.value}
                        value={phaseId || field.value}
                        disabled={!!phaseId}
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
                {selectedPhaseId && selectedPhase?.name !== 'PREPAREDNESS' && (
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
                              className="col-span-3 rounded-r-none"
                              value={lead}
                              onChange={(e) => {
                                const newLead = e.target.value;
                                field.onChange(
                                  newLead ? `${newLead} ${unit}` : ` ${unit}`,
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
        </div>
      </form>
    </Form>
  );
}
