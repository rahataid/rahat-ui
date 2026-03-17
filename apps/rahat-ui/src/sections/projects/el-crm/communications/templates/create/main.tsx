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
import { ArrowLeft, Save, Info, FileText } from 'lucide-react';
import Link from 'next/link';
import { useListElCrmTransport, useCreateTemplate } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

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
});

type CreateTemplateForm = z.infer<typeof createTemplateSchema>;

export default function CreateTemplateView() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTemplateForm>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      name: '',
      transport: '',
      body: '',
      type: 'TEXT',
    },
  });
  const { id: projectUUID } = useParams() as { id: UUID };
  const router = useRouter();

  const transport = useListElCrmTransport(projectUUID);
  const createTemplate = useCreateTemplate(projectUUID);
  const onSubmit = async (data: CreateTemplateForm) => {
    console.log('Saving template:', data);
    await createTemplate.mutateAsync(data);
    reset();
    router.push(`/projects/el-crm/${projectUUID}/communications/templates`);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Back to Templates</TooltipContent>
            </Tooltip>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Create Message Template
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Create and manage a new message template
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Template Management
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Template Name */}
                    <div className="space-y-2">
                      <Label htmlFor="template-name" className="text-sm font-medium">
                        Template Name
                      </Label>
                      <Input
                        id="template-name"
                        placeholder="e.g., Welcome Message"
                        className="h-9"
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
                    <Label htmlFor="messaging-channel" className="text-sm font-medium">
                      Messaging Channel
                    </Label>
                    <Controller
                      name="transport"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="h-9">
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
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="content" className="text-sm font-medium">
                      Template Content
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Use {'{{variable}}'} syntax for dynamic content
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Textarea
                    id="content"
                    placeholder="Enter your message template here... You can use {{variable}} for dynamic content"
                    {...register('body')}
                    rows={6}
                    className="resize-none"
                  />
                  {errors.body && (
                    <p className="text-sm text-destructive">{errors.body.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Tip: Use double curly braces {'{{variable}}'} for dynamic
                    content like names, dates, etc.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-2 border-t">
                  <Link
                    href={`/projects/el-crm/${projectUUID}/communications/templates`}
                  >
                    <Button type="button" variant="outline" size="sm">
                      Cancel
                    </Button>
                  </Link>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button type="submit" size="sm">
                        <Save className="mr-2 h-4 w-4" />
                        Create Template
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Save and create the template</TooltipContent>
                  </Tooltip>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
