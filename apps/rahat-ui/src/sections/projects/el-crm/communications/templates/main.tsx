'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@rahat-ui/shadcn/components/card';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import { Plus, Edit, Trash2, Copy, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';

const templates = [
  {
    id: 1,
    name: 'Welcome Message',
    channel: 'SMS',
    content:
      "Welcome to our service! We're excited to have you on board. Your account has been successfully created.",
    createdDate: '2024-01-10',
  },
  {
    id: 2,
    name: 'Product Update',
    channel: 'WhatsApp',
    content:
      "We've just launched new features in our app! Check out the latest updates and improvements.",
    createdDate: '2024-01-15',
  },
  {
    id: 3,
    name: 'Reminder',
    channel: 'SMS',
    content:
      "Don't forget about your upcoming appointment scheduled for tomorrow at 2:00 PM.",
    createdDate: '2024-01-08',
  },
  {
    id: 4,
    name: 'Appointment Confirmation',
    channel: 'WhatsApp',
    content:
      'Your appointment has been confirmed for {{date}} at {{time}}. Please reply with a confirmation or call us if you need to reschedule.',
    createdDate: '2024-01-12',
  },
  {
    id: 5,
    name: 'Follow-up Message',
    channel: 'SMS',
    content:
      "Hi! We noticed you haven't completed your purchase. Would you like any help? Our team is here to assist you.",
    createdDate: '2024-01-05',
  },
];

export default function TemplatesView() {
  const { id: projectUUID } = useParams() as { id: UUID };

  const [templateList, setTemplateList] = useState(templates);

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

  const handleDelete = (id: number) => {
    setTemplateList(templateList.filter((t) => t.id !== id));
  };

  const handleDuplicate = (template: (typeof templates)[0]) => {
    const newTemplate = {
      ...template,
      id: Math.max(...templateList.map((t) => t.id)) + 1,
      name: `${template.name} (Copy)`,
      createdDate: new Date().toISOString().split('T')[0],
    };
    setTemplateList([...templateList, newTemplate]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Templates</h1>
            <p className="text-muted-foreground">
              Manage and create message templates
            </p>
          </div>
          <Link
            href={`/projects/el-crm/${projectUUID}/communications/templates/create`}
          >
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Template
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex-1 p-6">
        {templateList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No templates yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Create your first template to get started
            </p>
            <Link
              href={`/projects/el-crm/${projectUUID}/communications/templates/create`}
            >
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templateList.map((template) => (
              <Card key={template.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        Created{' '}
                        {new Date(template.createdDate).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge
                      className={getChannelColor(template.channel)}
                      variant="secondary"
                    >
                      {template.channel}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground flex-1 mb-4 line-clamp-3">
                    {template.content}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/communication/templates/${template.id}/edit`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicate(template)}
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(template.id)}
                      className="flex-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
