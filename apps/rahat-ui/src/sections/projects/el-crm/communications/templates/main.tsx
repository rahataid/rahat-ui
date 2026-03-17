'use client';

import React, { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@rahat-ui/shadcn/components/card';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import { Input } from '@rahat-ui/shadcn/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import {
  CheckCircle2,
  Clock3,
  FilterX,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  MessageSquare,
  TriangleAlert,
  Video,
  Image as ImageIcon,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { useDeleteTemplate, useListElCrmTemplate } from '@rahat-ui/query';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const { data: templateList } = useListElCrmTemplate(projectUUID, {});
  const deleteTemplate = useDeleteTemplate(projectUUID);

  const templates = templateList || [];

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'SMS':
        return 'bg-primary/10 text-primary';
      case 'WhatsApp':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-primary/10 text-primary';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const channelOptions = useMemo<string[]>(() => {
    const values = templates
      .map((template: any) => template?.Transport?.name || template?.channel)
      .filter((value: any): value is string => typeof value === 'string');

    return Array.from(new Set(values));
  }, [templates]);

  const totalMediaTemplates = templates.filter(
    (template: any) => template?.type === 'MEDIA',
  ).length;
  const approvedCount = templates.filter(
    (template: any) => template?.status === 'APPROVED',
  ).length;

  const filteredTemplates = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return templates.filter((template: any) => {
      const templateChannel =
        template?.Transport?.name || template?.channel || '';
      const searchableText = [
        template?.name,
        template?.body,
        templateChannel,
        template?.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesQuery = query ? searchableText.includes(query) : true;
      const matchesStatus =
        statusFilter === 'ALL' ? true : template?.status === statusFilter;
      const matchesChannel =
        channelFilter === 'ALL' ? true : templateChannel === channelFilter;
      const matchesType =
        typeFilter === 'ALL' ? true : (template?.type || 'TEXT') === typeFilter;

      return matchesQuery && matchesStatus && matchesChannel && matchesType;
    });
  }, [templates, searchQuery, statusFilter, channelFilter, typeFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'ALL' ||
    channelFilter !== 'ALL' ||
    typeFilter !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setChannelFilter('ALL');
    setTypeFilter('ALL');
  };

  const isVideoUrl = (url: string) => /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);

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
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Templates</h1>
            <p className="text-muted-foreground">
              Manage and create message templates
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
        {templates.length === 0 ? (
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
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border-border/80">
                <CardContent className="p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Total Templates
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">
                    {templates.length}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/80">
                <CardContent className="p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Approved
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-green-600">
                    {approvedCount}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/80 sm:col-span-2 lg:col-span-1">
                <CardContent className="p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Media Templates
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-blue-600">
                    {totalMediaTemplates}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/80">
              <CardContent className="space-y-4 p-4">
                <div className="grid gap-3 md:grid-cols-5">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, content, channel"
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Status</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={channelFilter}
                    onValueChange={setChannelFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Channels</SelectItem>
                      {channelOptions.map((channel) => (
                        <SelectItem key={channel} value={channel}>
                          {channel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Types</SelectItem>
                        <SelectItem value="TEXT">Text</SelectItem>
                        <SelectItem value="MEDIA">Media</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      onClick={resetFilters}
                      disabled={!hasActiveFilters}
                    >
                      <FilterX className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Showing{' '}
                  <span className="font-semibold text-foreground">
                    {filteredTemplates.length}
                  </span>{' '}
                  templates
                </p>
              </CardContent>
            </Card>

            {filteredTemplates.length === 0 ? (
              <Card>
                <CardContent className="flex min-h-[220px] flex-col items-center justify-center text-center">
                  <MessageSquare className="mb-3 h-10 w-10 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground">
                    No matching templates
                  </h3>
                  <p className="mb-4 mt-1 text-sm text-muted-foreground">
                    Try changing your search text or clearing filters.
                  </p>
                  <Button variant="outline" onClick={resetFilters}>
                    <FilterX className="mr-2 h-4 w-4" />
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTemplates.map((template: any) => {
                  const channelName =
                    template?.Transport?.name || template?.channel || 'Unknown';
                  const mediaItems = template?.media || [];
                  const primaryMedia = mediaItems[0];
                  const extraMediaCount = Math.max(mediaItems.length - 1, 0);

                  return (
                    <Card
                      key={template.cuid || template.id}
                      className="flex flex-col border-border/80 shadow-sm"
                    >
                      <CardHeader className="space-y-3 pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <CardTitle className="truncate text-lg">
                              {template.name}
                            </CardTitle>
                            <CardDescription className="mt-1 text-xs">
                              Created{' '}
                              {new Date(
                                template.createdAt,
                              ).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge
                            className={getChannelColor(channelName)}
                            variant="secondary"
                          >
                            {channelName}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {template.status === 'REJECTED' ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex cursor-pointer items-center gap-2">
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

                          <Badge variant="outline">
                            {template?.type || 'TEXT'}
                          </Badge>

                          {template.status === 'APPROVED' && (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Ready
                            </span>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="flex flex-1 flex-col gap-4">
                        <p className="line-clamp-3 text-sm text-muted-foreground">
                          {template.body}
                        </p>

                        {template.type === 'MEDIA' && mediaItems.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Media Preview
                            </p>
                            <div className="relative overflow-hidden rounded-lg border bg-muted aspect-video">
                              {isVideoUrl(primaryMedia) ? (
                                <>
                                  <video
                                    src={primaryMedia}
                                    className="h-full w-full object-cover"
                                    muted
                                    playsInline
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <Video className="h-7 w-7 text-white" />
                                  </div>
                                </>
                              ) : (
                                <img
                                  src={primaryMedia}
                                  alt={template.name}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const fallback = e.currentTarget
                                      .nextElementSibling as HTMLElement | null;
                                    if (fallback)
                                      fallback.style.display = 'flex';
                                  }}
                                />
                              )}
                              <div
                                className="hidden h-full w-full items-center justify-center text-muted-foreground"
                                aria-hidden="true"
                              >
                                <ImageIcon className="h-8 w-8" />
                              </div>
                            </div>
                            {extraMediaCount > 0 && (
                              <p className="text-xs text-muted-foreground">
                                +{extraMediaCount} more media
                              </p>
                            )}
                          </div>
                        )}

                        {template.lastApprovalCheck && (
                          <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock3 className="h-3.5 w-3.5" />
                            Approval Check{' '}
                            {new Date(
                              template.lastApprovalCheck,
                            ).toLocaleString()}
                          </p>
                        )}

                        <div className="mt-auto flex items-center justify-end gap-2 border-t pt-3">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete your template from our
                                  servers.
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
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
