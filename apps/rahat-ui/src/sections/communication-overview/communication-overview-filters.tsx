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

    const handleProjectChange = useCallback(
      (val: string) => {
        onFilterChange({
          ...filters,
          project: val === 'all' ? undefined : val,
          phase: undefined,
        });
      },
      [filters, onFilterChange],
    );

    const handleFromDateChange = useCallback(
      (date: Date | undefined) => {
        onFilterChange({
          ...filters,
          fromDate: date,
        });
      },
      [filters, onFilterChange],
    );

    const handleToDateChange = useCallback(
      (date: Date | undefined) => {
        onFilterChange({
          ...filters,
          toDate: date,
        });
      },
      [filters, onFilterChange],
    );

    const handleChannelChange = useCallback(
      (val: string) => {
        onFilterChange({
          ...filters,
          channel: val === 'all' ? undefined : val,
        });
      },
      [filters, onFilterChange],
    );

    const handleRecipientChange = useCallback(
      (val: string) => {
        onFilterChange({
          ...filters,
          recipient: val === 'all' ? undefined : val,
          phase: undefined,
        });
      },
      [filters, onFilterChange],
    );

    const handlePhaseChange = useCallback(
      (val: string) => {
        onFilterChange({
          ...filters,
          phase: val === 'all' ? undefined : val,
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
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full">
        <div className="flex-1 min-w-[160px]">
          <Select
            value={filters.project ?? 'all'}
            onValueChange={handleProjectChange}
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

        <div className="flex-[1.4] min-w-[270px] flex items-center gap-1.5 sm:gap-2">
          <DatePicker
            placeholder={t('FROM')}
            type="from"
            handleDateChange={handleFromDateChange}
            selectedDate={filters.fromDate}
            maxDate={filters.toDate}
            className="w-full flex-1 h-9 text-xs sm:text-sm"
          />
          <span className="text-muted-foreground text-xs sm:text-sm shrink-0">{t('TO')}</span>
          <DatePicker
            placeholder={t('TO')}
            type="to"
            handleDateChange={handleToDateChange}
            selectedDate={filters.toDate}
            minDate={filters.fromDate}
            className="w-full flex-1 h-9 text-xs sm:text-sm"
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

        <div className="flex-1 min-w-[130px]">
          <Select
            value={selectedChannelValue}
            onValueChange={handleChannelChange}
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

        <div className="flex-1 min-w-[130px]">
          <Select
            value={filters.recipient ?? 'all'}
            onValueChange={handleRecipientChange}
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

        <div className="flex-1 min-w-[130px]">
          <Select
            value={filters.phase ?? 'all'}
            onValueChange={handlePhaseChange}
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
            className="h-9 px-2.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground shrink-0 gap-1.5"
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
