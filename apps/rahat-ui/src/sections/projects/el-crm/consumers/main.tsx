'use client';

import React from 'react';
import { Card, CardContent } from '@rahat-ui/shadcn/components/card';
import { Input } from '@rahat-ui/shadcn/components/input';
import DemoTable from 'apps/rahat-ui/src/components/table';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useConsumersTableColumn } from './useConsumersTableColumn';
import {
  Search,
  Users,
  CheckCircle,
  XCircle,
  CalendarCheck,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import {
  useConsumers,
  usePagination,
  useSyncLegacyImported,
} from '@rahat-ui/query';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import { useDebounce } from 'apps/rahat-ui/src/utils/useDebouncehooks';
import { toast } from 'react-toastify';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

export default function ConsumersView() {
  const { id: projectUUID } = useParams() as { id: UUID };

  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setFilters,
    filters,
  } = usePagination();

  const debouncedFilters = useDebounce(filters, 1000);

  const { consumers, meta, isLoading } = useConsumers(projectUUID, {
    ...debouncedFilters,
    ...pagination,
  });

  const { mutateAsync: syncLegacyImport, isPending: isSyncingLegacy } =
    useSyncLegacyImported(projectUUID);

  const handleSyncLegacyImport = async () => {
    const shouldSync = window.confirm(
      'Sync legacy beneficiaries now? This may take a while based on source data size.',
    );
    if (!shouldSync) return;

    try {
      const result = await syncLegacyImport();
      if (result?.status === 'completed') {
        toast.success(
          `Legacy sync complete. Fetched ${result.fetched || 0}, inserted ${
            result.inserted || 0
          }.`,
        );
        return;
      }
      toast.info(
        result?.reason
          ? `Legacy sync skipped: ${result.reason}`
          : 'Legacy sync skipped.',
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to sync legacy beneficiaries.';
      toast.error(message);
    }
  };

  const handleFilter = React.useCallback(
    (key: string, value: any) => {
      if (value === 'all') {
        setFilters({ ...filters, [key]: null });
        return;
      }
      setFilters({ ...filters, [key]: value });
    },
    [filters],
  );

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
      setFilters({ ...filters, [key]: event.target.value });
    },
    [filters],
  );

  const activeFilterCount = React.useMemo(() => {
    if (!filters) return 0;
    return Object.values(filters as Record<string, any>).filter(
      (v) => v !== null && v !== undefined && v !== '',
    ).length;
  }, [filters]);

  const totalConsumers = meta?.total ?? 0;
  const messageDeliverySuccessful = 0;
  const messageDeliveryFailed = 0;
  const consumersCompleting1Year = 0;

  const statCards = [
    {
      title: 'Total Consumers',
      value: totalConsumers,
      icon: Users,
      color: 'text-foreground',
      bgColor: 'bg-primary/5',
      iconColor: 'text-primary',
      tooltip: 'Total number of consumers enrolled in the program',
    },
    {
      title: 'Delivery Successful',
      value: messageDeliverySuccessful,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/5',
      iconColor: 'text-success',
      tooltip: 'Messages successfully delivered to consumers',
    },
    {
      title: 'Delivery Failed',
      value: messageDeliveryFailed,
      icon: XCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/5',
      iconColor: 'text-destructive',
      tooltip: 'Messages that failed to deliver to consumers',
    },
    {
      title: 'Completing 1 Year',
      value: consumersCompleting1Year,
      icon: CalendarCheck,
      color: 'text-primary',
      bgColor: 'bg-primary/5',
      iconColor: 'text-primary',
      tooltip: 'Consumers who have completed 1 year in the program',
    },
  ];

  const columns = useConsumersTableColumn();
  const table = useReactTable({
    manualPagination: true,
    data: consumers || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full">
        {/* Page Header */}
        <div className="border-b border-border bg-card px-6 py-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Consumers
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track consumer engagement and program completion
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="p-0"
                aria-label="More actions"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleSyncLegacyImport}
                disabled={isSyncingLegacy}
              >
                {isSyncingLegacy ? 'Syncing...' : 'Sync Legacy'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex-1 p-6 space-y-6 overflow-auto">
          {/* Stats Grid */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <Card
                key={stat.title}
                className="relative overflow-hidden transition-shadow hover:shadow-md"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                      <p className="text-sm font-medium text-muted-foreground leading-none">
                        {stat.title}
                      </p>
                      <p
                        className={`text-3xl font-bold tracking-tight ${stat.color}`}
                      >
                        {stat.value}
                      </p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={`rounded-lg p-2.5 ${stat.bgColor}`}>
                          <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p className="max-w-[220px]">{stat.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Consumer Table Card */}
          <Card className="flex flex-col">
            {/* Filter Bar */}
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
                    onClick={() => setFilters({})}
                    className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear all
                  </Button>
                )}
              </div>

              <div className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[180px] max-w-sm space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Search
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or phone..."
                      value={filters?.name || ''}
                      onChange={(e) => handleSearch(e, 'name')}
                      className="pl-8 h-9 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Active Filter Tags */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">
                    Showing {meta?.total ?? 0} consumer
                    {(meta?.total ?? 0) === 1 ? '' : 's'} for:
                  </span>
                  {filters?.name && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground">
                      Name: {filters.name}
                      <button
                        type="button"
                        onClick={() => handleFilter('name', 'all')}
                        className="ml-0.5 rounded-sm hover:bg-muted-foreground/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Table */}
            <CardContent className="p-0">
              <DemoTable
                table={table}
                tableHeight="h-[calc(100vh-530px)]"
                loading={isLoading}
              />
              <CustomPagination
                meta={meta}
                handleNextPage={setNextPage}
                handlePrevPage={setPrevPage}
                handlePageSizeChange={setPerPage}
                currentPage={pagination.page}
                perPage={pagination.perPage}
                total={meta.total}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
