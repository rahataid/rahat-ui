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
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { X, CloudUpload, Check, LoaderCircle } from 'lucide-react';
import { useUploadFile, useActivateTrigger } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { validateFile } from '../../file.validation';

export default function ManualTriggerDialog() {
  const { id: projectID, triggerID } = useParams();
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
        projectUUID: projectID as UUID,
        activatePayload: { repeatKey: triggerID, ...data },
      });
      router.push(`/projects/aa/${projectID}/trigger-statements`);
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
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleTriggerSubmit)}>
            <DialogHeader>
              <DialogTitle>Trigger</DialogTitle>
            </DialogHeader>
            <div className="mt-4 grid gap-4">
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
                name="triggerDocuments"
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
                        XLSX, or CSV.
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
                  variant="secondary"
                  className="bg-red-100 text-red-600 w-full"
                  onClick={() => setShowModal(!showModal)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={uploadFile?.isPending || activateTrigger?.isPending}
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
