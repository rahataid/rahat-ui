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
import {
  Plus,
  Trash2,
  MessageSquare,
  RefreshCcw,
  TriangleAlert,
} from 'lucide-react';
import Link from 'next/link';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import {
  useDeleteTemplate,
  useListElCrmTemplate,
  useSyncTemplate,
} from '@rahat-ui/query';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

export default function TemplatesView() {
  const { id: projectUUID } = useParams() as { id: UUID };

  const { data: templateList } = useListElCrmTemplate(projectUUID);
  const sync = useSyncTemplate(projectUUID);
  const deleteTemplate = useDeleteTemplate(projectUUID);

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

  const getStatusColor = (channel: string) => {
    switch (channel) {
      case 'PENDING':
        return 'bg-blue-100 text-blue-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSync = async () => {
    try {
      await sync.mutateAsync({
        transportId: templateList[0].Transport.cuid,
      });
    } catch (error) {
      console.error('Error syncing templates:', error);
    }
  };

  const handleDelete = async (cuid: string) => {
    try {
      await deleteTemplate.mutateAsync(cuid);
    } catch (error) {
      console.error('Error syncing templates:', error);
    }
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
          <div>
            <Button
              variant="outline"
              size="sm"
              className="mr-2"
              onClick={handleSync}
              disabled={sync.isPending || templateList?.length === 0}
            >
              <RefreshCcw />
              {sync.isPending ? 'Syncing...' : 'Sync Template'}
            </Button>
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
      </div>

      <div className="flex-1 p-6">
        {templateList?.length === 0 ? (
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
            {templateList?.map((template: any) => (
              <Card key={template.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        Created{' '}
                        {new Date(template.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div>
                      <Badge
                        className={getChannelColor(template.channel)}
                        variant="secondary"
                      >
                        {template.Transport.name}
                      </Badge>
                      <p className="text-xs mt-1">
                        Approval Check{' '}
                        {new Date(
                          template.lastApprovalCheck,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground flex-1 mb-4 line-clamp-3">
                    {template.body}
                  </p>
                  <div className="flex gap-2">
                    {template.status === 'REJECTED' ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 cursor-pointer">
                            <Badge
                              className={getStatusColor(template.status)}
                              variant="secondary"
                            >
                              {template.status}
                            </Badge>
                            <TriangleAlert className="h-4 w-4 text-red-500" />
                          </div>
                        </TooltipTrigger>

                        <TooltipContent className="max-w-xs break-words">
                          <p className="text-sm">{template?.info}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Badge
                        className={getStatusColor(template.status)}
                        variant="secondary"
                      >
                        {template.status}
                      </Badge>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your template from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(template.cuid)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
