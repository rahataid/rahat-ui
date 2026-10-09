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
import { Back, Heading, NoResult } from 'apps/rahat-ui/src/common';
import { ChevronDown, ChevronRight, Link2, Search, X, Zap } from 'lucide-react';

type SelectableItem = {
  uuid: string;
  title: string;
};

type CommunicationOption = {
  communicationId: string;
  communicationTitle: string;
};

type ActivityItem = SelectableItem & {
  communications: CommunicationOption[];
};

function SelectorPanel({
  icon,
  title,
  items,
  selectedIds,
  onToggle,
  locked,
  searchPlaceholder,
  emptyMessage,
}: {
  icon: React.ReactNode;
  title: string;
  items: SelectableItem[];
  selectedIds: string[];
  onToggle: (uuid: string) => void;
  locked: boolean;
  searchPlaceholder: string;
  emptyMessage: string;
}) {
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        item.title?.toLowerCase().includes(query.toLowerCase()),
      ),
    [items, query],
  );

  const selectedItems = items.filter((item) =>
    selectedIds.includes(item.uuid),
  );

  return (
    <div className="flex-1 rounded-xl border bg-white">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        {icon}
        <p className="font-medium text-sm">{title}</p>
        {selectedItems.length > 0 && (
          <Badge className="ml-auto bg-blue-100 text-blue-700">
            {selectedItems.length}
          </Badge>
        )}
      </div>

      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pt-3">
          {selectedItems.map((item) => (
            <Badge
              key={item.uuid}
              className="bg-blue-50 text-blue-700 font-normal gap-1 pr-1"
            >
              <span className="truncate max-w-[160px]">{item.title}</span>
              {!locked && (
                <X
                  className="w-3 h-3 cursor-pointer hover:text-blue-900"
                  onClick={() => onToggle(item.uuid)}
                />
              )}
            </Badge>
          ))}
        </div>
      )}

      {!locked && (
        <>
          <div className="relative px-4 pt-3">
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9"
            />
          </div>

          <ScrollArea className="h-64 px-4 py-2">
            {filteredItems.length === 0 ? (
              <NoResult message={emptyMessage} size="small" />
            ) : (
              <div className="flex flex-col">
                {filteredItems.map((item) => {
                  const checked = selectedIds.includes(item.uuid);
                  return (
                    <label
                      key={item.uuid}
                      className={`flex items-center gap-3 rounded-md px-2 py-2 cursor-pointer hover:bg-gray-50 ${
                        checked ? 'bg-blue-50' : ''
                      }`}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => onToggle(item.uuid)}
                      />
                      <span className="text-sm truncate">{item.title}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </>
      )}
    </div>
  );
}

function ActivitySelectorPanel({
  items,
  selectedIds,
  onToggle,
  locked,
  searchPlaceholder,
  emptyMessage,
  selectedCommunicationIds,
  onToggleCommunication,
}: {
  items: ActivityItem[];
  selectedIds: string[];
  onToggle: (uuid: string) => void;
  locked: boolean;
  searchPlaceholder: string;
  emptyMessage: string;
  selectedCommunicationIds: Record<string, string[]>;
  onToggleCommunication: (activityId: string, communicationId: string) => void;
}) {
  const t = useTranslations('AA_PROJECT');
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        item.title?.toLowerCase().includes(query.toLowerCase()),
      ),
    [items, query],
  );

  const selectedItems = items.filter((item) =>
    selectedIds.includes(item.uuid),
  );

  return (
    <div className="flex-1 rounded-xl border bg-white">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <Zap className="w-4 h-4 text-green-500 rotate-90" />
        <p className="font-medium text-sm">{t('ACTIVITIES')}</p>
        {selectedItems.length > 0 && (
          <Badge className="ml-auto bg-blue-100 text-blue-700">
            {selectedItems.length}
          </Badge>
        )}
      </div>

      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pt-3">
          {selectedItems.map((item) => {
            const commCount = selectedCommunicationIds[item.uuid]?.length || 0;
            return (
              <Badge
                key={item.uuid}
                className="bg-blue-50 text-blue-700 font-normal gap-1 pr-1"
              >
                <span className="truncate max-w-[160px]">{item.title}</span>
                {commCount > 0 && (
                  <span className="text-[10px] text-blue-500">
                    ({commCount})
                  </span>
                )}
                {!locked && (
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-blue-900"
                    onClick={() => onToggle(item.uuid)}
                  />
                )}
              </Badge>
            );
          })}
        </div>
      )}

      {!locked && (
        <>
          <div className="relative px-4 pt-3">
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9"
            />
          </div>

          <ScrollArea className="h-64 px-4 py-2">
            {filteredItems.length === 0 ? (
              <NoResult message={emptyMessage} size="small" />
            ) : (
              <div className="flex flex-col">
                {filteredItems.map((item) => {
                  const checked = selectedIds.includes(item.uuid);
                  const isExpanded = expandedId === item.uuid;
                  const hasCommunications = item.communications.length > 0;
                  const selectedComms =
                    selectedCommunicationIds[item.uuid] || [];

                  return (
                    <div key={item.uuid}>
                      <label
                        className={`flex items-center gap-2 rounded-md px-2 py-2 cursor-pointer hover:bg-gray-50 ${
                          checked ? 'bg-blue-50' : ''
                        }`}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => {
                            onToggle(item.uuid);
                            if (!checked && hasCommunications) {
                              setExpandedId(item.uuid);
                            }
                            if (checked) {
                              setExpandedId((prev) =>
                                prev === item.uuid ? null : prev,
                              );
                            }
                          }}
                        />
                        <span className="text-sm truncate flex-1">
                          {item.title}
                        </span>
                        {checked && hasCommunications && (
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                              e.preventDefault();
                              setExpandedId((prev) =>
                                prev === item.uuid ? null : item.uuid,
                              );
                            }}
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </label>

                      {checked && hasCommunications && isExpanded && (
                        <div className="ml-7 border-l pl-3 flex flex-col gap-1 py-1">
                          <p className="text-xs text-muted-foreground">
                            {t('SELECT_COMMUNICATIONS_TO_LINK')}
                          </p>
                          {item.communications.map((comm) => {
                            const commChecked = selectedComms.includes(
                              comm.communicationId,
                            );
                            return (
                              <label
                                key={comm.communicationId}
                                className="flex items-center gap-2 py-1 cursor-pointer"
                              >
                                <Checkbox
                                  checked={commChecked}
                                  onCheckedChange={() =>
                                    onToggleCommunication(
                                      item.uuid,
                                      comm.communicationId,
                                    )
                                  }
                                />
                                <span className="text-xs truncate">
                                  {comm.communicationTitle}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
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
  const { activitiesData } = useActivities(projectId as UUID, {
    perPage: 9999,
  });

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

  const triggerItems: SelectableItem[] = useMemo(
    () =>
      triggers
        ?.filter((tr: any) => !alreadyLinkedTriggerIds.includes(tr.uuid))
        .map((tr: any) => ({ uuid: tr.uuid, title: tr.title })) || [],
    [triggers, alreadyLinkedTriggerIds],
  );
  const activityItems: ActivityItem[] = useMemo(
    () =>
      activitiesData
        ?.filter((a: any) => !alreadyLinkedActivityIds.includes(a.id))
        .map((a: any) => ({
          uuid: a.id,
          title: a.title,
          communications: (a.activityCommunication || []).map(
            (comm: any) => ({
              communicationId: comm.communicationId,
              communicationTitle: comm.communicationTitle || comm.subject,
            }),
          ),
        })) || [],
    [activitiesData, alreadyLinkedActivityIds],
  );

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

  const toggleTrigger = (uuid: string) => {
    setSelectedTriggerIds((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid],
    );
  };
  const toggleActivity = (uuid: string) => {
    setSelectedActivityIds((prev) => {
      const next = prev.includes(uuid)
        ? prev.filter((id) => id !== uuid)
        : [...prev, uuid];
      return next;
    });
    setSelectedCommunicationIds((prev) => {
      if (selectedActivityIds.includes(uuid)) {
        // Activity is being unchecked; drop its communication selection.
        const { [uuid]: _removed, ...rest } = prev;
        return rest;
      }
      return prev;
    });
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

  const canSave =
    selectedTriggerIds.length > 0 && selectedActivityIds.length > 0;

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

      <div className="flex items-stretch gap-3 mt-4">
        <SelectorPanel
          icon={<Zap className="w-4 h-4 text-amber-500" />}
          title={t('TRIGGERS')}
          items={triggerItems}
          selectedIds={selectedTriggerIds}
          onToggle={toggleTrigger}
          locked={!!presetTriggerId}
          searchPlaceholder={t('SEARCH_TRIGGERS')}
          emptyMessage={t('NO_TRIGGER_AVAILABLE')}
        />

        <div className="flex items-center justify-center shrink-0">
          <div className="rounded-full border bg-gray-50 p-2">
            <Link2 className="w-5 h-5 text-blue-500" />
          </div>
        </div>

        <ActivitySelectorPanel
          items={activityItems}
          selectedIds={selectedActivityIds}
          onToggle={toggleActivity}
          locked={!!presetActivityId}
          searchPlaceholder={t('SEARCH_ACTIVITIES')}
          emptyMessage={t('NO_ACTIVITY_FOUND')}
          selectedCommunicationIds={selectedCommunicationIds}
          onToggleCommunication={toggleCommunication}
        />
      </div>

      <div className="flex justify-end mt-4">
        <Button
          className="w-40 gap-2"
          disabled={!canSave || createTriggerCallbacks.isPending}
          onClick={handleSave}
        >
          <Link2 className="w-4 h-4" />
          {createTriggerCallbacks.isPending ? tg('SAVING') : tg('SAVE')}
        </Button>
      </div>
    </div>
  );
}
