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
import { Textarea } from '@rahat-ui/shadcn/components/textarea';
import { Input } from '@rahat-ui/shadcn/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import {
  useCreateElCrmCampaign,
  useListElCrmTemplate,
  useListElCrmTransport,
  useTriggerElCrmCampaign,
} from '@rahat-ui/query';
import { useState } from 'react';
import { CHANNELS } from '../../const';

// Validation schema
const scheduleMessageSchema = z.object({
  name: z.string().min(1, 'Message name is required'),
  targetType: z.string().min(1, 'Please select a group'),
  statusFilter: z.string().optional(),
  messagingChannel: z.string().min(1, 'Please select a messaging channel'),
  scheduleType: z.string().min(1, 'Please select a schedule type'),
  scheduleDateTime: z.string().optional(),
  automaticCondition: z.string().optional(),
  isRecurring: z.boolean().default(false),
  customMessage: z.string().optional(),
  selectedTemplate: z.string().optional(),
});

type ScheduleMessageForm = z.infer<typeof scheduleMessageSchema>;

export default function ComposeScheduleView() {
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
    reset,
    setValue,
  } = useForm<ScheduleMessageForm>({
    resolver: zodResolver(scheduleMessageSchema),
    defaultValues: {
      name: '',
      targetType: '',
      statusFilter: '',
      messagingChannel: '',
      scheduleType: 'manual',
      scheduleDateTime: '',
      automaticCondition: '',
      isRecurring: false,
      customMessage: '',
    },
  });

  const transport = useListElCrmTransport(projectUUID);
  const templates = useListElCrmTemplate(
    projectUUID,

    {
      status: 'APPROVED',
    },
  );
  const createCampaign = useCreateElCrmCampaign(projectUUID);
  const trigger = useTriggerElCrmCampaign(projectUUID);

  const groupSelection = watch('targetType');
  const scheduleType = watch('scheduleType');

  const onSubmit = async (data: ScheduleMessageForm) => {
    console.log('Scheduling message with:', data);
    // Handle form submission here

    const options: any = {};

    // Vendor status filter
    if (data.statusFilter) {
      options.vendorStatus = data.statusFilter.toUpperCase();
    }

    // Manual scheduling
    if (scheduleType === 'manual' && data.scheduleDateTime) {
      const scheduledDate = new Date(data.scheduleDateTime);
      options.scheduledTimestamp = scheduledDate.toISOString();
      options.attemptIntervalMinutes = '5';
    }

    const payload = {
      targetType: data.targetType,
      name: data.name,
      options: Object.keys(options).length ? options : undefined,
      transportId: data.messagingChannel,
      message: data.selectedTemplate,
    };
    const capaign = await createCampaign.mutateAsync(payload);
    console.log('Created campaign:', capaign);

    if (capaign.uuid) {
      trigger.mutateAsync({ uuid: capaign.uuid });
    }

    reset();
    router.push(`/projects/el-crm/${projectUUID}/communications/scheduled`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card/50 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href={`/projects/el-crm/${projectUUID}/communications/scheduled`}
          >
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Schedule Message
            </h1>
            <p className="text-muted-foreground">
              Create and schedule a new message to your audience
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Schedule Message</CardTitle>
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

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Schedule Type */}
                  <div className="space-y-2">
                    <Label htmlFor="schedule-type">Type</Label>
                    <Controller
                      name="scheduleType"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="manual">Manual</SelectItem>
                              <SelectItem value="automatic">
                                Automatic
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.scheduleType && (
                            <p className="text-sm text-red-500">
                              {errors.scheduleType.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>

                  {/* Manual - Schedule Date & Time (merged) */}
                  {scheduleType === 'manual' && (
                    <div className="space-y-2">
                      <Label htmlFor="schedule-datetime">
                        Schedule Date & Time
                      </Label>
                      <Input
                        id="schedule-datetime"
                        type="datetime-local"
                        min={new Date().toISOString().slice(0, 16)}
                        {...register('scheduleDateTime', {
                          validate: (value) => {
                            if (!value) return true;
                            return (
                              new Date(value) >= new Date() ||
                              'Past date/time is not allowed'
                            );
                          },
                        })}
                      />
                      {errors.scheduleDateTime && (
                        <p className="text-red-500 text-sm">
                          {errors.scheduleDateTime.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Automatic - Condition for scheduling */}
                  {scheduleType === 'automatic' && (
                    <div className="space-y-2">
                      <Label htmlFor="automatic-condition">
                        Automatic Schedule Condition
                      </Label>
                      <Controller
                        name="automaticCondition"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select trigger condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="purchase-anniversary">
                                Purchase Anniversary Reminder
                              </SelectItem>
                              <SelectItem value="birthday">
                                Birthday Reminder
                              </SelectItem>
                              <SelectItem value="account-anniversary">
                                Account Anniversary
                              </SelectItem>
                              <SelectItem value="last-purchase">
                                Last Purchase Reminder
                              </SelectItem>
                              <SelectItem value="inactivity">
                                Inactivity Reminder
                              </SelectItem>
                              <SelectItem value="custom-date">
                                Custom Date Event
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  )}

                  {/* Recurring option (only for Automatic) */}
                  {scheduleType === 'automatic' && (
                    <div className="flex items-center space-x-2">
                      <Controller
                        name="isRecurring"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id="recurring"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label
                        htmlFor="recurring"
                        className="font-normal cursor-pointer"
                      >
                        Recurring Schedule
                      </Label>
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Message */}
              {selectedChannelName !== CHANNELS.WHATSAPP && (
                <div className="space-y-2">
                  <Label htmlFor="custom-message">Message Content</Label>
                  <Textarea
                    id="custom-message"
                    placeholder="Type your message here..."
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
              {/* Schedule Button */}
              <div className="flex justify-end gap-3">
                <Link
                  href={`/projects/el-crm/${projectUUID}/communications/scheduled`}
                >
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="min-w-[140px]">
                  Schedule Message
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
