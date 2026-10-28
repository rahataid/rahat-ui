'use client';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { toAsciiDigits } from 'apps/rahat-ui/src/utils/i18n/numeral';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@rahat-ui/shadcn/src/components/ui/select';
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
import {
  Back,
  FormInput,
  FormTextarea,
  Heading,
  NoResult,
} from 'apps/rahat-ui/src/common';
import DropdownSearch from 'apps/rahat-ui/src/common/search.dropdown';
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
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import { GroupPurpose } from 'apps/rahat-ui/src/constants/beneficiary.const';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';

export default function EditActivity() {
  const t = useTranslations('AA_PROJECT');
  const formatDigits = useLabelDigits();
  // State goes here
  const [open, setOpen] = useState(false);
  const [audioUploading, setAudioUploading] = useState<boolean>(false);
  const [communicationData, setCommunicationData] = useState<
    CommunicationData[]
  >([]);
  const [uploadingFileName, setUploadingFileName] = useState<string | null>(
    null,
  );
  const [editBackup, setEditBackup] = useState<{
    index: number;
    data: CommunicationData;
  } | null>(null);

  // Ref goes here
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Router goes here
  const router = useRouter();
  const searchParams = useSearchParams();
  const backFrom = searchParams.get('backFrom');

  // Hooks goes here
  const uploadFile = useUploadFile();
  const updateActivity = useUpdateActivities();
  const { id: projectID, activityID } = useParams();
  const redirectTo = searchParams.get('from');
  const editCommunicationForm = useBoolean();

  // Query goes here
  const { data: users } = useUserList({
    page: 1,
    perPage: 9999,
    roles: 'admin , manager',
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
    excludeGroupPurpose: GroupPurpose.GENERAL,
    page: 1,
    perPage: 100,
  });
  const appTransports = useListAllTransports();

  const redirectUpdatePath = redirectTo
    ? `/projects/aa/${projectID}/activities/${activityID}`
    : `/projects/aa/${projectID}/activities/${activityID}${
        backFrom ? `?from=${backFrom}` : ''
      }`;

  const { FormSchema, form, communicationForm, defaultCommunicationValues } =
    useActivityForm(appTransports);

  // Handlers goes here
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
          toast.error(t('CANNOT_UPLOAD_DUPLICATE_FILE', { name: file.name }));
          continue;
        }

        if (!validateFile(file, t)) {
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
          toast.error(t('FAILED_TO_UPLOAD', { name: file.name }));
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
        uuid: activityID,
        activityCommunication: activityCommunicationPayload,
        ...payloadData,
      };
    } else {
      payload = {
        uuid: activityID,
        ...payloadData,
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
      groupId: communicationFormData?.groupId || [],
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

    if (editBackup) {
      const updated = [...communicationData];
      updated.splice(editBackup.index, 0, newCommunication);
      setCommunicationData(updated);
      setEditBackup(null);
    } else {
      setCommunicationData([...communicationData, newCommunication]);
    }

    communicationForm.reset(defaultCommunicationValues);
  };

  const handleRemove = (index: number) => {
    const updatedCommunications = communicationData.filter(
      (_, i) => i !== index,
    );
    setCommunicationData(updatedCommunications);
  };

  const handleEdit = (index: number) => {
    setEditBackup({ index, data: communicationData[index] });
    handleRemove(index);
  };

  const handleCancelEdit = () => {
    if (editBackup) {
      const restored = [...communicationData];
      restored.splice(editBackup.index, 0, editBackup.data);
      setCommunicationData(restored);
      setEditBackup(null);
    }
  };

  const handleReset = () => {
    form.reset();
    communicationForm.reset(defaultCommunicationValues);
    setOpen(false);
    editCommunicationForm.onFalse();
    setEditBackup(null);

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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isActivityLoading) return;

    const shouldOpen = open || editCommunicationForm.value;

    if (shouldOpen) {
      if (!scrollAreaRef.current) return;

      // Needed as scroll viewport is defined and scrollAreaRef is inside the viewport
      const viewport = scrollAreaRef.current.closest(
        '[data-radix-scroll-area-viewport]',
      );

      if (viewport) {
        viewport.scrollTo({
          top: scrollAreaRef.current.offsetTop,
          behavior: 'smooth',
        });
      }
    }
  }, [isActivityLoading, open, editCommunicationForm.value]);

  // Handle #comm hash to auto-open communication form
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isActivityLoading) return;
    if (window.location.hash === '#comm') {
      setOpen(true);
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      );
    }
  }, [isActivityLoading]);

  // this will set default values when activity detail is loaded
  useEffect(() => {
    form.reset({
      title: activityDetail?.title,
      responsibility: activityDetail?.managerId,
      responsibleStation: activityDetail?.responsibleStation,
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

  const isSubmitButtonDisabled =
    updateActivity?.isPending ||
    uploadFile?.isPending ||
    audioUploading ||
    open ||
    editCommunicationForm.value ||
    !!form.formState.errors.responsibility;

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
          <NoResult message={t('ERROR_WHILE_LOADING_ACTIVITY_DETAILS')} />
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
                    title={t('EDIT_ACTIVITY')}
                    description={t('EDIT_THE_FORM_BELOW_TO_UPDATE2')}
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
                      {t('RESET')}
                    </Button>
                    <Button
                      className="  w-36"
                      type="submit"
                      disabled={isSubmitButtonDisabled}
                    >
                      {t('UPDATE_ACTIVITY')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <ScrollArea className=" h-[calc(100vh-200px)]">
              <div className="rounded-xl border p-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => {
                      return (
                        <FormItem className="col-span-2">
                          <FormLabel required>{t('ACTIVITY_TITLE2')}</FormLabel>
                          <FormControl>
                            <FormInput
                              type="text"
                              placeholder={t('ENTER_ACTIVITY_TITLE')}
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
                        <FormLabel required>{t('RESPONSIBILITY')}</FormLabel>
                        <DropdownSearch
                          selectedLabel={
                            users?.data?.find((u) => u.uuid === field.value)
                              ?.name
                          }
                          placeholder={t('SELECT_RESPONSIBILITY')}
                          searchPlaceholder={t('SEARCH_USERS')}
                          emptyMessage={t('NO_USER_FOUND')}
                          options={
                            users?.data?.map((u: any) => ({
                              label: u.name,
                              value: u.uuid,
                              data: u,
                            })) || []
                          }
                          onSelect={(selected) => {
                            field.onChange(selected.uuid);
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="responsibleStation"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel required>{t('RESPONSIBLE_STATION')}</FormLabel>
                          <FormControl>
                            <FormInput
                              type="text"
                              placeholder={t('ENTER_RESPONSIBLE_STATION')}
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
                        <FormLabel required>{t('PHASE')}</FormLabel>
                        <DropdownSearch
                          selectedLabel={
                            phases?.find((p) => p.uuid === field.value)?.name
                          }
                          placeholder={t('SELECT_PHASE')}
                          searchPlaceholder={t('SEARCH_PHASES')}
                          emptyMessage={t('NO_PHASE_FOUND')}
                          disabled
                          options={
                            phases?.map((p) => ({
                              label: p.name,
                              value: p.uuid,
                              data: p,
                            })) || []
                          }
                          onSelect={(selected) => {
                            field.onChange(selected.uuid);
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>{t('CATEGORY')}</FormLabel>
                        <DropdownSearch
                          selectedLabel={
                            categories?.find((c) => c.uuid === field.value)
                              ?.name
                          }
                          placeholder={t('SELECT_CATEGORY')}
                          searchPlaceholder={t('SEARCH_CATEGORIES')}
                          emptyMessage={t('NO_CATEGORY_FOUND')}
                          options={
                            categories?.map((c: any) => ({
                              label: c.name,
                              value: c.uuid,
                              data: c,
                            })) || []
                          }
                          onSelect={(selected) => {
                            field.onChange(selected.uuid);
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedPhase && selectedPhase.isAutomatedActivity && (
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
                              {t('IS_AUTOMATED_ACTIVITY')}?
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  )}

                  {selectedPhaseId && selectedPhase?.isRequiredLeadTime && (
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
                            <FormLabel>{t('LEAD_TIME')}</FormLabel>
                            <div className="grid grid-cols-4">
                              <FormInput
                                type="text"
                                placeholder={t('ENTER_LEAD_TIME')}
                                className="col-span-3 rounded-r-none "
                                value={formatDigits(lead)}
                                onChange={(e) => {
                                  const newLead = toAsciiDigits(
                                    e.target.value,
                                  );
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
                                      {item.value === 'hours'
                                        ? t('HOURS')
                                        : t('DAYS')}
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
                          <FormLabel>{t('DESCRIPTION')}</FormLabel>
                          <FormControl>
                            <FormTextarea
                              placeholder={t('ENTER_DESCRIPTION')}
                              className=" rounded"
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
                                {t('DROP_FILES_TO_UPLOAD')}, {t('OR')}{' '}
                                <span className="text-primary">{t('BROWSE')}</span>
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
                          {t('FILES_MUST_BE_JPEG_PNG_BMP')}
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
                {t('ADD_COMMUNICATION')}
                {!open ? (
                  <Plus className="ml-2" size={16} strokeWidth={3} />
                ) : (
                  <Minus className="ml-2" size={16} strokeWidth={3} />
                )}
              </Button>

              <div ref={scrollAreaRef}>
                {(open || editCommunicationForm.value) && (
                  <AddCommunicationForm
                    form={communicationForm}
                    setOpen={setOpen}
                    onSave={handleSave}
                    setLoading={setAudioUploading}
                    appTransports={appTransports}
                    isMultiSelect={open}
                    editMode={editCommunicationForm}
                    onCancelEdit={handleCancelEdit}
                  />
                )}
              </div>

              <CommunicationDataCard
                form={communicationForm}
                communicationData={communicationData}
                appTransports={appTransports}
                onRemove={handleRemove}
                onEdit={handleEdit}
                setOpen={editCommunicationForm.setValue}
                open={editCommunicationForm.value}
              />
            </ScrollArea>
          </>
        </div>
      </form>
    </Form>
  );
}
