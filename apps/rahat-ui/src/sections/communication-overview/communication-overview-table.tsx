'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@rahat-ui/shadcn/src/components/ui/card';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { DemoTable, SearchInput, CustomPagination } from 'apps/rahat-ui/src/common';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';
import { CommunicationActivityItem, classifyTransportString } from '@rahat-ui/query';
import { CommunicationStatusBadge } from '../projects/aa-2/communications/components/communication-status-badge';
import { CommunicationChannelIcon } from '../projects/aa-2/communications/components/communication-channel-icon';
import { CommunicationTooltip } from '../projects/aa-2/communications/components/communication-tooltip';
import { Calendar, AlertTriangle } from 'lucide-react';

const CHANNEL_T_KEYS: Record<string, string> = {
  VOICE: 'VOICE',
  EMAIL: 'EMAIL',
  WHATSAPP: 'WHATSAPP',
  SMS: 'SMS',
};

type CommunicationOverviewTableProps = {
  activities?: CommunicationActivityItem[];
  isLoading?: boolean;
};

export const CommunicationOverviewTable = React.memo(
  function CommunicationOverviewTable({
    activities = [],
    isLoading = false,
  }: CommunicationOverviewTableProps) {
    const t = useTranslations('USAGE');
    const formatDate = useDateFormat();
    const formatNum = useNumberFormat();

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const filteredData = useMemo(() => {
      if (!searchTerm.trim()) return activities;
      const q = searchTerm.toLowerCase();
      return activities.filter((item) =>
        [
          item.title,
          item.projectName,
          item.channel,
          item.transportName,
          item.recipientType,
          item.groupName,
          item.phase,
          item.status,
          item.failReason,
        ].some((field) => field && field.toLowerCase().includes(q)),
      );
    }, [activities, searchTerm]);

    const totalPages = Math.ceil(filteredData.length / perPage) || 1;

    useEffect(() => {
      if (currentPage > totalPages) {
        setCurrentPage(1);
      }
    }, [currentPage, totalPages]);

    const paginatedData = useMemo(() => {
      const start = (currentPage - 1) * perPage;
      return filteredData.slice(start, start + perPage);
    }, [filteredData, currentPage, perPage]);

    const handleSearchChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
      },
      [],
    );

    const handleNextPage = React.useCallback(() => {
      setCurrentPage((p) => Math.min(p + 1, totalPages));
    }, [totalPages]);

    const handlePrevPage = React.useCallback(() => {
      setCurrentPage((p) => Math.max(p - 1, 1));
    }, []);

    const handlePageSizeChange = React.useCallback((size: string | number) => {
      setPerPage(Number(size));
      setCurrentPage(1);
    }, []);

    const columns = useMemo<ColumnDef<CommunicationActivityItem>[]>(
      () => [
        {
          accessorKey: 'title',
          header: t('COMMUNICATION'),
          meta: { className: 'w-[260px]' },
          cell: ({ row }) => (
            <div className="py-1 min-w-0 pr-2">
              <span
                className="block font-semibold text-xs text-foreground truncate cursor-default"
                title={row.original.title}
              >
                {row.original.title}
              </span>
              {row.original.groupName && row.original.groupName !== 'General' && (
                <span
                  className="block text-[11px] text-muted-foreground truncate cursor-default"
                  title={row.original.groupName}
                >
                  {row.original.groupName}
                </span>
              )}
            </div>
          ),
        },
        {
          accessorKey: 'projectName',
          header: t('PROJECT'),
          meta: { className: 'w-[180px]' },
          cell: ({ row }) => {
            const name = row.original.projectName || t('ALL_PROJECTS');
            return (
              <span
                className="text-xs font-medium text-foreground truncate block cursor-default"
                title={name}
              >
                {name}
              </span>
            );
          },
        },
        {
          accessorKey: 'channel',
          header: t('CHANNEL_TRANSPORT'),
          meta: { className: 'w-[140px]' },
          cell: ({ row }) => {
            const ch = row.original.channel || 'SMS';
            const transport = row.original.transportName;
            const canonical = classifyTransportString(ch);
            const displayChannel = CHANNEL_T_KEYS[canonical] ? t(CHANNEL_T_KEYS[canonical]) : ch;

            return (
              <div className="flex items-center gap-2 whitespace-nowrap">
                <CommunicationChannelIcon
                  channel={ch}
                  className="w-4 h-4 text-muted-foreground shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-foreground">
                    {displayChannel}
                  </span>
                  {transport &&
                    transport.toUpperCase() !== displayChannel.toUpperCase() && (
                      <span
                        className="text-[10px] text-muted-foreground font-medium truncate max-w-[110px]"
                        title={transport}
                      >
                        {transport}
                      </span>
                    )}
                </div>
              </div>
            );
          },
        },
        {
          accessorKey: 'recipientType',
          header: t('TARGET_AUDIENCE'),
          meta: { className: 'w-[130px]' },
          cell: ({ row }) => {
            const isBen = row.original.recipientType === 'BENEFICIARY';
            return (
              <Badge
                variant={isBen ? 'secondary' : 'outline'}
                className="text-[10px] font-medium px-2 py-0.5 rounded"
              >
                {isBen ? t('BENEFICIARY') : t('STAKEHOLDER')}
              </Badge>
            );
          },
        },
        {
          accessorKey: 'phase',
          header: t('PHASE'),
          meta: { className: 'w-[110px]' },
          cell: ({ row }) => (
            <span className="text-xs text-muted-foreground font-medium uppercase">
              {row.original.phase || 'N/A'}
            </span>
          ),
        },
        {
          accessorKey: 'date',
          header: t('DATE'),
          meta: { className: 'w-[150px]' },
          cell: ({ row }) => (
            <span className="text-xs text-muted-foreground whitespace-nowrap block">
              {formatDate(row.original.date, 'MMM d, yyyy, h:mm a') ||
                row.original.date}
            </span>
          ),
        },
        {
          accessorKey: 'status',
          header: t('STATUS'),
          meta: { className: 'w-[130px]' },
          cell: ({ row }) => (
            <div className="space-y-1">
              <CommunicationStatusBadge
                status={row.original.status || 'COMPLETED'}
              />
              {row.original.status === 'FAILED' && row.original.failReason && (
                <CommunicationTooltip content={row.original.failReason}>
                  <div className="flex items-center gap-1 text-[10px] text-red-600 font-medium cursor-help">
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                    <span className="truncate max-w-[120px]">
                      {row.original.failReason}
                    </span>
                  </div>
                </CommunicationTooltip>
              )}
            </div>
          ),
        },
      ],
      [formatDate, t],
    );

    const table = useReactTable({
      data: paginatedData,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });

    return (
      <Card className="bg-card border rounded-lg shadow-sm w-full max-w-full min-w-0 overflow-hidden">
        <CardHeader className="p-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <Calendar className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-semibold text-foreground whitespace-nowrap">
              {t('COMMUNICATION_ACTIVITIES')} ({formatNum(filteredData.length)})
            </CardTitle>
          </div>

          <div className="flex-1 flex items-center justify-end w-full min-w-0 max-w-sm">
            <SearchInput
              className="w-full"
              name="search-activities"
              placeholder={t('SEARCH_ACTIVITIES_PLACEHOLDER')}
              value={searchTerm}
              onSearch={handleSearchChange}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0 w-full max-w-full min-w-0 overflow-hidden">
          <div className="w-full max-w-full min-w-0 overflow-x-auto">
            <DemoTable
              table={table}
              loading={isLoading}
              message={t('NO_ACTIVITIES_FOUND')}
              fixedLayout={false}
            />
          </div>

          <div className="p-3 border-t">
            <CustomPagination
              currentPage={currentPage}
              perPage={perPage}
              total={filteredData.length}
              meta={{
                total: filteredData.length,
                lastPage: totalPages,
                currentPage,
                perPage,
                prev: currentPage > 1 ? currentPage - 1 : null,
                next: currentPage < totalPages ? currentPage + 1 : null,
              }}
              handleNextPage={handleNextPage}
              handlePrevPage={handlePrevPage}
              handlePageSizeChange={handlePageSizeChange}
            />
          </div>
        </CardContent>
      </Card>
    );
  });

export default CommunicationOverviewTable;
