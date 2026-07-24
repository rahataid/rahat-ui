'use client';

import { useState } from 'react';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import {
  useListElCrmTemplate,
  useListElCrmTransport,
} from '@rahat-ui/query/lib/el-crm';

const messageTemplates = [
  'Welcome Message',
  'Product Update',
  'Reminder',
  'Appointment Confirmation',
  'Follow-up Message',
];

export default function ComposeMessageView() {
  const { id: projectUUID } = useParams() as { id: UUID };

  const [groupSelection, setGroupSelection] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [messagingChannel, setMessagingChannel] = useState('');
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [showTemplateCreator, setShowTemplateCreator] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateContent, setNewTemplateContent] = useState('');

  const transport = useListElCrmTransport(projectUUID);

  const handleSendMessage = () => {
    console.log('Sending message with:', {
      groupSelection,
      statusFilter,
      messagingChannel,
      scheduleDate,
      selectedTemplate,
      customMessage,
    });
  };

  const handleCreateTemplate = () => {
    setNewTemplateName('');
    setNewTemplateContent('');
    setShowTemplateCreator(false);
  };

  return (
    <TooltipProvider delayDuration={200}>
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card px-6 py-5">
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/projects/el-crm/${projectUUID}/communications`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Back to communications</TooltipContent>
          </Tooltip>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Compose Message
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create and send a new message to your audience
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <Card>
          <CardHeader>
            <CardTitle>Compose Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Group Selection */}
                <div className="space-y-2">
                  <Label htmlFor="group-selection">Select Group</Label>
                  <Select
                    value={groupSelection}
                    onValueChange={(value) => {
                      setGroupSelection(value);
                      if (value === 'consumers') {
                        setStatusFilter('');
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select group type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customers">Customers</SelectItem>
                      <SelectItem value="consumers">Consumers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Condition Filter - only shows when Customer is selected */}
                {groupSelection === 'customers' && (
                  <div className="space-y-2">
                    <Label htmlFor="condition-filter">Condition Filter</Label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
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
                  </div>
                )}

                {/* Messaging Channel */}
                <div className="space-y-2">
                  <Label htmlFor="messaging-channel">Messaging Channel</Label>
                  <Select
                    value={messagingChannel}
                    onValueChange={setMessagingChannel}
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
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Schedule Message */}
                <div className="space-y-2">
                  <Label>Schedule Message</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-transparent"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduleDate ? (
                          format(scheduleDate, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={scheduleDate}
                        onSelect={setScheduleDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Template Management</Label>
                  <Button
                    variant="outline"
                    onClick={() => setShowTemplateCreator(!showTemplateCreator)}
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
                  <CardTitle className="text-lg">Create New Template</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      placeholder="Enter template name"
                      value={newTemplateName}
                      onChange={(e) => setNewTemplateName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-content">Template Content</Label>
                    <Textarea
                      id="template-content"
                      placeholder="Enter template content..."
                      value={newTemplateContent}
                      onChange={(e) => setNewTemplateContent(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTemplateCreator(false)}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleCreateTemplate}>
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
              <Select
                value={selectedTemplate}
                onValueChange={setSelectedTemplate}
              >
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
            </div>

            {/* Custom Message */}
            <div className="space-y-2">
              <Label htmlFor="custom-message">OR Write Custom Message</Label>
              <Textarea
                id="custom-message"
                placeholder="Type your custom message here..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={4}
              />
            </div>

            {/* Send Button */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/communication">
                <Button variant="outline" size="sm">Cancel</Button>
              </Link>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" onClick={handleSendMessage} className="min-w-[120px]">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Send this message</TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </TooltipProvider>
  );
}
