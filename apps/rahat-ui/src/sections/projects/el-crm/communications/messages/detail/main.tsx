'use client';

import { useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/components/card';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import { Label } from '@rahat-ui/shadcn/components/label';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { UUID } from 'crypto';

const messagesList = [
  {
    id: 1,
    name: 'Welcome Campaign',
    channel: 'SMS',
    group: 'Customers',
    status: 'Active',
    recipients: 245,
    createdDate: '2024-01-20',
    messageContent:
      "Welcome to our service! We're excited to have you on board. Your account has been successfully created.",
    groupStatus: 'Active customers - 245 recipients',
  },
  {
    id: 2,
    name: 'Product Launch',
    channel: 'WhatsApp',
    group: 'Active Users',
    status: 'Draft',
    recipients: 189,
    createdDate: '2024-01-19',
    messageContent:
      "We've just launched new features in our app! Check out the latest updates and improvements.",
    groupStatus: 'Active users - 189 recipients',
  },
  {
    id: 3,
    name: 'Appointment Reminder',
    channel: 'SMS',
    group: 'Customers',
    status: 'Scheduled',
    recipients: 312,
    createdDate: '2024-01-18',
    messageContent:
      'Reminder about your upcoming appointment scheduled for tomorrow at 2:00 PM.',
    groupStatus: 'Inactive customers - 312 recipients',
  },
];

export default function MessageDetailPage() {
  const { id: projectUUID, messageId } = useParams() as {
    id: UUID;
    messageId: string;
  };
  const message = messagesList.find((m) => m.id === Number(messageId));

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'SMS':
        return 'bg-blue-100 text-blue-800';
      case 'WhatsApp':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Draft':
        return 'secondary';
      case 'Scheduled':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const handleSendMessage = () => {
    console.log('Sending message:', message?.id);
  };

  if (!message) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b border-border bg-card/50 px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/projects/el-crm/${projectUUID}/communications/messages`}
            >
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Message Not Found
              </h1>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              The message you're looking for doesn't exist.
            </p>
            <Link
              href={`/projects/el-crm/${projectUUID}/communications/messages`}
            >
              <Button>Go Back to Messages</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card/50 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href={`/projects/el-crm/${projectUUID}/communications/messages`}
          >
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {message.name}
            </h1>
            <p className="text-muted-foreground">View message details</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="grid gap-6">
          {/* Message Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Message Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Message Name
                  </Label>
                  <p className="text-sm mt-2 font-medium">{message.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Channel
                  </Label>
                  <div className="mt-2">
                    <Badge
                      className={getChannelColor(message.channel)}
                      variant="secondary"
                    >
                      {message.channel}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Group
                  </Label>
                  <p className="text-sm mt-2">{message.group}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Recipients
                  </Label>
                  <p className="text-sm mt-2">{message.recipients}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Created Date
                  </Label>
                  <p className="text-sm mt-2">
                    {format(new Date(message.createdDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Status
                  </Label>
                  <div className="mt-2">
                    <Badge variant={getStatusVariant(message.status)}>
                      {message.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Group Status
                </Label>
                <Card className="mt-2">
                  <CardContent className="p-4">
                    <p className="text-sm">{message.groupStatus}</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Message Content
                </Label>
                <Card className="mt-2">
                  <CardContent className="p-4">
                    <p className="text-sm whitespace-pre-wrap">
                      {message.messageContent}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Send Button */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Link
                  href={`/projects/el-crm/${projectUUID}/communications/messages`}
                >
                  <Button variant="outline">Back</Button>
                </Link>
                <Button onClick={handleSendMessage} className="min-w-[140px]">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
