'use client';

import { useState } from 'react';
import { Card, CardContent } from '@rahat-ui/shadcn/components/card';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Plus, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import DemoTable from 'apps/rahat-ui/src/components/table';
import { useMsgTableColumn } from './useMsgTableColumns';
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';

const createdMessages = [
  {
    id: 1,
    name: 'Welcome Campaign',
    channel: 'SMS',
    group: 'Customers',
    status: 'Active',
    recipients: 245,
    createdDate: '2024-01-20',
    messageContent:
      "Welcome to our service! We're excited to have you on board.",
  },
  {
    id: 2,
    name: 'Product Launch',
    channel: 'WhatsApp',
    group: 'Active Users',
    status: 'Draft',
    recipients: 189,
    createdDate: '2024-01-19',
    messageContent: "We've just launched new features in our app!",
  },
  {
    id: 3,
    name: 'Appointment Reminder',
    channel: 'SMS',
    group: 'Customers',
    status: 'Scheduled',
    recipients: 312,
    createdDate: '2024-01-18',
    messageContent: 'Reminder about your upcoming appointment.',
  },
];

export default function MessagesView() {
  const { id: projectUUID } = useParams() as { id: UUID };

  const [messages] = useState(createdMessages);

  const columns = useMsgTableColumn();

  const table = useReactTable({
    manualPagination: true,
    data: messages,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Messages</h1>
            <p className="text-muted-foreground">
              Create and manage your messages
            </p>
          </div>
          <Link
            href={`/projects/el-crm/${projectUUID}/communications/messages/compose`}
          >
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Message
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex-1 p-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No messages created
            </h3>
            <p className="text-muted-foreground mb-6">
              Create your first message to get started
            </p>
            <Link
              href={`/projects/el-crm/${projectUUID}/communications/messages/compose`}
            >
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Message
              </Button>
            </Link>
          </div>
        ) : (
          <Card>
            <CardContent>
              <DemoTable table={table} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
