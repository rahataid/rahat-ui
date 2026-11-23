'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { UUID } from 'crypto';
import {
  useActivities,
  useAATriggerStatements,
  useCreateTriggerCallbacks,
  useSingleActivity,
  useSingleTriggerStatement,
} from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import { cn } from '@rahat-ui/shadcn/src';
import { Back, Heading, NoResult } from 'apps/rahat-ui/src/common';
import {
  ChevronDown,
  ChevronRight,
  Link2,
  Lock,
  MessageSquare,
  Search,
  X,
  Zap,
} from 'lucide-react';

type SelectableItem = {
  uuid: string;
  title: string;
  meta: string[];
};

type CommunicationOption = {
  communicationId: string;
  communicationTitle: string;
};

type ActivityItem = SelectableItem & {
  communications: CommunicationOption[];
};

const TriggerIcon = () => <Zap className="w-4 h-4 text-amber-500" />;
const ActivityIcon = () => <Zap className="w-4 h-4 text-green-500 rotate-90" />;

function ItemMeta({ meta }: { meta: string[] }) {
  if (!meta.length) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {meta.map((m) => (
        <span
          key={m}
          className="rounded-sm bg-gray-100 px-1.5 py-0.5 text-[11px] leading-4 text-gray-600"
        >
          {m}
        </span>
      ))}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-1">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-3/5" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

function PanelHeader({
  icon,
  title,
  selectedCount,
  locked,
}: {
  icon: React.ReactNode;
  title: string;
  selectedCount: number;
  locked: boolean;
}) {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  return (
    <div className="flex items-center gap-2 border-b px-4 py-3">
      {icon}
      <p className="font-medium text-sm">{title}</p>
      {locked ? (
        <Badge className="ml-auto gap-1 bg-gray-100 text-gray-600 font-normal hover:bg-gray-100">
          <Lock className="w-3 h-3" />
          {tg('LOCKED')}
        </Badge>
      ) : (
        selectedCount > 0 && (
          <Badge className="ml-auto bg-blue-100 text-blue-700 font-normal hover:bg-blue-100">
            {t('SELECTED_COUNT', { count: selectedCount })}
          </Badge>
        )
      )}
    </div>
  );
}

function SearchToolbar({
  query,
  onQueryChange,
  placeholder,
  canSelectAll,
  canClear,
  onSelectAll,
  onClear,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  placeholder: string;
  canSelectAll: boolean;
  canClear: boolean;
  onSelectAll: () => void;
  onClear: () => void;
}) {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  return (
    <div className="px-4 pt-3 space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          className="pl-9"
        />
      </div>
      <div className="flex items-center justify-end gap-3 text-xs">
        <button
          type="button"
          className="text-blue-600 hover:underline disabled:text-muted-foreground disabled:no-underline"
          disabled={!canSelectAll}
          onClick={onSelectAll}
        >
          {tg('SELECT_ALL')}
        </button>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground disabled:opacity-50"
          disabled={!canClear}
          onClick={onClear}
        >
          {t('CLEAR_ALL')}
        </button>
      </div>
    </div>
  );
}

function SelectedChips({
  items,
  onRemove,
}: {
  items: SelectableItem[];
  onRemove: (uuid: string) => void;
}) {
  const t = useTranslations('AA_PROJECT');
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 px-4 pt-3">
      {items.map((item) => (
        <Badge
          key={item.uuid}
          className="bg-blue-50 text-blue-700 font-normal gap-1 pr-1 hover:bg-blue-50"
        >
          <span className="truncate max-w-[180px]">{item.title}</span>
          <button
            type="button"
            aria-label={t('REMOVE_SELECTION', { title: item.title })}
            className="rounded-sm p-0.5 hover:bg-blue-100 hover:text-blue-900"
            onClick={() => onRemove(item.uuid)}
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}

function LockedItem({
  icon,
  title,
  meta,
}: {
  icon: React.ReactNode;
  title: string;
  meta: string[];
}) {
  const t = useTranslations('AA_PROJECT');
  return (
    <div className="px-4 pt-3">
      <div className="flex items-start gap-3 rounded-sm border border-blue-200 bg-blue-50/60 p-3">
        <div className="mt-0.5">{icon}</div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{title}</p>
          <ItemMeta meta={meta} />
          <p className="mt-2 text-xs text-muted-foreground">
            {t('PRESELECTED_HINT')}
          </p>
        </div>
      </div>
    </div>
  );
}

function CommunicationPicker({
  communications,
  selected,
  onToggle,
}: {
  communications: CommunicationOption[];
  selected: string[];
  onToggle: (communicationId: string) => void;
}) {
  const t = useTranslations('AA_PROJECT');
  return (
    <div className="ml-6 mt-1 mb-2 border-l-2 border-blue-100 pl-3 flex flex-col gap-0.5">
      <p className="text-xs text-muted-foreground mb-1">
        {t('SELECT_COMMUNICATIONS_TO_LINK')}
      </p>
      {communications.map((comm) => (
        <label
          key={comm.communicationId}
          className="flex items-center gap-2 rounded-sm px-1.5 py-1 cursor-pointer hover:bg-gray-50"
        >
          <Checkbox
            checked={selected.includes(comm.communicationId)}
            onCheckedChange={() => onToggle(comm.communicationId)}
          />
          <MessageSquare className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-xs truncate">{comm.communicationTitle}</span>
        </label>
      ))}
    </div>
  );
}

function CommunicationScope({
  total,
  selected,
}: {
  total: number;
  selected: number;
}) {
  const t = useTranslations('AA_PROJECT');
  if (total === 0) return null;
  return selected === 0 ? (
    <Badge className="bg-gray-100 text-gray-600 text-[11px] font-normal hover:bg-gray-100 flex-shrink-0">
      {t('ALL_COMMUNICATIONS')}
    </Badge>
  ) : (
    <Badge className="bg-blue-100 text-blue-700 text-[11px] font-normal hover:bg-blue-100 flex-shrink-0">
      {t('COMMUNICATIONS_SELECTED', { selected, total })}
    </Badge>
  );
}

function useFiltered<T extends SelectableItem>(items: T[], query: string) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.title?.toLowerCase().includes(q));
  }, [items, query]);
}

