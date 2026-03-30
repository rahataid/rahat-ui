'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/components/card';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Input } from '@rahat-ui/shadcn/components/input';
import { Textarea } from '@rahat-ui/shadcn/components/textarea';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  FileImage,
  FileText,
  FileVideo,
  MessageSquare,
  Save,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import {
  useListElCrmTransport,
  useCreateTemplate,
  useUploadFile,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@rahat-ui/shadcn/src/utils';

// Validation schema
const createTemplateSchema = z.object({
  name: z
    .string()
    .min(1, 'Template name is required')
    .max(100, 'Template name must be less than 100 characters'),
  transport: z.string().min(1, 'Please select a transport'),
  body: z
    .string()
    .min(1, 'Template content is required')
    .max(2000, 'Template content must be less than 2000 characters'),
  type: z.string().min(1, 'Please select a template type'),

  media: z.array(z.string().optional()).optional(),
});

type CreateTemplateForm = z.infer<typeof createTemplateSchema>;

type UploadStatus = 'uploading' | 'uploaded' | 'error';

type UploadedMediaItem = {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  previewUrl?: string;
  uploadedUrl?: string;
  status: UploadStatus;
  progress: number;
  error?: string;
};

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const CircularProgress = ({
  value,
  size = 42,
  strokeWidth = 4,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted/50"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-primary transition-all duration-200"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-foreground">
        {clampedValue}%
      </span>
    </div>
  );
};

export default function CreateTemplateView() {
  const {
    control,
    getValues,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateTemplateForm>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      name: '',
      transport: '',
      body: '',
      type: 'TEXT',
      media: [],
    },
  });
  const { id: projectUUID } = useParams() as { id: UUID };
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedMediaItem[]>([]);
  const uploadedFilesRef = useRef<UploadedMediaItem[]>([]);
  const transport = useListElCrmTransport(projectUUID);
  const createTemplate = useCreateTemplate(projectUUID);
  const uploadFile = useUploadFile();

  useEffect(() => {
    uploadedFilesRef.current = uploadedFiles;
  }, [uploadedFiles]);

  useEffect(() => {
    return () => {
      uploadedFilesRef.current.forEach((file) => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
    };
  }, []);

  const onSubmit = async (data: CreateTemplateForm) => {
    console.log('Saving template:', data);
    if ((data?.media ?? []).length > 0) {
      data.type = 'MEDIA';
    }
    await createTemplate.mutateAsync(data);
    uploadedFilesRef.current.forEach((file) => {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
    });
    setUploadedFiles([]);
    reset();
    router.push(`/projects/el-crm/${projectUUID}/communications/templates`);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const queue = files.map((file) => ({
      file,
      item: {
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()
          .toString(16)
          .slice(2)}`,
        name: file.name,
        size: file.size,
        mimeType: file.type,
        previewUrl: file.type.startsWith('image/')
          ? URL.createObjectURL(file)
          : undefined,
        status: 'uploading' as UploadStatus,
        progress: 0,
      },
    }));

    setUploadedFiles((prev) => [...prev, ...queue.map((entry) => entry.item)]);
    event.target.value = '';

    setIsUploading(true);
    for (const entry of queue) {
      try {
        const afterUpload = await uploadFile.mutateAsync({
          file: entry.file,
          query: {
            withFileName: true,
            rootFolderName: 'el-crm',
            folderName: projectUUID,
          },
          onProgress: (progress) => {
            setUploadedFiles((prev) =>
              prev.map((file) =>
                file.id === entry.item.id ? { ...file, progress } : file,
              ),
            );
          },
        });
        const mediaURL = afterUpload?.data?.mediaURL;

        if (!mediaURL) {
          setUploadedFiles((prev) =>
            prev.map((file) =>
              file.id === entry.item.id
                ? {
                    ...file,
                    status: 'error',
                    error: 'Upload succeeded but media URL was missing.',
                  }
                : file,
            ),
          );
          continue;
        }

        const currentMedia = getValues('media') || [];
        setValue('media', [...currentMedia, mediaURL]);
        setUploadedFiles((prev) => [
          ...prev.map((file) =>
            file.id === entry.item.id
              ? {
                  ...file,
                  uploadedUrl: mediaURL,
                  progress: 100,
                  status: 'uploaded' as UploadStatus,
                  error: undefined,
                }
              : file,
          ),
        ]);
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || 'Upload failed.';
        setUploadedFiles((prev) =>
          prev.map((file) =>
            file.id === entry.item.id
              ? { ...file, status: 'error', error: errorMessage }
              : file,
          ),
        );
      }
    }

    setIsUploading(false);
  };

  const handleRemoveMedia = (id: string) => {
    if (isUploading) return;
    const currentFile = uploadedFiles.find((file) => file.id === id);
    if (!currentFile) return;

    if (currentFile.previewUrl) {
      URL.revokeObjectURL(currentFile.previewUrl);
    }

    if (currentFile.uploadedUrl) {
      const currentMedia = getValues('media') || [];
      const updatedMedia = currentMedia.filter(
        (mediaUrl) => mediaUrl !== currentFile.uploadedUrl,
      );
      setValue('media', updatedMedia);
    }

    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  // Progressive wizard state
  const watchedTransport = watch('transport');
  const watchedName = watch('name');
  const watchedBody = watch('body');

  const selectedTransportName = useMemo(() => {
    if (!watchedTransport || !transport.data) return '';
    return (
      transport.data.find(
        (ch: any) => ch.cuid.toString() === watchedTransport,
      )?.name?.toUpperCase() ?? ''
    );
  }, [watchedTransport, transport.data]);

  const currentStep = useMemo(() => {
    if (!watchedTransport) return 1;
    if (!watchedName) return 2;
    if (!watchedBody) return 3;
    return 4;
  }, [watchedTransport, watchedName, watchedBody]);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-5">
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Back to templates</TooltipContent>
            </Tooltip>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Create Message Template
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Create and manage a new message template
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Create Template</CardTitle>
              <CardDescription>
                Follow the steps below to create your message template
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Step 1: Select Channel */}
                <StepCard
                  step={1}
                  title="Select Channel"
                  completed={!!watchedTransport}
                  active={currentStep === 1}
                  badge={selectedTransportName || undefined}
                >
                  <Controller
                    name="transport"
                    control={control}
                    render={({ field }) => (
                      <>
                        {transport.isLoading ? (
                          <p className="ml-10 text-sm text-muted-foreground">
                            Loading channels…
                          </p>
                        ) : (
                          <div className="grid grid-cols-3 gap-3 ml-10">
                            {transport.data?.map((ch: any) => (
                              <button
                                key={ch.cuid}
                                type="button"
                                onClick={() =>
                                  field.onChange(ch.cuid.toString())
                                }
                                className={cn(
                                  'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:border-primary/50',
                                  field.value === ch.cuid.toString()
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border',
                                )}
                              >
                                <MessageSquare className="h-6 w-6" />
                                <span className="text-sm font-medium">
                                  {ch.name.toUpperCase()}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                        {errors.transport && (
                          <p className="ml-10 text-sm text-destructive mt-2">
                            {errors.transport.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </StepCard>

                {/* Step 2: Template Name */}
                {watchedTransport && (
                  <StepCard
                    step={2}
                    title="Template Name"
                    completed={!!watchedName}
                    active={currentStep === 2}
                    badge={watchedName || undefined}
                  >
                    <div className="ml-10 space-y-3">
                      <Input
                        id="template-name"
                        placeholder="e.g., Welcome Message"
                        {...register('name')}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                  </StepCard>
                )}

                {/* Step 3: Template Content */}
                {watchedName && (
                  <StepCard
                    step={3}
                    title="Template Content"
                    completed={!!watchedBody}
                    active={currentStep === 3}
                    badge={watchedBody ? 'Content added' : undefined}
                  >
                    <div className="ml-10 space-y-3">
                      <Textarea
                        id="content"
                        placeholder="Enter your message template here... You can use {{variable}} for dynamic content"
                        {...register('body')}
                        rows={4}
                      />
                      {errors.body && (
                        <p className="text-sm text-destructive">
                          {errors.body.message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Tip: Use double curly braces {'{{variable}}'} for
                        dynamic content like names, dates, etc.
                      </p>
                    </div>
                  </StepCard>
                )}

                {/* Step 4: Media & Actions */}
                {watchedBody && (
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-medium">
                          4
                        </div>
                        <div>
                          <span className="font-medium">Media</span>
                          <p className="text-xs text-muted-foreground">
                            Optional: Attach media files to your template
                          </p>
                        </div>
                      </div>

                      <div className="ml-10 space-y-3">
                        <Input
                          id="file"
                          accept="image/*,video/*"
                          onChange={handleFileChange}
                          type="file"
                          multiple
                          disabled={isUploading}
                        />
                        {isUploading && (
                          <p className="text-xs text-muted-foreground">
                            Uploading files. You can remove them after upload
                            finishes.
                          </p>
                        )}

                        {uploadedFiles.length > 0 && (
                          <div className="space-y-2">
                            {uploadedFiles.map((file) => (
                              <div
                                key={file.id}
                                className="flex flex-col gap-3 rounded-md border px-3 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                              >
                                <div className="flex min-w-0 flex-1 items-center gap-3">
                                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-md border bg-muted">
                                    {file.mimeType.startsWith('image/') &&
                                    (file.previewUrl || file.uploadedUrl) ? (
                                      <img
                                        src={
                                          file.uploadedUrl || file.previewUrl
                                        }
                                        alt={file.name}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : file.mimeType.startsWith('video/') ? (
                                      <FileVideo className="h-6 w-6 text-muted-foreground" />
                                    ) : file.mimeType.startsWith('image/') ? (
                                      <FileImage className="h-6 w-6 text-muted-foreground" />
                                    ) : (
                                      <FileText className="h-6 w-6 text-muted-foreground" />
                                    )}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium text-foreground">
                                      {file.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {formatFileSize(file.size)}
                                    </p>
                                    {file.status === 'uploading' && (
                                      <p className="text-xs text-primary">
                                        Uploading... {file.progress}%
                                      </p>
                                    )}
                                    {file.status === 'uploaded' && (
                                      <p className="text-xs text-emerald-600">
                                        Upload complete
                                      </p>
                                    )}
                                    {file.status === 'error' && (
                                      <p className="text-xs text-red-500">
                                        {file.error || 'Upload failed'}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-auto">
                                  {file.status === 'uploading' && (
                                    <CircularProgress value={file.progress} />
                                  )}
                                  {file.status === 'uploaded' && (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                  )}
                                  {file.status === 'error' && (
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                  )}

                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    disabled={
                                      isUploading ||
                                      file.status === 'uploading'
                                    }
                                    onClick={() => handleRemoveMedia(file.id)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => router.back()}
                      >
                        Cancel
                      </Button>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            disabled={isUploading}
                            type="submit"
                            size="sm"
                            className="gap-2"
                          >
                            <Save className="h-3.5 w-3.5" />
                            Create Template
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Save the template</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                )}

                {/* Empty state */}
                {!watchedTransport && (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="rounded-full bg-muted p-4 inline-flex mb-3">
                      <MessageSquare className="h-8 w-8 opacity-50" />
                    </div>
                    <p>Start by selecting a messaging channel above</p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepCard({
  step,
  title,
  completed,
  active,
  badge,
  children,
}: {
  step: number;
  title: string;
  completed: boolean;
  active: boolean;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'rounded-lg border p-4 transition-all',
        active ? 'border-primary bg-primary/5' : 'border-border',
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium',
              completed
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground',
            )}
          >
            {completed ? <Check className="h-4 w-4" /> : step}
          </div>
          <span className="font-medium">{title}</span>
        </div>
        {badge && <Badge variant="secondary">{badge}</Badge>}
      </div>
      {children}
    </div>
  );
}
