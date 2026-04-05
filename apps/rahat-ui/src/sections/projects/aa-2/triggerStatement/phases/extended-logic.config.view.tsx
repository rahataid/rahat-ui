import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import {
  useConfigureExtendedLogic,
  useSinglePhase,
} from '@rahat-ui/query';
import { Back, Heading, TableLoader } from 'apps/rahat-ui/src/common';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { AlertCircleIcon, Eye, Plus, Settings2, Trash2, X } from 'lucide-react';
import type {
  ExtendedTriggerLogic,
  ExtendedTriggerLogicGroup,
} from '../types/extended-trigger-logic.types';

type TriggerItem = {
  uuid?: string;
  logicKey?: string;
  title?: string;
};

type ExistingTriggerRef =
  | string
  | {
      triggerLogicKey?: string;
      logicKey?: string;
      uuid?: string;
    };

const emptyGroup = (): ExtendedTriggerLogicGroup => ({
  operator: 'AND',
  triggers: [],
});

const getTriggerKey = (trigger: ExistingTriggerRef): string => {
  if (typeof trigger === 'string') return trigger;
  return trigger?.triggerLogicKey || trigger?.logicKey || trigger?.uuid || '';
};

export default function ExtendedLogicConfigView() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;
  const phaseId = params.phaseId as UUID;

  const { data: phase, isLoading, error } = useSinglePhase(projectId, phaseId);
  const configureExtendedLogic = useConfigureExtendedLogic();

  const [groups, setGroups] = React.useState<ExtendedTriggerLogicGroup[]>([]);
  const [joinOperator, setJoinOperator] = React.useState<'AND' | 'OR'>('AND');
  const [validationError, setValidationError] = React.useState<string>('');
  const [initialized, setInitialized] = React.useState(false);
  const [mode, setMode] = React.useState<'configure' | 'view'>('configure');

  // Pre-populate from existing config once phase data loads
  React.useEffect(() => {
    if (phase && !initialized) {
      const existing = phase.extendedTriggerLogic as
        | ExtendedTriggerLogic
        | undefined;
      if (existing && existing.groups?.length > 0) {
        setGroups(
          existing.groups.map((g) => ({
            ...g,
            triggers: (g.triggers || [])
              .map((trigger) => getTriggerKey(trigger as ExistingTriggerRef))
              .filter(Boolean),
          })),
        );
        setJoinOperator(existing.joinOperator || 'AND');
      }
      setInitialized(true);
    }
  }, [phase, initialized]);

  React.useEffect(() => {
    if (phase?.isActive) {
      setMode('view');
    }
  }, [phase?.isActive]);

  const phaseTriggers: TriggerItem[] = phase?.triggers || [];
  const isReadOnly = !!phase?.isActive;

  const getTriggerLabel = React.useCallback(
    (logicKey: string) => {
      const trigger = phaseTriggers.find(
        (item) => (item.logicKey || item.uuid) === logicKey,
      );
      return trigger?.title || logicKey;
    },
    [phaseTriggers],
  );

  const handleAddGroup = () => {
    setGroups((prev) => [...prev, emptyGroup()]);
    setValidationError('');
  };

  const handleRemoveGroup = (index: number) => {
    setGroups((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGroupOperatorChange = (index: number, op: 'AND' | 'OR') => {
    setGroups((prev) =>
      prev.map((g, i) => (i === index ? { ...g, operator: op } : g)),
    );
  };

  const handleToggleTrigger = (groupIndex: number, logicKey: string) => {
    setGroups((prev) =>
      prev.map((g, i) => {
        if (i !== groupIndex) return g;
        const has = g.triggers.includes(logicKey);
        return {
          ...g,
          triggers: has
            ? g.triggers.filter((k) => k !== logicKey)
            : [...g.triggers, logicKey],
        };
      }),
    );
    setValidationError('');
  };

  const handleRemoveTriggerFromGroup = (
    groupIndex: number,
    logicKey: string,
  ) => {
    setGroups((prev) =>
      prev.map((g, i) =>
        i === groupIndex
          ? { ...g, triggers: g.triggers.filter((k) => k !== logicKey) }
          : g,
      ),
    );
  };

  const validate = (): boolean => {
    if (groups.length === 0) {
      setValidationError('Add at least one group.');
      return false;
    }
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].triggers.length === 0) {
        setValidationError(`Group ${i + 1} must have at least one trigger.`);
        return false;
      }
    }
    setValidationError('');
    return true;
  };

  const handleSave = async () => {
    if (isReadOnly) {
      setMode('view');
      return;
    }
    if (!validate()) return;
    const extendedTriggerLogic: ExtendedTriggerLogic = {
      groups,
      joinOperator,
    };

    const payload = {
      uuid: phaseId,
      groups: extendedTriggerLogic.groups.map((group) => ({
        operator: group.operator,
        triggers: group.triggers.map((triggerLogicKey) => ({
          triggerLogicKey,
        })),
      })),
      joinOperator: extendedTriggerLogic.joinOperator,
    };

    await configureExtendedLogic.mutateAsync({
      projectUUID: projectId,
      payload,
    });
    router.push(
      `/projects/aa/${projectId}/trigger-statements/phase/${phaseId}`,
    );
  };

  const handleCancel = () => {
    router.push(
      `/projects/aa/${projectId}/trigger-statements/phase/${phaseId}`,
    );
  };

  if (isLoading) {
    return <TableLoader />;
  }

  if (error) {
    return (
      <div className="p-4 w-full h-full">
        <Back
          path={`/projects/aa/${projectId}/trigger-statements/phase/${phaseId}`}
        />
        <div className="text-gray-400 flex justify-center items-center h-full w-full flex-col gap-3">
          <AlertCircleIcon size={70} />
          <p className="text-xl">
            Data not available at the moment. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Back
        path={`/projects/aa/${projectId}/trigger-statements/phase/${phaseId}`}
      />
      <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <Heading
          title="Configure Extended Trigger Logic"
          description={`Set up grouped AND/OR trigger conditions for ${phase?.name || 'this phase'}`}
        />
        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button
            type="button"
            variant={mode === 'view' ? 'default' : 'outline'}
            className="gap-1.5"
            onClick={() => setMode('view')}
          >
            <Eye className="h-4 w-4" />
            View
          </Button>
          <Button
            type="button"
            variant={mode === 'configure' ? 'default' : 'outline'}
            className="gap-1.5"
            onClick={() => setMode('configure')}
            disabled={isReadOnly}
          >
            <Settings2 className="h-4 w-4" />
            Configure
          </Button>
        </div>
      </div>

      {/* Phase info summary */}
      <div className="mt-4 flex items-center gap-4 rounded-lg border bg-gray-50 px-4 py-3">
        <div>
          <p className="text-sm text-muted-foreground">Phase</p>
          <p className="text-base font-semibold">{phase?.name || 'N/A'}</p>
        </div>
        <div className="h-8 w-px bg-gray-200" />
        <div>
          <p className="text-sm text-muted-foreground">Triggers</p>
          <p className="text-base font-semibold">{phaseTriggers.length}</p>
        </div>
        <div className="h-8 w-px bg-gray-200" />
        <div>
          <p className="text-sm text-muted-foreground">Mandatory</p>
          <p className="text-base font-semibold">
            {phase?.totalMandatoryTriggers ?? 0}
            <span className="text-xs text-muted-foreground font-normal ml-1">
              ({phase?.requiredMandatoryTriggers ?? 0} required)
            </span>
          </p>
        </div>
        <div className="h-8 w-px bg-gray-200" />
        <div>
          <p className="text-sm text-muted-foreground">Optional</p>
          <p className="text-base font-semibold">
            {phase?.totalOptionalTriggers ?? 0}
            <span className="text-xs text-muted-foreground font-normal ml-1">
              ({phase?.requiredOptionalTriggers ?? 0} required)
            </span>
          </p>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-310px)] pr-2 mt-4">
        {mode === 'configure' ? (
          <div className="rounded-xl border p-4 space-y-4">

          {/* Join Operator */}
          {groups.length > 1 && (
            <div className="flex items-center justify-center gap-3">
              <p className="text-sm font-medium">Join groups with:</p>
              <Select
                value={joinOperator}
                onValueChange={(v) => setJoinOperator(v as 'AND' | 'OR')}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AND">AND</SelectItem>
                  <SelectItem value="OR">OR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Groups */}
          {groups.map((group, groupIndex) => {
            const colors = [
              'bg-blue-50 border-blue-200',
              'bg-amber-50 border-amber-200',
              'bg-green-50 border-green-200',
              'bg-purple-50 border-purple-200',
              'bg-rose-50 border-rose-200',
              'bg-teal-50 border-teal-200',
            ];
            const colorClass = colors[groupIndex % colors.length];
            return (
            <div key={groupIndex}>
              <div className={`rounded-lg border p-4 space-y-3 ${colorClass}`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">
                    Group {groupIndex + 1}
                  </p>
                  <div className="flex items-center gap-2">
                    <Select
                      value={group.operator}
                      onValueChange={(v) =>
                        handleGroupOperatorChange(
                          groupIndex,
                          v as 'AND' | 'OR',
                        )
                      }
                    >
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">AND</SelectItem>
                        <SelectItem value="OR">OR</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveGroup(groupIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Select triggers for this group:
                </p>

                {/* Dropdown to add triggers */}
                {phaseTriggers.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <Select
                      onValueChange={(v) => {
                        handleToggleTrigger(groupIndex, v);
                      }}
                      value=""
                    >
                      <SelectTrigger className="flex-1 h-9">
                        <SelectValue placeholder="Choose a trigger to add..." />
                      </SelectTrigger>
                      <SelectContent>
                        {phaseTriggers
                          .filter((trigger) => {
                            const key =
                              trigger.logicKey || trigger.uuid || '';
                            return !group.triggers.includes(key);
                          })
                          .map((trigger) => {
                            const key =
                              trigger.logicKey || trigger.uuid || '';
                            return (
                              <SelectItem key={key} value={key}>
                                <span>{trigger.title || key}</span>
                                {trigger.logicKey && (
                                  <span className="ml-2 text-muted-foreground text-[10px]">
                                    ({trigger.logicKey})
                                  </span>
                                )}
                              </SelectItem>
                            );
                          })}
                        {phaseTriggers.filter((trigger) => {
                          const key = trigger.logicKey || trigger.uuid || '';
                          return !group.triggers.includes(key);
                        }).length === 0 && (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            All triggers added
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">
                    No triggers available in this phase.
                  </p>
                )}

                {/* Selected triggers listed like groups with AND/OR between them */}
                {group.triggers.length > 0 && (
                  <div className="space-y-0 pt-2">
                    {group.triggers.map((logicKey, triggerIndex) => {
                      const t = phaseTriggers.find(
                        (tr) => (tr.logicKey || tr.uuid) === logicKey,
                      );
                      return (
                        <div key={logicKey}>
                          <div className="flex items-center justify-between rounded-md border bg-white px-3 py-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {t?.title || logicKey}
                              </span>
                              {t?.logicKey && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px]"
                                >
                                  {t.logicKey}
                                </Badge>
                              )}
                            </div>
                            <button
                              type="button"
                              className="rounded-full p-1 text-red-400 hover:text-red-600 hover:bg-red-50"
                              onClick={() =>
                                handleRemoveTriggerFromGroup(
                                  groupIndex,
                                  logicKey,
                                )
                              }
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          {triggerIndex < group.triggers.length - 1 && (
                            <div className="flex items-center gap-3 py-3">
                              <div className="flex-1 border-t border-dashed border-gray-300" />
                              <Badge
                                className={`text-xs px-3 py-0.5 shadow-sm border ${
                                  group.operator === 'AND'
                                    ? 'bg-blue-500 text-white border-blue-600'
                                    : 'bg-orange-500 text-white border-orange-600'
                                }`}
                              >
                                {group.operator}
                              </Badge>
                              <div className="flex-1 border-t border-dashed border-gray-300" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {groupIndex < groups.length - 1 && (
                <div className="flex items-center gap-3 py-6">
                  <div className="flex-1 border-t border-dashed border-gray-300" />
                  <Badge
                    className={`text-xs px-3 py-0.5 shadow-sm border ${
                      joinOperator === 'AND'
                        ? 'bg-blue-500 text-white border-blue-600'
                        : 'bg-orange-500 text-white border-orange-600'
                    }`}
                  >
                    {joinOperator}
                  </Badge>
                  <div className="flex-1 border-t border-dashed border-gray-300" />
                </div>
              )}
            </div>
          );
          })}

            {/* Add Group Button */}
            <Button
              variant="outline"
              className="w-full border-dashed border-primary text-primary"
              onClick={handleAddGroup}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Group
            </Button>

            {/* Validation Error */}
            {validationError && (
              <p className="text-sm text-red-500">{validationError}</p>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="w-36"
                onClick={handleCancel}
                disabled={configureExtendedLogic.isPending}
              >
                Cancel
              </Button>
              <Button
                className="w-36"
                onClick={handleSave}
                disabled={configureExtendedLogic.isPending}
              >
                {configureExtendedLogic.isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border bg-slate-50/70 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Logic Graph View</p>
              {groups.length > 1 && (
                <Badge
                  className={
                    joinOperator === 'AND'
                      ? 'bg-blue-600 text-white border-blue-700'
                      : 'bg-orange-500 text-white border-orange-600'
                  }
                >
                  Group Join: {joinOperator}
                </Badge>
              )}
            </div>

            {groups.length === 0 ? (
              <div className="rounded-lg border border-dashed bg-white p-8 text-center text-sm text-muted-foreground">
                No extended trigger logic configured.
              </div>
            ) : (
              <div className="space-y-6">
                {groups.map((group, groupIndex) => {
                  const viewColors = [
                    {
                      group: 'bg-blue-50 border-blue-200',
                      trigger: 'bg-blue-100/80 border-blue-200 text-blue-900',
                    },
                    {
                      group: 'bg-amber-50 border-amber-200',
                      trigger: 'bg-amber-100/80 border-amber-200 text-amber-900',
                    },
                    {
                      group: 'bg-emerald-50 border-emerald-200',
                      trigger:
                        'bg-emerald-100/80 border-emerald-200 text-emerald-900',
                    },
                    {
                      group: 'bg-rose-50 border-rose-200',
                      trigger: 'bg-rose-100/80 border-rose-200 text-rose-900',
                    },
                    {
                      group: 'bg-teal-50 border-teal-200',
                      trigger: 'bg-teal-100/80 border-teal-200 text-teal-900',
                    },
                    {
                      group: 'bg-violet-50 border-violet-200',
                      trigger:
                        'bg-violet-100/80 border-violet-200 text-violet-900',
                    },
                  ];
                  const palette = viewColors[groupIndex % viewColors.length];

                  return (
                  <div key={groupIndex}>
                    <div
                      className={`rounded-lg border p-4 shadow-sm space-y-3 ${palette.group}`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">Group {groupIndex + 1}</p>
                        <Badge
                          className={
                            group.operator === 'AND'
                              ? 'bg-blue-500 text-white border-blue-600'
                              : 'bg-orange-500 text-white border-orange-600'
                          }
                        >
                          Internal: {group.operator}
                        </Badge>
                      </div>

                      {group.triggers.length === 0 ? (
                        <div className="rounded-md border border-dashed bg-white/70 px-3 py-2 text-xs text-muted-foreground">
                          No triggers in this group.
                        </div>
                      ) : (
                        <div className="space-y-2 pt-1">
                          {group.triggers.map((logicKey, triggerIndex) => (
                            <div key={logicKey} className="space-y-2">
                              {triggerIndex > 0 && (
                                <div className="flex items-center gap-3 py-1">
                                  <div className="flex-1 border-t border-dashed border-gray-300" />
                                  <Badge
                                    className={
                                      group.operator === 'AND'
                                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                        : 'bg-orange-100 text-orange-700 border border-orange-300'
                                    }
                                  >
                                    {group.operator}
                                  </Badge>
                                  <div className="flex-1 border-t border-dashed border-gray-300" />
                                </div>
                              )}

                              <div
                                className={`rounded-md border px-3 py-2 text-sm font-medium ${palette.trigger}`}
                              >
                                {getTriggerLabel(logicKey)}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {groupIndex < groups.length - 1 && (
                      <div className="flex items-center gap-3 py-4">
                        <div className="flex-1 border-t border-dashed border-gray-300" />
                        <Badge
                          className={
                            joinOperator === 'AND'
                              ? 'bg-blue-600 text-white border-blue-700'
                              : 'bg-orange-500 text-white border-orange-600'
                          }
                        >
                          {joinOperator}
                        </Badge>
                        <div className="flex-1 border-t border-dashed border-gray-300" />
                      </div>
                    )}
                  </div>
                );
                })}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="w-36"
                onClick={handleCancel}
              >
                Back
              </Button>
              {!isReadOnly && (
                <Button
                  className="w-36"
                  onClick={() => setMode('configure')}
                >
                  Edit Logic
                </Button>
              )}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
