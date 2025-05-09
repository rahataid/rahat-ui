import * as React from 'react';
import { useRouter } from 'next/navigation';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { X, CloudUpload, LoaderCircle, FileCheck } from 'lucide-react';
import { useUploadFile, useActivateTrigger } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { toast } from 'react-toastify';
import { validateFile } from 'apps/rahat-ui/src/utils/file.validation';

type IProps = {
  projectId: UUID;
  repeatKey: string;
};

export default function ActivateTriggerDialog({
  projectId,
  repeatKey,
}: IProps) {
  const router = useRouter();
  const uploadFile = useUploadFile();
  const activateTrigger = useActivateTrigger();
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [documents, setDocuments] = React.useState<
    { id: number; name: string }[]
  >([]);
  const nextId = React.useRef(0);
  const [allFiles, setAllFiles] = React.useState<
    { mediaURL: string; fileName: string }[]
  >([]);

  const FormSchema = z.object({
    notes: z
      .string()
      .optional()
      .refine((val) => !val || val?.length > 4, {
        message: 'Must be at least 5 characters',
      }),
    triggerDocuments: z
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
      notes: '',
      triggerDocuments: [],
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
    form.setValue('triggerDocuments', allFiles);
  }, [allFiles, setAllFiles]);

  const handleTriggerSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      await activateTrigger.mutateAsync({
        projectUUID: projectId,
        activatePayload: { repeatKey: repeatKey, ...data },
      });
      // router.push(`/projects/aa/${projectID}/trigger-statements`);
    } catch (e) {
      console.error('Activate Trigger Error::', e);
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
          type="button"
          className="px-8"
          onClick={() => setShowModal(true)}
        >
          Trigger
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleTriggerSubmit)}>
            <DialogHeader>
              <DialogTitle className="text-center">Confirm Trigger</DialogTitle>
              <DialogDescription className="text-center">
                Fill out the details below and press confirm to trigger
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 grid gap-4">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Trigger Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          className="rounded"
                          placeholder="Write trigger notes here"
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
                name="triggerDocuments"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <div className="relative border border-dashed border-primary rounded p-1.5">
                          <div className="absolute inset-0 flex gap-2 items-center justify-center">
                            <CloudUpload
                              strokeWidth={1.5}
                              className="text-primary"
                            />
                            <p className="text-sm font-medium text-primary">
                              Choose file to upload.
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
                      <p className="text-xs text-muted-foreground font-medium">
                        *Files must be JPEG, PNG, BMP, PDF, XLSX, or CSV under 5
                        MB.
                      </p>
                      {documents?.map((file) => (
                        <div
                          key={file.name}
                          className="p-2 flex justify-between items-center border rounded-sm shadow"
                        >
                          <p className="text-sm flex gap-2 items-center">
                            {uploadFile.isPending &&
                            documents?.[documents?.length - 1].name ===
                              file.name ? (
                              <LoaderCircle
                                size={16}
                                className="text-green-600 animate-spin"
                              />
                            ) : (
                              <FileCheck size={16} className="text-green-600" />
                            )}
                            {file.name}
                          </p>
                          <div className="p-0.5 rounded-full text-muted-foreground hover:text-red-500 cursor-pointer">
                            <X
                              size={16}
                              strokeWidth={2.5}
                              onClick={() => {
                                const newDocuments = documents?.filter(
                                  (doc) => doc.name !== file.name,
                                );
                                setDocuments(newDocuments);
                                const newFiles = allFiles.filter(
                                  (f, index) => index !== file.id,
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
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowModal(!showModal)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={uploadFile?.isPending || activateTrigger?.isPending}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
