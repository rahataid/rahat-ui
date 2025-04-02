import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/src/components/ui/radio-group';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { X, CloudUpload, Check, LoaderCircle, Pencil } from 'lucide-react';
import { useUploadFile, useUpdateActivityStatus } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { validateFile } from '../../file.validation';
import { ACTIVITY_STATUS } from '../../aa.constants';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { toast } from 'react-toastify';

type IProps = {
  activityDetail: any;
  loading: boolean;
  triggerTitle?: string;
  iconStyle: string;
};

const { NOT_STARTED, WORK_IN_PROGRESS, COMPLETED, DELAYED } = ACTIVITY_STATUS;
const statusList = [NOT_STARTED, WORK_IN_PROGRESS, COMPLETED, DELAYED];

export default function UpdateActivityStatusDialog({
  activityDetail,
  loading,
  triggerTitle = '',
  iconStyle,
}: IProps) {
  const router = useRouter();
  const params = useParams();

  const projectId = params.id as UUID;
  const activityId = params.activityID as UUID;

  const activitiesListPath = `/projects/aa/${projectId}/activities`;

  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [documents, setDocuments] = React.useState<
    { id: number; name: string }[]
  >([]);
  const [allFiles, setAllFiles] = React.useState<
    { mediaURL: string; fileName: string }[]
  >([]);

  const nextId = React.useRef(0);

  const uploadFile = useUploadFile();
  const updateStatus = useUpdateActivityStatus();

  const FormSchema = z.object({
    status: z.string().min(1, { message: 'Please select status' }),
    notes: z
      .string()
      .optional()
      .refine((val) => !val || val?.length > 4, {
        message: 'Must be at least 5 characters',
      }),
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
      status: activityDetail?.status || '',
      notes: activityDetail?.notes || '',
      activityDocuments: activityDetail?.activityDocuments || [],
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
    if (activityDetail?.activityDocuments && !loading) {
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
  }, [activityDetail, loading]);

  const handleDialogSubmit = async (data: z.infer<typeof FormSchema>) => {
    const payload = {
      uuid: activityId || activityDetail?.id,
      ...data,
    };
    try {
      await updateStatus.mutateAsync({
        projectUUID: projectId,
        activityStatusPayload: payload,
      });
    } catch (e) {
      console.error('Update Status Error::', e);
    } finally {
      form.reset();
      setAllFiles([]);
      setDocuments([]);
      setShowModal(false);
    }
  };

  return (
    <Dialog open={showModal} onOpenChange={() => setShowModal(!showModal)}>
      <DialogTrigger asChild>
        <Button
          variant={'link'}
          className="h-4 px-1"
          onClick={() => setShowModal(true)}
        >
          <Pencil className={iconStyle} /> {triggerTitle}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleDialogSubmit)}>
            <DialogHeader>
              <DialogTitle>Update Status</DialogTitle>
            </DialogHeader>
            <div className="mt-4 grid gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Status:</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={activityDetail?.status}
                        className="flex flex-col space-y-1"
                      >
                        {statusList.map((status) => (
                          <FormItem
                            className="flex items-center space-x-3 space-y-0"
                            key={status}
                          >
                            <FormControl>
                              <RadioGroupItem value={status} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {status}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
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
                      <FormLabel>Add note</FormLabel>
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
              <div className="flex justify-between gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-red-100 text-red-600 w-full"
                  onClick={() => setShowModal(!showModal)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={uploadFile?.isPending || updateStatus?.isPending}
                >
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
