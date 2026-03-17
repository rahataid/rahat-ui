'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/components/card';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Label } from '@rahat-ui/shadcn/components/label';
import { Input } from '@rahat-ui/shadcn/components/input';
import { Textarea } from '@rahat-ui/shadcn/components/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileImage,
  FileText,
  FileVideo,
  Save,
} from 'lucide-react';
import Link from 'next/link';
import {
  useListElCrmTransport,
  useCreateTemplate,
  useUploadFile,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

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

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card/50 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Create Message Template
            </h1>
            <p className="text-muted-foreground">
              Create and manage a new message template
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Template Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Template Name */}
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
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
                </div>

                {/* Right Column */}
                {/* Messaging Channel */}
                <div className="space-y-2">
                  <Label htmlFor="messaging-channel">Messaging Channel</Label>
                  <Controller
                    name="transport"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select channel" />
                          </SelectTrigger>
                          <SelectContent>
                            {transport.data?.map((channel: any) => (
                              <SelectItem
                                key={channel.cuid}
                                value={channel.cuid.toString()}
                              >
                                {channel.name.toUpperCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.transport && (
                          <p className="text-sm text-destructive">
                            {errors.transport.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>

              {/* Template Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Template Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter your message template here... You can use {{variable}} for dynamic content"
                  {...register('body')}
                  rows={6}
                />
                {errors.body && (
                  <p className="text-sm text-destructive">{errors.body.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Tip: Use double curly braces {'{{variable}}'} for dynamic
                  content like names, dates, etc.
                </p>
              </div>
              <div className="space-y-3">
                <CardContent className="space-y-2 p-0">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="file">Media (optional)</Label>
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
                  </div>
                </CardContent>

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
                                src={file.uploadedUrl || file.previewUrl}
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
                              isUploading || file.status === 'uploading'
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

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <Link
                  href={`/projects/el-crm/${projectUUID}/communications/templates`}
                >
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button disabled={isUploading} type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
