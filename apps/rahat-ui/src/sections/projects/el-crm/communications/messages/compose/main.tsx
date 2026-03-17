'use client';

import { useState } from 'react';
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
import { Textarea } from '@rahat-ui/shadcn/components/textarea';
import { Input } from '@rahat-ui/shadcn/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

import { Send, Plus, ArrowLeft, Info, PenLine } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import {
  useCreateElCrmCampaign,
  useListElCrmTemplate,
  useListElCrmTransport,
} from '@rahat-ui/query';
import { CHANNELS } from '../../const';

export default function ComposeMessageView() {
  const { id: projectUUID } = useParams() as { id: UUID };
  const router = useRouter();
  const [selectedChannelName, setSelectedChannelName] = useState<string | null>(
    null,
  );
  const [templateMode, setTemplateMode] = useState<'existing' | 'new'>(
    'existing',
  );

  // Validation schema
  const composeMessageSchema = z
    .object({
      name: z.string().min(1, 'Name is required'),
      targetType: z.string().min(1, 'Please select a group'),
      statusFilter: z.string().optional(),
      messagingChannel: z.string().min(1, 'Please select a messaging channel'),
      scheduleDate: z.date().optional(),
      selectedTemplate: z.string().optional(),
      customMessage: z.string().optional(),
      newTemplateName: z.string().optional(),
      newTemplateContent: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (selectedChannelName === CHANNELS.WHATSAPP && !data.selectedTemplate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['selectedTemplate'],
          message: 'Please select a template for Whatsapp messaging channel',
        });
      }
    });

  type ComposeMessageForm = z.infer<typeof composeMessageSchema>;

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ComposeMessageForm>({
    resolver: zodResolver(composeMessageSchema),
    defaultValues: {
      targetType: '',
      statusFilter: '',
      messagingChannel: '',
      selectedTemplate: '',
      customMessage: '',
    },
  });

  const groupSelection = watch('targetType');
  const messagingChannel = watch('messagingChannel');

  const transport = useListElCrmTransport(projectUUID);
  const templates = useListElCrmTemplate(projectUUID, {
    status: 'APPROVED',
  });
  const createCampaign = useCreateElCrmCampaign(projectUUID);

  console.log('Templates:', templates.data);
  const onSubmit = async (data: ComposeMessageForm) => {
    console.log('Submitting form with:', data);
    // Handle form submission here
    const payload = {
      targetType: data.targetType,
      name: data.name,
      options: data.statusFilter
        ? { vendorStatus: data.statusFilter.toUpperCase() }
        : undefined,
      transportId: data.messagingChannel,
      message: data.selectedTemplate,
    };
    await createCampaign.mutateAsync(payload);
    reset();
    router.push(`/projects/el-crm/${projectUUID}/communications/messages`);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/projects/el-crm/${projectUUID}/communications/messages`}
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Back to Messages</TooltipContent>
            </Tooltip>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Compose Message
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Create and send a new message to your audience
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <PenLine className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Compose Message
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Name
                      </Label>
                      <Input
                        id="name"
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
                    {/* Group Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="group-selection" className="text-sm font-medium">
                        Select Group
                      </Label>
                      <Controller
                        name="targetType"
                        control={control}
                        render={({ field }) => (
                          <>
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                                if (value === 'consumers') {
                                  setValue('statusFilter', '');
                                }
                              }}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select group type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="VENDOR">Customers</SelectItem>
                                <SelectItem value="BENEFICIARY">
                                  Consumers
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.targetType && (
                              <p className="text-sm text-destructive">
                                {errors.targetType.message}
                              </p>
                            )}
                          </>
                        )}
                      />
                    </div>

                    {/* Condition Filter - only shows when Customer is selected */}
                    {groupSelection === 'VENDOR' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <Label htmlFor="condition-filter" className="text-sm font-medium">
                            Condition Filter
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>Filter recipients by their current status</TooltipContent>
                          </Tooltip>
                        </div>
                        <Controller
                          name="statusFilter"
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="newly_inactive">
                                  Newly Inactive
                                </SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Messaging Channel */}
                    <div className="space-y-2">
                      <Label htmlFor="messaging-channel" className="text-sm font-medium">
                        Messaging Channel
                      </Label>
                      <Controller
                        name="messagingChannel"
                        control={control}
                        render={({ field }) => (
                          <>
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                                const selectedChannel = transport.data?.find(
                                  (channel: any) =>
                                    channel.cuid.toString() === value,
                                );
                                setSelectedChannelName(
                                  selectedChannel?.name || null,
                                );
                              }}
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
                            {errors.messagingChannel && (
                              <p className="text-sm text-destructive">
                                {errors.messagingChannel.message}
                              </p>
                            )}
                          </>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Message */}
                {selectedChannelName &&
                  selectedChannelName !== CHANNELS.WHATSAPP && (
                    <div className="space-y-2">
                      <Label htmlFor="custom-message" className="text-sm font-medium">
                        OR Write Custom Message
                      </Label>
                      <Textarea
                        id="custom-message"
                        placeholder="Type your custom message here..."
                        {...register('customMessage')}
                        rows={4}
                        className="resize-none"
                      />
                      {errors.customMessage && (
                        <p className="text-sm text-destructive">
                          {errors.customMessage.message}
                        </p>
                      )}
                    </div>
                  )}
                {selectedChannelName === CHANNELS.WHATSAPP && (
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Template Option</Label>

                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          checked={templateMode === 'existing'}
                          onChange={() => setTemplateMode('existing')}
                          className="accent-primary"
                        />
                        Use Existing Template
                      </label>

                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          checked={templateMode === 'new'}
                          onChange={() => setTemplateMode('new')}
                          className="accent-primary"
                        />
                        Create New Template
                      </label>
                    </div>

                    {/* EXISTING TEMPLATE */}
                    {templateMode === 'existing' && (
                      <>
                        <Controller
                          name="selectedTemplate"
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Choose existing template" />
                              </SelectTrigger>
                              <SelectContent>
                                {templates?.data?.map((template: any) => (
                                  <SelectItem
                                    key={template.cuid}
                                    value={template.externalId}
                                  >
                                    {template.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.selectedTemplate && (
                          <p className="text-sm text-destructive">
                            {errors.selectedTemplate.message}
                          </p>
                        )}
                      </>
                    )}

                    {/* CREATE NEW TEMPLATE */}
                    {templateMode === 'new' && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          router.push(
                            `/projects/el-crm/${projectUUID}/communications/templates/create`,
                          )
                        }
                        className="w-full"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Go To Create Template Page
                      </Button>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2 border-t">
                  <Link
                    href={`/projects/el-crm/${projectUUID}/communications/messages`}
                  >
                    <Button type="button" variant="outline" size="sm">
                      Cancel
                    </Button>
                  </Link>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button type="submit" size="sm" className="min-w-[130px]">
                        <Send className="mr-2 h-4 w-4" />
                        Create Message
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Submit and create the message</TooltipContent>
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
