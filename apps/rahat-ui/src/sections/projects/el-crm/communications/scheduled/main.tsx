'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/components/card';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Label } from '@rahat-ui/shadcn/components/label';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import { format } from 'date-fns';
import { Plus, Clock, X } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useScheduledTableColumn } from './useMsgTableColumns';
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import DemoTable from 'apps/rahat-ui/src/components/table';

const scheduledMessages = [
  {
    id: 1,
    templateName: 'Welcome Message',
    channel: 'SMS',
    group: 'New Customers',
    scheduledDate: '2024-02-15',
    scheduledTime: '10:00 AM',
    recipientCount: 245,
    status: 'Scheduled',
    templateContent:
      "Welcome to our service! We're excited to have you on board.",
  },
  {
    id: 2,
    templateName: 'Product Update',
    channel: 'WhatsApp',
    group: 'Active Users',
    scheduledDate: '2024-02-14',
    scheduledTime: '02:00 PM',
    recipientCount: 189,
    status: 'Scheduled',
    templateContent: "We've just launched new features in our app!",
  },
  {
    id: 3,
    templateName: 'Appointment Reminder',
    channel: 'SMS',
    group: 'Customers',
    scheduledDate: '2024-02-20',
    scheduledTime: '09:00 AM',
    recipientCount: 312,
    status: 'Pending',
    templateContent: 'This is a reminder about your upcoming appointment.',
  },
  {
    id: 4,
    templateName: 'Re-engagement Campaign',
    channel: 'WhatsApp',
    group: 'Inactive Users',
    scheduledDate: '2024-02-18',
    scheduledTime: '11:30 AM',
    recipientCount: 567,
    status: 'Scheduled',
    templateContent: "We miss you! Check out what's new and come back to us.",
  },
];

export default function ScheduledView() {
  const { id: projectUUID } = useParams() as { id: UUID };

  const [messages, setMessages] = useState(scheduledMessages);
  const [selectedMessage, setSelectedMessage] = useState<
    (typeof scheduledMessages)[0] | null
  >(null);
  const [filterTemplate, setFilterTemplate] = useState('all');
  const [filterChannel, setFilterChannel] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  const handleDelete = (id: number) => {
    setMessages(messages.filter((m) => m.id !== id));
  };

  const clearFilters = () => {
    setFilterTemplate('all');
    setFilterChannel('all');
    setFilterDate('all');
  };

  const filteredMessages = scheduledMessages.filter((message) => {
    const templateMatch =
      filterTemplate === 'all' ||
      message.templateName.toLowerCase().includes(filterTemplate.toLowerCase());
    const channelMatch =
      filterChannel === 'all' || message.channel === filterChannel;
    const dateMatch =
      filterDate === 'all' || message.scheduledDate === filterDate;

    return templateMatch && channelMatch && dateMatch;
  });

  const hasActiveFilters =
    filterTemplate !== 'all' || filterChannel !== 'all' || filterDate !== 'all';
  const uniqueTemplates = Array.from(
    new Set(scheduledMessages.map((m) => m.templateName)),
  );
  const uniqueChannels = Array.from(
    new Set(scheduledMessages.map((m) => m.channel)),
  );
  const uniqueDates = Array.from(
    new Set(scheduledMessages.map((m) => m.scheduledDate)),
  ).sort();

  const columns = useScheduledTableColumn();

  const table = useReactTable({
    manualPagination: true,
    data: filteredMessages,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Scheduled Messages
            </h1>
            <p className="text-muted-foreground">
              View and manage scheduled messages
            </p>
          </div>
          <Link
            href={`/projects/el-crm/${projectUUID}/communications/scheduled/compose`}
          >
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Message
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex-1 p-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No scheduled messages
            </h3>
            <p className="text-muted-foreground mb-6">
              Schedule your first message to get started
            </p>
            <Link
              href={`/projects/el-crm/${projectUUID}/communications/scheduled/compose`}
            >
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Message
              </Button>
            </Link>
          </div>
        ) : (
          <Card>
            {hasActiveFilters && (
              <CardHeader>
                {/* <div className="flex items-center justify-between"> */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-2 bg-transparent"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
                {/* </div> */}
              </CardHeader>
            )}
            <CardContent
              className={`space-y-4 ${!hasActiveFilters ? 'mt-6' : ''}`}
            >
              {/* Filters */}
              <div className="grid gap-4 md:grid-cols-3 bg-muted/50 p-4 rounded-lg">
                {/* Template Filter */}
                <div className="space-y-2">
                  <Label htmlFor="template-filter" className="text-sm">
                    Template
                  </Label>
                  <Select
                    value={filterTemplate}
                    onValueChange={setFilterTemplate}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Templates" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Templates</SelectItem>
                      {uniqueTemplates.map((template) => (
                        <SelectItem key={template} value={template}>
                          {template}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Channel Filter */}
                <div className="space-y-2">
                  <Label htmlFor="channel-filter" className="text-sm">
                    Channel
                  </Label>
                  <Select
                    value={filterChannel}
                    onValueChange={setFilterChannel}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Channels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Channels</SelectItem>
                      {uniqueChannels.map((channel) => (
                        <SelectItem key={channel} value={channel}>
                          {channel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Filter */}
                <div className="space-y-2">
                  <Label htmlFor="date-filter" className="text-sm">
                    Date
                  </Label>
                  <Select value={filterDate} onValueChange={setFilterDate}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Dates" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      {uniqueDates.map((date) => (
                        <SelectItem key={date} value={date}>
                          {format(new Date(date), 'MMM dd, yyyy')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Results Count */}
              <div className="text-sm text-muted-foreground">
                Showing {filteredMessages.length} of {scheduledMessages.length}{' '}
                messages
              </div>

              {/* Table */}
              <DemoTable table={table} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
