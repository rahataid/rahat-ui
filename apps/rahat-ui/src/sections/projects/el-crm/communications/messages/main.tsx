'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@rahat-ui/shadcn/components/card';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Input } from '@rahat-ui/shadcn/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import {
  ArrowRight,
  FileText,
  MessageSquare,
  Plus,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import Link from 'next/link';
import DemoTable from 'apps/rahat-ui/src/components/table';
import { useMsgTableColumn } from './useMsgTableColumns';
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  useListElCrmCampaign,
  useListElCrmTemplate,
  usePagination,
} from '@rahat-ui/query';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { TableSkeleton } from '../skeletons';

type CampaignTab = 'regular' | 'automatic';

export default function MessagesView() {
  const { id: projectUUID } = useParams() as { id: UUID };
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromUrl =
    searchParams.get('tab') === 'automatic' ? 'automatic' : 'regular';
  const [activeTab, setActiveTab] = useState<CampaignTab>(tabFromUrl);
  useEffect(() => {
    if (tabFromUrl !== activeTab) setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SENT' | 'DRAFT'>(
    'ALL',
  );

  const { pagination, setNextPage, setPrevPage, setPerPage, resetPagination } =
    usePagination();
  const columns = useMsgTableColumn({
    hideRecipientCount: activeTab === 'automatic',
    isAutomatic: activeTab === 'automatic',
  });

  // Debounce the search input so we don't hit the server on every keystroke.
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Snap back to page 1 whenever filters change so the user can't be stranded
  // on a page index that no longer exists once the total shrinks.
  useEffect(() => {
    resetPagination();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, statusFilter, activeTab]);

  // Status filter only applies to the Regular tab.
  const serverStatus =
    activeTab === 'automatic'
      ? undefined
      : statusFilter === 'SENT'
      ? 'Sent'
      : statusFilter === 'DRAFT'
      ? 'Draft'
      : undefined;

  const { data, meta, isLoading } = useListElCrmCampaign(projectUUID, {
    page: pagination.page,
    perPage: pagination.perPage,
    order: 'desc',
    isScheduled: false,
    isAutomatic: activeTab === 'automatic',
    ...(debouncedSearch ? { name: debouncedSearch } : {}),
    ...(serverStatus ? { status: serverStatus } : {}),
  });
  const { data: approvedTemplates } = useListElCrmTemplate(projectUUID, {
    status: 'APPROVED',
  });
  const quickStartTemplates = (approvedTemplates || []).slice(0, 3);

  const activeFilterCount =
    (debouncedSearch !== '' ? 1 : 0) +
    (activeTab !== 'automatic' && statusFilter !== 'ALL' ? 1 : 0);
  const hasActiveFilters = activeFilterCount > 0;

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
  };

  const table = useReactTable({
    manualPagination: true,
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full">
        <div className="border-b border-border bg-card px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Messages
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Create and manage your messages
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/projects/el-crm/${projectUUID}/communications/messages/compose`}
                >
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Message
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Compose a new message</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-6 overflow-auto">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              const next = value as CampaignTab;
              setActiveTab(next);
              setStatusFilter('ALL');
              resetPagination();
              router.replace(
                `/projects/el-crm/${projectUUID}/communications/messages?tab=${next}`,
                { scroll: false },
              );
            }}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="regular" className="gap-2">
                <Send className="h-4 w-4" />
                Regular
              </TabsTrigger>
              <TabsTrigger value="automatic" className="gap-2">
                <Zap className="h-4 w-4" />
                Automatic
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {isLoading ? (
                <Card className="flex flex-col">
                  <CardContent className="p-0">
                    <TableSkeleton rows={8} />
                  </CardContent>
                </Card>
              ) : data.length === 0 && !hasActiveFilters ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                  <div className="rounded-full bg-muted p-4 mb-4">
                    {activeTab === 'automatic' ? (
                      <Zap className="h-8 w-8 text-muted-foreground" />
                    ) : (
                      <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {activeTab === 'automatic'
                      ? 'No automatic campaigns'
                      : 'No regular campaigns'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-md">
                    {activeTab === 'automatic'
                      ? 'Automatic campaigns send messages whenever specific events fire — for example, when a customer is newly verified.'
                      : 'Send one-off messages to your customers and consumers. Start blank, or pick an approved template to skip a few steps.'}
                  </p>

                  {quickStartTemplates.length > 0 ? (
                    <div className="w-full max-w-2xl space-y-4">
                      <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <Sparkles className="h-3.5 w-3.5" />
                        Start from an approved template
                      </div>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {quickStartTemplates.map((tpl: any) => {
                          const channel =
                            tpl?.Transport?.name || tpl?.channel || 'Unknown';
                          return (
                            <Link
                              key={tpl.cuid || tpl.id}
                              href={`/projects/el-crm/${projectUUID}/communications/messages/compose?templateId=${encodeURIComponent(
                                tpl.externalId || tpl.cuid,
                              )}&channel=${encodeURIComponent(channel)}`}
                              className="group flex flex-col gap-2 rounded-lg border p-3 text-left hover:border-primary hover:bg-primary/5 transition-colors"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <Badge
                                  variant="secondary"
                                  className="text-[10px]"
                                >
                                  {channel}
                                </Badge>
                              </div>
                              <span className="text-sm font-medium truncate">
                                {tpl.name}
                              </span>
                              <span className="inline-flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                Use template
                                <ArrowRight className="h-3 w-3" />
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-center gap-3 pt-2">
                        <Link
                          href={`/projects/el-crm/${projectUUID}/communications/messages/compose`}
                        >
                          <Button size="sm" variant="outline">
                            <Plus className="mr-2 h-4 w-4" />
                            Start from scratch
                          </Button>
                        </Link>
                        <Link
                          href={`/projects/el-crm/${projectUUID}/communications/templates`}
                        >
                          <Button size="sm" variant="ghost">
                            Browse all templates
                            <ArrowRight className="ml-1 h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <Link
                        href={`/projects/el-crm/${projectUUID}/communications/messages/compose`}
                      >
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Create Message
                        </Button>
                      </Link>
                      <Link
                        href={`/projects/el-crm/${projectUUID}/communications/templates/create`}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        Or create a reusable template first
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Card className="flex flex-col">
                  <div className="border-b border-border px-5 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          Filters
                        </span>
                        {activeFilterCount > 0 && (
                          <span className="inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                            {activeFilterCount}
                          </span>
                        )}
                      </div>
                      {activeFilterCount > 0 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={resetFilters}
                          className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3.5 w-3.5" />
                          Clear all
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-wrap items-end gap-3">
                      <div className="flex-1 min-w-[200px] space-y-1.5">
                        <Label className="text-xs text-muted-foreground">
                          Search
                        </Label>
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or channel"
                            className="pl-8 h-9 text-sm"
                          />
                        </div>
                      </div>
                      {activeTab !== 'automatic' && (
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">
                            Status
                          </Label>
                          <Select
                            value={statusFilter}
                            onValueChange={(v) =>
                              setStatusFilter(v as typeof statusFilter)
                            }
                          >
                            <SelectTrigger className="w-[150px] h-9 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ALL">All Statuses</SelectItem>
                              <SelectItem value="SENT">Sent</SelectItem>
                              <SelectItem value="DRAFT">Draft</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                    {activeFilterCount > 0 && (
                      <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50">
                        {meta?.total ?? 0} message
                        {(meta?.total ?? 0) === 1 ? '' : 's'} match the active
                        filters
                      </p>
                    )}
                  </div>
                  <CardContent className="p-0">
                    {data.length === 0 ? (
                      <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                        <MessageSquare className="mb-3 h-10 w-10 text-muted-foreground" />
                        <h3 className="text-lg font-semibold text-foreground">
                          No matching messages
                        </h3>
                        <p className="mb-4 mt-1 text-sm text-muted-foreground">
                          Try changing your search or clearing filters.
                        </p>
                        <Button variant="outline" onClick={resetFilters}>
                          <X className="mr-2 h-4 w-4" />
                          Reset Filters
                        </Button>
                      </div>
                    ) : (
                      <DemoTable
                        table={table}
                        tableHeight="h-[calc(100vh-380px)]"
                      />
                    )}
                    <CustomPagination
                      meta={meta || { total: 0, currentPage: 0 }}
                      handleNextPage={setNextPage}
                      handlePrevPage={setPrevPage}
                      handlePageSizeChange={setPerPage}
                      currentPage={pagination.page}
                      perPage={pagination.perPage}
                      total={meta?.total}
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
}
