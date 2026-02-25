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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/components/popover';
import { Calendar } from '@rahat-ui/shadcn/components/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Send, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import {
  useCreateElCrmCampaign,
  useListElCrmTemplate,
  useListElCrmTransport,
} from '@rahat-ui/query';
import { options } from 'numeral';
import { stat } from 'fs';
import { CHANNELS } from '../../const';

// Validation schema
const composeMessageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  targetType: z.string().min(1, 'Please select a group'),
  statusFilter: z.string().optional(),
  messagingChannel: z.string().min(1, 'Please select a messaging channel'),
  scheduleDate: z.date().optional(),
  selectedTemplate: z.string().optional(),
  customMessage: z.string().optional(),
  newTemplateName: z.string().optional(),
  newTemplateContent: z.string().optional(),
});

type ComposeMessageForm = z.infer<typeof composeMessageSchema>;

export default function ComposeMessageView() {
  const { id: projectUUID } = useParams() as { id: UUID };
  const router = useRouter();
  const [selectedChannelName, setSelectedChannelName] = useState<string | null>(
    null,
  );
  const [templateMode, setTemplateMode] = useState<'existing' | 'new'>(
    'existing',
  );

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
  const templates = useListElCrmTemplate(projectUUID);
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
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card/50 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href={`/projects/el-crm/${projectUUID}/communications`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {/* Back to Communications */}
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Compose Message
            </h1>
            <p className="text-muted-foreground">
              Create and send a new message to your audience
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Compose Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name"> Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Welcome Message"
                      {...register('name')}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  {/* Group Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="group-selection">Select Group</Label>
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
                            <SelectTrigger>
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
                            <p className="text-sm text-red-500">
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
                      <Label htmlFor="condition-filter">Condition Filter</Label>
                      <Controller
                        name="statusFilter"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="newly-inactive">
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
                    <Label htmlFor="messaging-channel">Messaging Channel</Label>
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
                          {errors.messagingChannel && (
                            <p className="text-sm text-red-500">
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
              {selectedChannelName !== CHANNELS.WHATSAPP && (
                <div className="space-y-2">
                  <Label htmlFor="custom-message">
                    OR Write Custom Message
                  </Label>
                  <Textarea
                    id="custom-message"
                    placeholder="Type your custom message here..."
                    {...register('customMessage')}
                    rows={4}
                  />
                  {errors.customMessage && (
                    <p className="text-sm text-red-500">
                      {errors.customMessage.message}
                    </p>
                  )}
                </div>
              )}
              {selectedChannelName === CHANNELS.WHATSAPP && (
                <div className="space-y-4">
                  <Label>Template Option</Label>

                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={templateMode === 'existing'}
                        onChange={() => setTemplateMode('existing')}
                      />
                      Use Existing Template
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={templateMode === 'new'}
                        onChange={() => setTemplateMode('new')}
                      />
                      Create New Template
                    </label>
                  </div>

                  {/* EXISTING TEMPLATE */}
                  {templateMode === 'existing' && (
                    <Controller
                      name="selectedTemplate"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
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

              {/* Send Button */}
              <div className="flex justify-end gap-3">
                <Link href="/communication">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="min-w-[120px]">
                  <Send className="mr-2 h-4 w-4" />
                  Create Message
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
