'use client';

import React, { useEffect, useMemo } from 'react';

import { Back, Heading } from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { CloudUpload, File, LoaderCircle, X } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  useSingleActivity,
  useUpdateActivityStatus,
  useUploadFile,
} from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { ACTIVITY_STATUS } from 'apps/rahat-ui/src/constants/aa.constants';
import { validateFile } from 'apps/rahat-ui/src/utils/file.validation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
const { NOT_STARTED, WORK_IN_PROGRESS, COMPLETED, DELAYED } = ACTIVITY_STATUS;
const statusList = [NOT_STARTED, WORK_IN_PROGRESS, COMPLETED, DELAYED];

export default function UpdateStatus() {
  const params = useParams();
  const projectId = params.id as UUID;
  const activityId = params.activityID as UUID;
  const { data: activityDetail, isLoading = false } = useSingleActivity(
    projectId,
    activityId,
  );

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from');
  const router = useRouter();

  const activitiesListPath = useMemo(() => {
    if (!redirectTo) {
      return `/projects/aa/${projectId}/activities`;
    }

    return redirectTo === 'detailPage'
      ? `/projects/aa/${projectId}/activities/${activityId}`
      : `/projects/aa/${projectId}/activities/list/${redirectTo}`;
  }, [redirectTo, projectId, activityId]);

  const uploadFile = useUploadFile();

  const updateStatus = useUpdateActivityStatus();

  const [documents, setDocuments] = React.useState<
    { id: number; name: string }[]
  >([]);
  const [allFiles, setAllFiles] = React.useState<
    { mediaURL: string; fileName: string }[]
  >([]);
  const nextId = React.useRef(0);

  const FormSchema = z.object({
    status: z.string().min(1, { message: 'Please select status' }),
    notes: z.string().optional(),
    activityDocuments: z
      .array(
        z.object({
          mediaURL: z.string(),
          fileName: z.string(),
        }),
      )
      .optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      status: '',
      notes: '',
      activityDocuments: [],
    },
  });

  // useEffect(() => {
  //   if (activityDetail) {
  //     form.reset({
  //       status: activityDetail.status || '',
  //       notes: activityDetail.notes ?? '',
  //       activityDocuments: activityDetail.activityDocuments || [],
  //     });
  //   }
  // }, [activityDetail, form]);

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

      const newId = nextId.current++;
      setDocuments((prev) => [...prev, { id: newId, name: file.name }]);
      const formData = new FormData();
      formData.append('file', file);
      const { data: afterUpload } = await uploadFile.mutateAsync(formData);
      setAllFiles((prev) => [...prev, afterUpload]);
    }
  };

  React.useEffect(() => {
    form.setValue('activityDocuments', allFiles);
  }, [allFiles, setAllFiles]);

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
  const handleUpdateStatus = async (data: z.infer<typeof FormSchema>) => {
    const payload = {
      uuid: activityId || activityDetail?.id,
      ...data,
    };
    try {
      await updateStatus.mutateAsync({
        projectUUID: projectId,
        activityStatusPayload: payload,
      });
      router.push(activitiesListPath);
    } catch (e) {
      console.error('Update Status Error::', e);
    } finally {
      form.reset();
      setAllFiles([]);
      setDocuments([]);
    }
  };
  const formatStatus = (status: string) => {
    return status
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  React.useEffect(() => {
    if (activityDetail) {
      form.setValue('status', activityDetail?.status);
      form.setValue('notes', activityDetail?.notes ?? ' ');
      form.setValue(
        'activityDocuments',
        activityDetail.activityDocuments ?? [],
      );
      // form.trigger('status');
    }
  }, [activityDetail, form]);

  // console.log(activityDetail);
  return (
    <div className=" mx-auto p-4 md:p-6">
      <div className="flex flex-col space-y-0">
        <Back path={activitiesListPath} />

        <div className="mt-4 flex justify-between items-center">
          <Heading
            title={`Update Status`}
            description="Change the status of this activity"
          />
        </div>
      </div>

      <div className="space-y-6 border rounded-sm p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdateStatus)}>
            <div className="mt-4 flex flex-col gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-muted-foreground">
                      Status:
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusList.map((status) => (
                          <SelectItem value={status} key={status}>
                            {formatStatus(status)}
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
                name="notes"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">
                        Add note
                      </FormLabel>
                      <FormControl>
                        <Textarea placeholder="Write note" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="activityDocuments"
                render={({ field }) => {
                  return (
                    <FormItem>
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
                              <span className="text-primary cursor-pointer">
                                browse
                              </span>
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
                      <p className="text-xs text-orange-500 text-end">
                        *Files must be JPEG, PNG, BMP, PDF, XLSX, DOC, DOCX or
                        CSV under 5 MB.
                      </p>

                      <div className="grid grid-cols-5 gap-4 p-2">
                        {documents.map((doc, index) => (
                          <div
                            className="bg-white shadow-sm rounded-xl p-4 border border-gray-200 flex items-center gap-3 hover:cursor-pointer hover:bg-gray-100"
                            key={index}
                          >
                            {uploadFile.isPending &&
                            documents?.[documents?.length - 1].name ===
                              doc.name ? (
                              <LoaderCircle
                                size={16}
                                strokeWidth={2.5}
                                className="text-green-600 animate-spin"
                              />
                            ) : (
                              <div className="bg-gray-100 p-2 rounded-sm">
                                <File />
                              </div>
                            )}
                            <p className="text-xs flex gap-2 items-center">
                              {doc.name}
                            </p>
                            <div>
                              <div className="p-0.5 rounded-full border-2 hover:border-red-500 text-muted-foreground  hover:text-red-500 cursor-pointer">
                                <X
                                  size={16}
                                  strokeWidth={2.5}
                                  onClick={() => {
                                    const newDocuments = documents?.filter(
                                      (file) => file.name !== doc.name,
                                    );
                                    setDocuments(newDocuments);
                                    const newFiles = allFiles?.filter(
                                      (f) => f.fileName !== doc.name,
                                    );
                                    setAllFiles(newFiles);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </FormItem>
                  );
                }}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-red-100 text-red-600  w-48 rounded-sm"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="w-48 rounded-sm"
                  disabled={
                    uploadFile?.isPending ||
                    updateStatus?.isPending ||
                    !activityDetail
                  }
                >
                  Update
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
