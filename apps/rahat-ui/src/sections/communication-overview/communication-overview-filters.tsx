'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import {
  useProjectList,
  CommunicationActivityItem,
  Project,
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

    const [knownPhasesByProject, setKnownPhasesByProject] = useState<
      Record<string, string[]>
    >({});

    useEffect(() => {
      if (!activities || activities.length === 0) return;
      setKnownPhasesByProject((prev) => {
        let changed = false;
        const next = { ...prev };

        for (const act of activities) {
          if (!act.phase || act.phase.toUpperCase() === 'N/A' || !act.phase.trim()) continue;
          const projKey = act.projectId || 'all';
          const currentList = next[projKey] || [];
          if (!currentList.includes(act.phase)) {
            next[projKey] = [...currentList, act.phase].sort();
            changed = true;
          }
          const globalList = next['all'] || [];
          if (!globalList.includes(act.phase)) {
            next['all'] = [...globalList, act.phase].sort();
            changed = true;
          }
        }

        return changed ? next : prev;
      });
    }, [activities]);

    const channelOptions = useMemo(
      () => [
        { label: t('ALL_CHANNELS'), value: 'all' },
        { label: t('SMS'), value: 'SMS' },
        { label: t('VOICE_IVR'), value: 'VOICE' },
        { label: t('EMAIL'), value: 'EMAIL' },
      ],
      [t],
    );

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
      const activeProjectKey =
        filters.project && filters.project !== 'all' ? filters.project : 'all';
      const rememberedPhases = knownPhasesByProject[activeProjectKey] || [];

      const currentPhases = (activities || [])
        .filter((a) =>
          activeProjectKey === 'all' ? true : a.projectId === activeProjectKey,
        )
        .map((a) => a.phase)
        .filter(
          (p): p is string =>
            typeof p === 'string' &&
            p.length > 0 &&
            p.toUpperCase() !== 'N/A' &&
            p.trim() !== '',
        );

      const unique = Array.from(
        new Set([...rememberedPhases, ...currentPhases]),
      ).sort();

      return [
        { label: t('ALL_PHASES'), value: 'all' },
        ...unique.map((p) => ({
          label: p,
          value: p,
        })),
      ];
    }, [activities, filters.project, knownPhasesByProject, t]);

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
            onValueChange={(val) => updateFilter('recipient', val)}
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
