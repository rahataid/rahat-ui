'use client';

import React, { useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import {
  useProjectList,
  useListAllTransports,
  CommunicationActivityItem,
  Project,
  classifyTransportString,
} from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { DatePicker } from '../../components/datePicker';

export type CommunicationOverviewFilterState = {
  project?: string;
  fromDate?: Date;
  toDate?: Date;
  channel?: string;
  recipient?: string;
  phase?: string;
  status?: string;
};

export type CommunicationLogsFilterState = CommunicationOverviewFilterState;

type CommunicationOverviewFiltersProps = {
  filters: CommunicationOverviewFilterState;
  onFilterChange: (filters: CommunicationOverviewFilterState) => void;
  onReset: () => void;
  activities?: CommunicationActivityItem[];
};

const CommunicationOverviewFilters = React.memo(
  function CommunicationOverviewFilters({
    filters,
    onFilterChange,
    onReset,
    activities,
  }: CommunicationOverviewFiltersProps) {
    const t = useTranslations('USAGE');
    const { data: projects } = useProjectList();
    const appTransports = useListAllTransports();

    const channelOptions = useMemo(() => {
      const CHANNEL_LABEL_KEYS: Record<string, string> = {
        VOICE: 'VOICE_IVR',
        EMAIL: 'EMAIL',
        SMS: 'SMS',
        WHATSAPP: 'WHATSAPP',
      };

      const getChannelLabel = (raw: string) => {
        const canonical = classifyTransportString(raw);
        const key = CHANNEL_LABEL_KEYS[canonical];
        return key ? t(key) : raw;
      };

      const seen = new Set<string>();
      const options: { label: string; value: string }[] = [
        { label: t('ALL_CHANNELS'), value: 'all' },
      ];

      const addChannel = (rawName: string) => {
        const trimmed = rawName.trim();
        if (!trimmed) return;
        const canonical = classifyTransportString(trimmed);
        if (seen.has(canonical)) return;
        seen.add(canonical);
        options.push({ label: getChannelLabel(trimmed), value: canonical });
      };

      if (Array.isArray(appTransports)) {
        appTransports.forEach((transport) => {
          if (transport) addChannel(transport.name || transport.type || '');
        });
      }

      if (Array.isArray(activities)) {
        activities.forEach((act) => {
          addChannel(act.transportName || act.channel || '');
        });
      }

      if (options.length === 1) {
        return [
          { label: t('ALL_CHANNELS'), value: 'all' },
          ...Object.entries(CHANNEL_LABEL_KEYS).map(([value, key]) => ({
            label: t(key),
            value,
          })),
        ];
      }

      return options;
    }, [appTransports, activities, t]);

    const recipientOptions = useMemo(
      () => [
        { label: t('ALL_RECIPIENTS'), value: 'all' },
        { label: t('BENEFICIARY'), value: 'BENEFICIARY' },
        { label: t('STAKEHOLDER'), value: 'STAKEHOLDER' },
      ],
      [t],
    );

    const projectList = useMemo(
      () =>
        (projects?.data ?? []).filter((p: Project) => Boolean(p.uuid)),
      [projects?.data],
    );

    const availablePhases = useMemo(() => {
      const list = activities || [];
      let relevant = list;
      if (filters.project) {
        relevant = relevant.filter((a) => a.projectId === filters.project);
      }
      if (filters.recipient && filters.recipient !== 'all') {
        const rc = filters.recipient.toUpperCase();
        relevant = relevant.filter((a) => (a.recipientType || '').toUpperCase() === rc);
      }
      if (filters.channel && filters.channel !== 'all') {
        relevant = relevant.filter((a) =>
          classifyTransportString(a.channel) === classifyTransportString(filters.channel!),
        );
      }

      const unique = Array.from(
        new Set(
          relevant
            .map((a) => a.phase)
            .filter(
              (p): p is string =>
                typeof p === 'string' && p.length > 0 && p !== 'N/A' && p.trim() !== '',
            ),
        ),
      ).sort();

      return [
        { label: t('ALL_PHASES'), value: 'all' },
        ...unique.map((p) => ({
          label: p,
          value: p,
        })),
      ];
    }, [activities, filters.project, filters.recipient, filters.channel, t]);

    const updateFilter = useCallback(
      <K extends keyof CommunicationOverviewFilterState>(
        key: K,
        value: CommunicationOverviewFilterState[K],
        extra?: Partial<CommunicationOverviewFilterState>,
      ) => {
        onFilterChange({
          ...filters,
          [key]: value === 'all' ? undefined : value,
          ...extra,
        });
      },
      [filters, onFilterChange],
    );

    const handleClearDates = useCallback(() => {
      onFilterChange({
        ...filters,
        fromDate: undefined,
        toDate: undefined,
      });
    }, [filters, onFilterChange]);

    const hasDateSelected = Boolean(filters.fromDate || filters.toDate);

    const hasActiveFilters = Boolean(
      filters.project ||
        filters.fromDate ||
        filters.toDate ||
        filters.channel ||
        filters.recipient ||
        filters.phase,
    );

    const selectedChannelValue = useMemo(() => {
      if (!filters.channel || filters.channel === 'all') return 'all';
      const match = channelOptions.find(
        (opt) => opt.value.toUpperCase() === filters.channel?.toUpperCase(),
      );
      return match ? match.value : filters.channel;
    }, [filters.channel, channelOptions]);

    return (
      <div className="flex flex-wrap items-center xl:justify-end gap-2 sm:gap-2.5 max-w-full min-w-0">
        <div className="w-[150px] sm:w-[170px] shrink-0">
          <Select
            value={filters.project ?? 'all'}
            onValueChange={(val) => updateFilter('project', val, { phase: undefined })}
          >
            <SelectTrigger className="w-full h-9 text-xs sm:text-sm">
              <SelectValue placeholder={t('ALL_PROJECTS')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('ALL_PROJECTS')}</SelectItem>
              {projectList.map((project: Project) => (
                <SelectItem key={project.uuid} value={project.uuid as string}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <DatePicker
            placeholder={t('FROM')}
            type="from"
            handleDateChange={(date?: Date) => updateFilter('fromDate', date)}
            selectedDate={filters.fromDate}
            maxDate={filters.toDate}
            className="w-[125px] sm:w-[135px] h-9 text-xs sm:text-sm"
          />
          <span className="text-muted-foreground text-xs sm:text-sm shrink-0">{t('TO')}</span>
          <DatePicker
            placeholder={t('TO')}
            type="to"
            handleDateChange={(date?: Date) => updateFilter('toDate', date)}
            selectedDate={filters.toDate}
            minDate={filters.fromDate}
            className="w-[125px] sm:w-[135px] h-9 text-xs sm:text-sm"
          />
          {hasDateSelected && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearDates}
              className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
              title={t('CLEAR_DATE_RANGE')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="w-[135px] sm:w-[150px] shrink-0">
          <Select
            value={selectedChannelValue}
            onValueChange={(val) => updateFilter('channel', val)}
          >
            <SelectTrigger className="w-full h-9 text-xs sm:text-sm">
              <SelectValue placeholder={t('ALL_CHANNELS')} />
            </SelectTrigger>
            <SelectContent>
              {channelOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-[130px] sm:w-[140px] shrink-0">
          <Select
            value={filters.recipient ?? 'all'}
            onValueChange={(val) => updateFilter('recipient', val, { phase: undefined })}
          >
            <SelectTrigger className="w-full h-9 text-xs sm:text-sm">
              <SelectValue placeholder={t('ALL_RECIPIENTS')} />
            </SelectTrigger>
            <SelectContent>
              {recipientOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-[120px] sm:w-[130px] shrink-0">
          <Select
            value={filters.phase ?? 'all'}
            onValueChange={(val) => updateFilter('phase', val)}
          >
            <SelectTrigger className="w-full h-9 text-xs sm:text-sm">
              <SelectValue placeholder={t('ALL_PHASES')} />
            </SelectTrigger>
            <SelectContent>
              {availablePhases.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="h-9 px-3 text-xs sm:text-sm text-muted-foreground hover:text-foreground shrink-0 gap-1.5"
            title={t('RESET_ALL_FILTERS')}
          >
            <X className="h-4 w-4" />
            <span>{t('RESET')}</span>
          </Button>
        )}
      </div>
    );
  },
);

CommunicationOverviewFilters.displayName = 'CommunicationOverviewFilters';

export default CommunicationOverviewFilters;
