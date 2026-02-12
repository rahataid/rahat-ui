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
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';

// Validation schema
const scheduleMessageSchema = z.object({
  groupSelection: z.string().min(1, 'Please select a group'),
  statusFilter: z.string().optional(),
  messagingChannel: z.string().min(1, 'Please select a messaging channel'),
  scheduleType: z.string().min(1, 'Please select a schedule type'),
  scheduleDateTime: z.string().optional(),
  automaticCondition: z.string().optional(),
  isRecurring: z.boolean().default(false),
  customMessage: z
    .string()
    .min(1, 'Please enter a message')
    .max(1000, 'Message must be less than 1000 characters'),
});

type ScheduleMessageForm = z.infer<typeof scheduleMessageSchema>;

export default function ComposeScheduleView() {
  const { id: projectUUID } = useParams() as { id: UUID };

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<ScheduleMessageForm>({
    resolver: zodResolver(scheduleMessageSchema),
    defaultValues: {
      groupSelection: '',
      statusFilter: '',
      messagingChannel: '',
      scheduleType: '',
      scheduleDateTime: '',
      automaticCondition: '',
      isRecurring: false,
      customMessage: '',
    },
  });

  const groupSelection = watch('groupSelection');
  const scheduleType = watch('scheduleType');

  const onSubmit = (data: ScheduleMessageForm) => {
    console.log('Scheduling message with:', data);
    // Handle form submission here
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
                  {/* Group Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="group-selection">Select Group</Label>
                    <Controller
                      name="groupSelection"
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
                              <SelectItem value="customers">
                                Customers
                              </SelectItem>
                              <SelectItem value="consumers">
                                Consumers
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.groupSelection && (
                            <p className="text-sm text-red-500">
                              {errors.groupSelection.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>

                  {/* Condition Filter - only shows when Customer is selected */}
                  {groupSelection === 'customers' && (
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
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select channel" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sms">SMS</SelectItem>
                              <SelectItem value="whatsapp">WhatsApp</SelectItem>
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
                        {...register('scheduleDateTime')}
                      />
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

              {/* Schedule Button */}
              <div className="flex justify-end gap-3">
                <Link href="/communication/schedule">
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
