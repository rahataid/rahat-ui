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
  FileText,
  CalendarDays,
  ShieldCheck,
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
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';

export default function TemplatesView() {
  const { id: projectUUID } = useParams() as { id: UUID };

  const { data: templateList } = useListElCrmTemplate(projectUUID, {});
  const deleteTemplate = useDeleteTemplate(projectUUID);

  const getStatusVariant = (status: string): 'success' | 'secondary' | 'destructive' | 'warning' => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'destructive';
      default:
        return 'secondary';
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
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Templates
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Manage and create message templates
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/projects/el-crm/${projectUUID}/communications/templates/create`}
                  >
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Template
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Create a new message template</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          {templateList?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                No templates yet
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Create your first message template to start sending communications
              </p>
              <Link
                href={`/projects/el-crm/${projectUUID}/communications/templates/create`}
              >
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Template count */}
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  All Templates
                </span>
                <Badge variant="outline" className="tabular-nums">
                  {templateList?.length ?? 0}
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {templateList?.map((template: any) => (
                  <Card key={template.id} className="flex flex-col group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base font-semibold truncate">
                            {template.name}
                          </CardTitle>
                          <div className="flex items-center gap-1.5 mt-1.5 text-muted-foreground">
                            <CalendarDays className="h-3 w-3 shrink-0" />
                            <span className="text-xs tabular-nums">
                              Created{' '}
                              {new Date(template.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-xs">
                          {template.Transport.name}
                        </Badge>
                      </div>
                      {template.lastApprovalCheck && (
                        <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
                          <ShieldCheck className="h-3 w-3 shrink-0" />
                          <span className="text-xs tabular-nums">
                            Approval Check{' '}
                            {new Date(template.lastApprovalCheck).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col pt-0">
                      <p className="text-sm text-muted-foreground flex-1 mb-4 line-clamp-3 leading-relaxed">
                        {template.body || '\u2014'}
                      </p>
                      <div className="flex items-center gap-2 pt-3 border-t">
                        {template.status === 'REJECTED' ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1.5 cursor-pointer">
                                <Badge variant={getStatusVariant(template.status)}>
                                  {template.status}
                                </Badge>
                                <TriangleAlert className="h-3.5 w-3.5 text-destructive" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs break-words">
                              <p className="text-sm">{template?.info}</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Badge variant={getStatusVariant(template.status)}>
                            {template.status}
                          </Badge>
                        )}

                        <div className="ml-auto">
                          <AlertDialog>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent>Delete template</TooltipContent>
                            </Tooltip>
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
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
