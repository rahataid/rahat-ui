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
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
import {
  CommunicationActivityItem,
  classifyTransportString,
  capitalizeFirstLetter,
} from '@rahat-ui/query';
import { CommunicationStatusBadge } from '../projects/aa-2/communications/components/communication-status-badge';
import { CommunicationChannelIcon } from '../projects/aa-2/communications/components/communication-channel-icon';
import { CommunicationTooltip } from '../projects/aa-2/communications/components/communication-tooltip';
import { getPhaseColor } from 'apps/rahat-ui/src/utils/getPhaseColor';
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
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  meta?: {
    total?: number;
    lastPage?: number;
    currentPage?: number;
    perPage?: number;
    prev?: number | null;
    next?: number | null;
  } | null;
  page?: number;
  perPage?: number;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
};

export const CommunicationOverviewTable = React.memo(
  function CommunicationOverviewTable({
    activities = [],
    isLoading = false,
    searchTerm: externalSearchTerm,
    onSearchChange,
    meta,
    page: externalPage,
    perPage: externalPerPage,
    onPageChange,
    onPerPageChange,
  }: CommunicationOverviewTableProps) {
    const t = useTranslations('USAGE');
    const formatDate = useDateFormat();

    const [internalSearchTerm, setInternalSearchTerm] = useState('');
    const searchTerm =
      externalSearchTerm !== undefined
        ? externalSearchTerm
        : internalSearchTerm;
    const [internalPage, setInternalPage] = useState(1);
    const [internalPerPage, setInternalPerPage] = useState(10);

    const isServerPaginated = Boolean(meta);
    const currentPage = isServerPaginated ? (externalPage ?? 1) : internalPage;
    const perPage = isServerPaginated ? (externalPerPage ?? 10) : internalPerPage;

    const filteredData = useMemo(() => {
      if (isServerPaginated) return activities;
      const q = searchTerm.trim().toLowerCase();
      if (!q) return activities;
      const tokens = q.split(/\s+/).filter(Boolean);
      return activities.filter((item) =>
        tokens.every((token) =>
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
          ].some((field) => field && field.toLowerCase().includes(token)),
        ),
      );
    }, [activities, searchTerm, isServerPaginated]);

    const totalPages = isServerPaginated
      ? meta?.lastPage || 1
      : Math.ceil(filteredData.length / perPage) || 1;
    const totalItems = isServerPaginated
      ? meta?.total ?? activities.length
      : filteredData.length;

    useEffect(() => {
      if (!isServerPaginated && internalPage > totalPages) {
        setInternalPage(1);
      }
    }, [isServerPaginated, internalPage, totalPages]);

    const tableData = useMemo(() => {
      if (isServerPaginated) return activities;
      const start = (currentPage - 1) * perPage;
      return filteredData.slice(start, start + perPage);
    }, [isServerPaginated, activities, filteredData, currentPage, perPage]);

    const handleSearchChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (onSearchChange) {
          onSearchChange(val);
        } else {
          setInternalSearchTerm(val);
          setInternalPage(1);
        }
      },
      [onSearchChange],
    );

    const handleNextPage = React.useCallback(() => {
      if (isServerPaginated) {
        if (currentPage < totalPages && onPageChange) {
          onPageChange(currentPage + 1);
        }
      } else {
        setInternalPage((p) => Math.min(p + 1, totalPages));
      }
    }, [isServerPaginated, currentPage, totalPages, onPageChange]);

    const handlePrevPage = React.useCallback(() => {
      if (isServerPaginated) {
        if (currentPage > 1 && onPageChange) {
          onPageChange(currentPage - 1);
        }
      } else {
        setInternalPage((p) => Math.max(p - 1, 1));
      }
    }, [isServerPaginated, currentPage, onPageChange]);

    const handleSetPagination = React.useCallback(
      (updater: unknown) => {
        if (isServerPaginated) {
          if (onPageChange) {
            const nextVal = typeof updater === 'function' ? updater({ page: currentPage }) : updater;
            if (typeof nextVal?.page === 'number') onPageChange(nextVal.page);
          }
        } else {
          setInternalPage((prev) => {
            const nextVal = typeof updater === 'function' ? updater({ page: prev }) : updater;
            return typeof nextVal?.page === 'number' ? nextVal.page : prev;
          });
        }
      },
      [isServerPaginated, currentPage, onPageChange],
    );

    const handlePageSizeChange = React.useCallback(
      (size: string | number) => {
        const nextSize = Number(size);
        if (isServerPaginated) {
          if (onPerPageChange) onPerPageChange(nextSize);
        } else {
          setInternalPerPage(nextSize);
          setInternalPage(1);
        }
      },
      [isServerPaginated, onPerPageChange],
    );

    const columns = useMemo<ColumnDef<CommunicationActivityItem>[]>(
      () => [
        {
          accessorKey: 'title',
          header: t('COMMUNICATION'),
          meta: { className: 'w-[240px]' },
          cell: ({ row }) => {
            const displayTitle = capitalizeFirstLetter(row.original.title) || '-';
            return (
              <div className="py-1 min-w-0 pr-2 max-w-[220px] 2xl:max-w-[260px]">
                <CommunicationTooltip content={displayTitle}>
                  <span
                    className="block font-semibold text-xs text-foreground truncate cursor-default max-w-full"
                    title={displayTitle}
                  >
                    {displayTitle}
                  </span>
                </CommunicationTooltip>
              </div>
            );
          },
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
            const displayChannel = translateValue(t, canonical, {
              fallback: CHANNEL_T_KEYS[canonical] ? t(CHANNEL_T_KEYS[canonical]) : ch,
            });
            const isCustomTransport =
              typeof transport === 'string' &&
              transport.trim().length > 0 &&
              transport.toUpperCase().trim() !== canonical &&
              transport.toUpperCase().trim() !== ch.toUpperCase().trim();

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
                  {isCustomTransport && (
                    <span
                      className="text-[10px] text-muted-foreground font-medium truncate max-w-[110px]"
                      title={transport}
                    >
                      {translateValue(t, transport, {
                        fallback: capitalizeFirstLetter(transport),
                      })}
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
          meta: { className: 'w-[140px]' },
          cell: ({ row }) => {
            const rawType = (row.original.recipientType || '').toUpperCase();
            const hasBen = rawType.includes('BENEFICIARY');
            const hasStk = rawType.includes('STAKEHOLDER');

            return (
              <div className="flex flex-wrap items-center gap-1">
                {hasBen && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-medium px-2 py-0.5 rounded"
                  >
                    {t('BENEFICIARY')}
                  </Badge>
                )}
                {hasStk && (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-medium px-2 py-0.5 rounded"
                  >
                    {t('STAKEHOLDER')}
                  </Badge>
                )}
                {!hasBen && !hasStk && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-medium px-2 py-0.5 rounded"
                  >
                    {capitalizeFirstLetter(row.original.recipientType)}
                  </Badge>
                )}
              </div>
            );
          },
        },
        {
          accessorKey: 'phase',
          header: t('PHASE'),
          meta: { className: 'w-[110px]' },
          cell: ({ row }) => {
            const phase = row.original.phase;
            if (!phase || phase.toUpperCase() === 'N/A') {
              return (
                <span className="text-xs text-muted-foreground font-medium">
                  -
                </span>
              );
            }
            const colorClass = getPhaseColor(phase.toUpperCase());
            return (
              <Badge
                variant="outline"
                className={`text-[10px] font-medium px-2 py-0.5 rounded uppercase ${
                  colorClass || 'text-muted-foreground'
                }`}
              >
                {translateValue(t, `PHASE_${phase.toUpperCase()}`, { fallback: phase })}
              </Badge>
            );
          },
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
                status={row.original.status || 'NOT_STARTED'}
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
      data: tableData,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });

    return (
      <Card className="bg-card border rounded-lg shadow-sm w-full max-w-full min-w-0 overflow-hidden">
        <CardHeader className="p-4 border-b space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-semibold text-foreground whitespace-nowrap">
              {t('COMMUNICATION_ACTIVITIES')}
            </CardTitle>
          </div>

          <SearchInput
            className="w-full"
            name="search-activities"
            placeholder={t('SEARCH_ACTIVITIES_PLACEHOLDER')}
            value={searchTerm}
            onSearch={handleSearchChange}
          />
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
              key={`pagination-${perPage}`}
              currentPage={currentPage}
              perPage={perPage}
              total={totalItems}
              meta={{
                total: totalItems,
                lastPage: totalPages,
                currentPage,
                perPage,
                prev: currentPage > 1 ? currentPage - 1 : null,
                next: currentPage < totalPages ? currentPage + 1 : null,
              }}
              handleNextPage={handleNextPage}
              handlePrevPage={handlePrevPage}
              setPagination={handleSetPagination}
              handlePageSizeChange={handlePageSizeChange}
            />
          </div>
        </CardContent>
      </Card>
    );
  });

export default CommunicationOverviewTable;
