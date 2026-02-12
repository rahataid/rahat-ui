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
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';

const messageTemplates = [
  'Welcome Message',
  'Product Update',
  'Reminder',
  'Appointment Confirmation',
  'Follow-up Message',
];

// Validation schema
const composeMessageSchema = z.object({
  groupSelection: z.string().min(1, 'Please select a group'),
  statusFilter: z.string().optional(),
  messagingChannel: z.string().min(1, 'Please select a messaging channel'),
  scheduleDate: z.date().optional(),
  selectedTemplate: z.string().optional(),
  customMessage: z
    .string()
    .min(1, 'Please enter a message')
    .max(500, 'Message must be less than 500 characters'),
  newTemplateName: z.string().optional(),
  newTemplateContent: z.string().optional(),
});

type ComposeMessageForm = z.infer<typeof composeMessageSchema>;

export default function ComposeMessageView() {
  const { id: projectUUID } = useParams() as { id: UUID };
  const [showTemplateCreator, setShowTemplateCreator] = useState(false);

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
      groupSelection: '',
      statusFilter: '',
      messagingChannel: '',
      scheduleDate: undefined,
      selectedTemplate: '',
      customMessage: '',
      newTemplateName: '',
      newTemplateContent: '',
    },
  });

  const groupSelection = watch('groupSelection');
  const scheduleDate = watch('scheduleDate');

  const onSubmit = (data: ComposeMessageForm) => {
    console.log('Submitting form with:', data);
    // Handle form submission here
  };

  const handleCreateTemplate = (data: ComposeMessageForm) => {
    console.log('Creating template:', {
      name: data.newTemplateName,
      content: data.newTemplateContent,
    });
    setShowTemplateCreator(false);
    reset();
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
                  {/* Schedule Message */}
                  <div className="space-y-2">
                    <Label>Schedule Message</Label>
                    <Controller
                      name="scheduleDate"
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal bg-transparent"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Template Management</Label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setShowTemplateCreator(!showTemplateCreator)
                      }
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Template
                    </Button>
                  </div>
                </div>
              </div>

              {showTemplateCreator && (
                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Create New Template
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="template-name">Template Name</Label>
                      <Input
                        id="template-name"
                        placeholder="Enter template name"
                        {...register('newTemplateName')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="template-content">Template Content</Label>
                      <Textarea
                        id="template-content"
                        placeholder="Enter template content..."
                        {...register('newTemplateContent')}
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowTemplateCreator(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSubmit(handleCreateTemplate)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Template Selection */}
              <div className="space-y-2">
                <Label htmlFor="template">Select Template</Label>
                <Controller
                  name="selectedTemplate"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose existing template" />
                      </SelectTrigger>
                      <SelectContent>
                        {messageTemplates.map((template) => (
                          <SelectItem
                            key={template}
                            value={template.toLowerCase().replace(/\s+/g, '-')}
                          >
                            {template}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Custom Message */}
              <div className="space-y-2">
                <Label htmlFor="custom-message">OR Write Custom Message</Label>
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

              {/* Send Button */}
              <div className="flex justify-end gap-3">
                <Link href="/communication">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="min-w-[120px]">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