function TriggerSelectorPanel({
  items,
  isLoading,
  selectedIds,
  onChange,
  locked,
  lockedItem,
}: {
  items: SelectableItem[];
  isLoading: boolean;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  locked: boolean;
  lockedItem?: SelectableItem;
}) {
  const t = useTranslations('AA_PROJECT');
  const [query, setQuery] = useState('');
  const filteredItems = useFiltered(items, query);
  const selectedItems = items.filter((item) => selectedIds.includes(item.uuid));

  const toggle = (uuid: string) =>
    onChange(
      selectedIds.includes(uuid)
        ? selectedIds.filter((id) => id !== uuid)
        : [...selectedIds, uuid],
    );

  return (
    <div className="flex flex-col rounded-sm border bg-white shadow min-w-0">
      <PanelHeader
        icon={<TriggerIcon />}
        title={t('TRIGGERS')}
        selectedCount={selectedIds.length}
        locked={locked}
      />

      {locked ? (
        <div className="pb-4">
          <LockedItem
            icon={<TriggerIcon />}
            title={lockedItem?.title || ''}
            meta={lockedItem?.meta || []}
          />
        </div>
      ) : (
        <>
          <SelectedChips items={selectedItems} onRemove={toggle} />
          <SearchToolbar
            query={query}
            onQueryChange={setQuery}
            placeholder={t('SEARCH_TRIGGERS')}
            canSelectAll={filteredItems.some(
              (item) => !selectedIds.includes(item.uuid),
            )}
            canClear={selectedIds.length > 0}
            onSelectAll={() =>
              onChange(
                Array.from(
                  new Set([
                    ...selectedIds,
                    ...filteredItems.map((item) => item.uuid),
                  ]),
                ),
              )
            }
            onClear={() => onChange([])}
          />

          {isLoading ? (
            <ListSkeleton />
          ) : (
            <ScrollArea className="h-72 px-4 py-2">
              {filteredItems.length === 0 ? (
                <NoResult
                  message={t('NO_TRIGGER_AVAILABLE')}
                  size="small"
                  className="mt-12"
                />
              ) : (
                <div className="flex flex-col gap-0.5">
                  {filteredItems.map((item) => {
                    const checked = selectedIds.includes(item.uuid);
                    return (
                      <label
                        key={item.uuid}
                        className={cn(
                          'flex items-start gap-3 rounded-sm px-2 py-2 cursor-pointer hover:bg-gray-50',
                          checked && 'bg-blue-50 hover:bg-blue-50',
                        )}
                      >
                        <Checkbox
                          className="mt-0.5"
                          checked={checked}
                          onCheckedChange={() => toggle(item.uuid)}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm truncate">{item.title}</p>
                          <ItemMeta meta={item.meta} />
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          )}
        </>
      )}
    </div>
  );
}

function ActivitySelectorPanel({
  items,
  isLoading,
  selectedIds,
  onChange,
  locked,
  lockedItem,
  selectedCommunicationIds,
  onToggleCommunication,
}: {
  items: ActivityItem[];
  isLoading: boolean;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  locked: boolean;
  lockedItem?: ActivityItem;
  selectedCommunicationIds: Record<string, string[]>;
  onToggleCommunication: (activityId: string, communicationId: string) => void;
}) {
  const t = useTranslations('AA_PROJECT');
  const [query, setQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const filteredItems = useFiltered(items, query);
  const selectedItems = items.filter((item) => selectedIds.includes(item.uuid));

  const toggleExpanded = (uuid: string) =>
    setExpandedIds((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid],
    );

  const toggle = (item: ActivityItem) => {
    const checked = selectedIds.includes(item.uuid);
    onChange(
      checked
        ? selectedIds.filter((id) => id !== item.uuid)
        : [...selectedIds, item.uuid],
    );
    // Open the communication picker on select so the scope choice is visible.
    setExpandedIds((prev) =>
      checked
        ? prev.filter((id) => id !== item.uuid)
        : item.communications.length > 0
        ? [...prev, item.uuid]
        : prev,
    );
  };

  return (
    <div className="flex flex-col rounded-sm border bg-white shadow min-w-0">
      <PanelHeader
        icon={<ActivityIcon />}
        title={t('ACTIVITIES')}
        selectedCount={selectedIds.length}
        locked={locked}
      />

      {locked ? (
        <div className="pb-4">
          <LockedItem
            icon={<ActivityIcon />}
            title={lockedItem?.title || ''}
            meta={lockedItem?.meta || []}
          />
          {lockedItem && lockedItem.communications.length > 0 && (
            <div className="px-4 pt-3">
              <CommunicationPicker
                communications={lockedItem.communications}
                selected={selectedCommunicationIds[lockedItem.uuid] || []}
                onToggle={(commId) =>
                  onToggleCommunication(lockedItem.uuid, commId)
                }
              />
            </div>
          )}
        </div>
      ) : (
        <>
          <SelectedChips
            items={selectedItems}
            onRemove={(uuid) => {
              const item = items.find((i) => i.uuid === uuid);
              if (item) toggle(item);
            }}
          />
          <SearchToolbar
            query={query}
            onQueryChange={setQuery}
            placeholder={t('SEARCH_ACTIVITIES')}
            canSelectAll={filteredItems.some(
              (item) => !selectedIds.includes(item.uuid),
            )}
            canClear={selectedIds.length > 0}
            onSelectAll={() =>
              onChange(
                Array.from(
                  new Set([
                    ...selectedIds,
                    ...filteredItems.map((item) => item.uuid),
                  ]),
                ),
              )
            }
            onClear={() => {
              onChange([]);
              setExpandedIds([]);
            }}
          />

          {isLoading ? (
            <ListSkeleton />
          ) : (
            <ScrollArea className="h-72 px-4 py-2">
              {filteredItems.length === 0 ? (
                <NoResult
                  message={t('NO_ACTIVITY_FOUND')}
                  size="small"
                  className="mt-12"
                />
              ) : (
                <div className="flex flex-col gap-0.5">
                  {filteredItems.map((item) => {
                    const checked = selectedIds.includes(item.uuid);
                    const total = item.communications.length;
                    const selectedComms =
                      selectedCommunicationIds[item.uuid] || [];
                    const isExpanded = checked && expandedIds.includes(item.uuid);

                    return (
                      <div key={item.uuid}>
                        <div
                          className={cn(
                            'flex items-start gap-3 rounded-sm px-2 py-2 hover:bg-gray-50',
                            checked && 'bg-blue-50 hover:bg-blue-50',
                          )}
                        >
                          <label className="flex flex-1 min-w-0 items-start gap-3 cursor-pointer">
                            <Checkbox
                              className="mt-0.5"
                              checked={checked}
                              onCheckedChange={() => toggle(item)}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm truncate">{item.title}</p>
                              <ItemMeta
                                meta={[
                                  ...item.meta,
                                  t('COMMUNICATIONS_COUNT', { count: total }),
                                ]}
                              />
                            </div>
                          </label>
                          {checked && total > 0 && (
                            <button
                              type="button"
                              aria-expanded={isExpanded}
                              className="flex items-center gap-1 rounded-sm px-1 py-0.5 text-muted-foreground hover:text-foreground"
                              onClick={() => toggleExpanded(item.uuid)}
                            >
                              <CommunicationScope
                                total={total}
                                selected={selectedComms.length}
                              />
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>

                        {isExpanded && (
                          <CommunicationPicker
                            communications={item.communications}
                            selected={selectedComms}
                            onToggle={(commId) =>
                              onToggleCommunication(item.uuid, commId)
                            }
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          )}
        </>
      )}
    </div>
  );
}

export default function AddTriggerCallbackView() {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const router = useRouter();
  const { id: projectId } = useParams();
  const searchParams = useSearchParams();
  const presetTriggerId = searchParams.get('triggerId') || '';
  const presetActivityId = searchParams.get('activityId') || '';

  const triggers = useAATriggerStatements(projectId as UUID, {
    perPage: 9999,
  });
  const { activitiesData, isLoading: isActivitiesLoading } = useActivities(
    projectId as UUID,
    { perPage: 9999 },
  );

  // When arriving from a locked side, fetch its detail so already-linked
  // items on the other side can be excluded from the picker.
  const { data: lockedTrigger } = useSingleTriggerStatement(
    projectId as UUID,
    presetTriggerId,
    false,
    !!presetTriggerId,
  );
  const { data: lockedActivity } = useSingleActivity(
    projectId as UUID,
    presetActivityId,
    !!presetActivityId,
  );

  const alreadyLinkedActivityIds: string[] = useMemo(
    () => lockedTrigger?.activities?.map((a: any) => a.uuid) || [],
    [lockedTrigger],
  );
  const alreadyLinkedTriggerIds: string[] = useMemo(
    () =>
      lockedActivity?.triggersCallback?.map((cb: any) => cb.trigger?.uuid) ||
      [],
    [lockedActivity],
  );

  const allTriggerItems: SelectableItem[] = useMemo(
    () =>
      triggers?.map((tr: any) => ({
        uuid: tr.uuid,
        title: tr.title,
        meta: [tr.phase?.name, tr.source].filter(Boolean),
      })) || [],
    [triggers],
  );
  const allActivityItems: ActivityItem[] = useMemo(
    () =>
      activitiesData?.map((a: any) => ({
        uuid: a.id,
        title: a.title,
        meta: [a.phase, a.category].filter(Boolean),
        communications: (a.activityCommunication || []).map((comm: any) => ({
          communicationId: comm.communicationId,
          communicationTitle: comm.communicationTitle || comm.subject,
        })),
      })) || [],
    [activitiesData],
  );

  const triggerItems = useMemo(
    () =>
      allTriggerItems.filter(
        (tr) => !alreadyLinkedTriggerIds.includes(tr.uuid),
      ),
    [allTriggerItems, alreadyLinkedTriggerIds],
  );
  const activityItems = useMemo(
    () =>
      allActivityItems.filter(
        (a) => !alreadyLinkedActivityIds.includes(a.uuid),
      ),
    [allActivityItems, alreadyLinkedActivityIds],
  );

  const lockedTriggerItem: SelectableItem | undefined = presetTriggerId
    ? allTriggerItems.find((tr) => tr.uuid === presetTriggerId) || {
        uuid: presetTriggerId,
        title: lockedTrigger?.title || '',
        meta: [],
      }
    : undefined;
  const lockedActivityItem: ActivityItem | undefined = presetActivityId
    ? allActivityItems.find((a) => a.uuid === presetActivityId) || {
        uuid: presetActivityId,
        title: lockedActivity?.title || '',
        meta: [],
        communications: [],
      }
    : undefined;

  const [selectedTriggerIds, setSelectedTriggerIds] = useState<string[]>(
    presetTriggerId ? [presetTriggerId] : [],
  );
  const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>(
    presetActivityId ? [presetActivityId] : [],
  );
  const [selectedCommunicationIds, setSelectedCommunicationIds] = useState<
    Record<string, string[]>
  >({});

  const createTriggerCallbacks = useCreateTriggerCallbacks();

  const handleActivitiesChange = (ids: string[]) => {
    setSelectedActivityIds(ids);
    // Drop communication choices for activities that are no longer selected.
    setSelectedCommunicationIds((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([activityId]) => ids.includes(activityId)),
      ),
    );
  };
  const toggleCommunication = (activityId: string, communicationId: string) => {
    setSelectedCommunicationIds((prev) => {
      const current = prev[activityId] || [];
      const next = current.includes(communicationId)
        ? current.filter((id) => id !== communicationId)
        : [...current, communicationId];
      return { ...prev, [activityId]: next };
    });
  };

  const linkCount = selectedTriggerIds.length * selectedActivityIds.length;
  const canSave = linkCount > 0;

  const handleSave = async () => {
    const triggerCallbacksPayload = selectedTriggerIds.flatMap((triggerId) =>
      selectedActivityIds.map((activityId) => {
        const communicationIds = selectedCommunicationIds[activityId];
        return {
          triggerId,
          type: 'ACTIVITY_COMMUNICATION',
          config:
            communicationIds && communicationIds.length > 0
              ? { communicationIds }
              : {},
          xref: activityId,
        };
      }),
    );

    try {
      await createTriggerCallbacks.mutateAsync({
        projectUUID: projectId as UUID,
        triggerCallbacksPayload,
      });

      if (presetTriggerId) {
        router.push(
          `/projects/aa/${projectId}/trigger-statements/${presetTriggerId}`,
        );
      } else if (presetActivityId) {
        router.push(`/projects/aa/${projectId}/activities/${presetActivityId}`);
      } else {
        router.back();
      }
    } catch (error) {
      console.error('Error::', error);
    }
  };

  return (
    <div className="p-4">
      <Back />
      <Heading
        title={t('LINK_TRIGGER_TO_ACTIVITY')}
        description={t('SELECT_TRIGGER_AND_ACTIVITY_TO_LINK')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-3 mt-4">
        <TriggerSelectorPanel
          items={triggerItems}
          isLoading={triggers === undefined}
          selectedIds={selectedTriggerIds}
          onChange={setSelectedTriggerIds}
          locked={!!presetTriggerId}
          lockedItem={lockedTriggerItem}
        />

        <div className="flex items-center justify-center lg:self-center">
          <div
            className={cn(
              'rounded-full border p-2 transition-colors',
              canSave ? 'bg-blue-50 border-blue-200' : 'bg-gray-50',
            )}
          >
            <Link2
              className={cn(
                'w-5 h-5 rotate-90 lg:rotate-0',
                canSave ? 'text-blue-500' : 'text-muted-foreground',
              )}
            />
          </div>
        </div>

        <ActivitySelectorPanel
          items={activityItems}
          isLoading={isActivitiesLoading}
          selectedIds={selectedActivityIds}
          onChange={handleActivitiesChange}
          locked={!!presetActivityId}
          lockedItem={lockedActivityItem}
          selectedCommunicationIds={selectedCommunicationIds}
          onToggleCommunication={toggleCommunication}
        />
      </div>

      <div className="sticky bottom-0 mt-4 flex flex-col gap-3 rounded-sm border bg-white p-3 shadow sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0" aria-live="polite">
          {canSave ? (
            <>
              <p className="text-sm font-medium">
                {t('LINKS_TO_CREATE', { count: linkCount })}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('LINK_SUMMARY', {
                  triggers: selectedTriggerIds.length,
                  activities: selectedActivityIds.length,
                })}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t('LINK_SELECTION_HINT')}
            </p>
          )}
        </div>
        <div className="flex gap-2 sm:flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            className="flex-1 sm:w-40 sm:flex-none"
            disabled={createTriggerCallbacks.isPending}
            onClick={() => router.back()}
          >
            {tg('CANCEL')}
          </Button>
          <Button
            type="button"
            className="flex-1 gap-2 sm:w-40 sm:flex-none"
            disabled={!canSave || createTriggerCallbacks.isPending}
            onClick={handleSave}
          >
            <Link2 className="w-4 h-4" />
            {createTriggerCallbacks.isPending
              ? t('LINKING')
              : t('CREATE_LINKS', { count: linkCount })}
          </Button>
        </div>
      </div>
    </div>
  );
}
