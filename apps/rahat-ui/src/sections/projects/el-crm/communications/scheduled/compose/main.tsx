'use client';

import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  MessageSquare,
  Plus,
  Users,
  X,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/components/card';
import { Button } from '@rahat-ui/shadcn/components/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import { Input } from '@rahat-ui/shadcn/components/input';
import { Switch } from '@rahat-ui/shadcn/components/switch';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import { Textarea } from '@rahat-ui/shadcn/components/textarea';
import { Label } from '@rahat-ui/shadcn/components/label';
import { cn } from '@rahat-ui/shadcn/src/utils';
import {
  useCreateElCrmCampaign,
  useCustomers,
  useListElCrmAutomation,
  useListElCrmTemplate,
  useListElCrmTransport,
  useToggleElCrmAutomation,
  useTriggerElCrmCampaign,
} from '@rahat-ui/query';

// ─── Constants ────────────────────────────────────────────────────────────────

const AUDIENCE_GROUPS = [
  {
    id: 'VENDOR',
    name: 'Customers',
    description: 'Vendors / retail customers',
  },
  {
    id: 'BENEFICIARY',
    name: 'Consumers',
    description: 'Program beneficiaries',
  },
];

// ─── Filter builder definitions ───────────────────────────────────────────────

type FilterField = 'category' | 'source' | 'location' | 'isVerified';
type FilterRow = { id: string; field: FilterField | ''; value: string };

const FILTER_FIELD_OPTIONS: { value: FilterField; label: string }[] = [
  { value: 'category', label: 'Status' },
  { value: 'source', label: 'Source' },
  { value: 'location', label: 'Location' },
];

const BENEFICIARY_FILTER_FIELD_OPTIONS: {
  value: FilterField;
  label: string;
}[] = [{ value: 'isVerified', label: 'Verified' }];

const FILTER_VALUE_OPTIONS: Partial<
  Record<FilterField, { value: string; label: string }[]>
> = {
  category: [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'NEWLY_INACTIVE', label: 'Newly Inactive' },
    { value: 'INACTIVE', label: 'Inactive' },
  ],
  source: [
    { value: 'PRIMARY', label: 'Primary' },
    { value: 'SECONDARY', label: 'Secondary' },
  ],
  isVerified: [
    { value: 'true', label: 'Verified' },
    { value: 'false', label: 'Not Verified' },
  ],
};

const CONDITION_LABELS: Record<string, string> = {
  INACTIVITY: 'Inactivity Reminder',
  PURCHASE_ANNIVERSARY: 'Purchase Anniversary',
  BIRTHDAY: 'Birthday Greeting',
  ACCOUNT_ANNIVERSARY: 'Account Anniversary',
  LAST_PURCHASE: 'Last Purchase Reminder',
  CUSTOM_DATE: 'Custom Date Event',
};

const TARGET_LABELS: Record<string, string> = {
  VENDOR: 'Customers',
  BENEFICIARY: 'Consumers',
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ComposeScheduleView() {
  const { id: projectUUID } = useParams() as { id: UUID };
  const router = useRouter();

  // Progressive wizard state
  const [selectedTransportId, setSelectedTransportId] = useState('');
  const [selectedTransportName, setSelectedTransportName] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [filterRows, setFilterRows] = useState<FilterRow[]>([]);
  const [campaignName, setCampaignName] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  // Data hooks
  const transport = useListElCrmTransport(projectUUID);
  const templates = useListElCrmTemplate(projectUUID, { status: 'APPROVED' });
  const createCampaign = useCreateElCrmCampaign(projectUUID);
  const trigger = useTriggerElCrmCampaign(projectUUID);
  const automations = useListElCrmAutomation(projectUUID);
  const toggleAutomation = useToggleElCrmAutomation(projectUUID);

  // Build filter payload for estimated recipients count
  const filtersForCount = useMemo(() => {
    const f: Record<string, string> = {};
    for (const row of filterRows) {
      if (!row.field || !row.value) continue;
      if (row.field === 'category') f.category = row.value;
      else if (row.field === 'source') f.source = row.value;
      else if (row.field === 'location') f.location = row.value;
    }
    return f;
  }, [filterRows]);

  const recipientEstimate = useCustomers(projectUUID, {
    ...filtersForCount,
    page: 1,
    perPage: 1,
  });

  const isWhatsApp = selectedTransportName?.toLowerCase().includes('whatsapp');

  // Derive current active step
  const currentStep = useMemo(() => {
    if (!selectedTransportId) return 1;
    if (!messageContent) return 2;
    if (!selectedGroup) return 3;
    return 4;
  }, [selectedTransportId, messageContent, selectedGroup]);

  const isScheduleDateTimeValid = useMemo(() => {
    if (!scheduleDate || !scheduleTime) return true;
    const scheduled = new Date(`${scheduleDate}T${scheduleTime}`);
    if (Number.isNaN(scheduled.getTime())) return false;
    return scheduled.getTime() > Date.now();
  }, [scheduleDate, scheduleTime]);

  const canSubmit =
    !!campaignName &&
    !!scheduleDate &&
    !!scheduleTime &&
    isScheduleDateTimeValid &&
    !!selectedGroup &&
    !!messageContent &&
    !!selectedTransportId;

  const handleSubmit = async () => {
    if (!isScheduleDateTimeValid) return;

    const options: Record<string, string | undefined> = {};

    for (const row of filterRows) {
      if (!row.field || !row.value) continue;
      if (row.field === 'category') options.vendorStatus = row.value;
      else if (row.field === 'source') options.vendorSource = row.value;
      else if (row.field === 'location') options.location = row.value;
      else if (row.field === 'isVerified')
        options.beneficiaryIsVerified = row.value;
    }

    if (scheduleDate && scheduleTime) {
      options.scheduledTimestamp = new Date(
        `${scheduleDate}T${scheduleTime}`,
      ).toISOString();
      options.attemptIntervalMinutes = '5';
    }

    const campaign = await createCampaign.mutateAsync({
      name: campaignName,
      targetType: selectedGroup,
      transportId: selectedTransportId,
      message: messageContent,
      options: Object.keys(options).length ? options : undefined,
    });

    if (campaign?.uuid) {
      await trigger.mutateAsync({ uuid: campaign.uuid });
    }

    router.push(`/projects/el-crm/${projectUUID}/communications/scheduled`);
  };
  console.log({ errors });

  const resetForm = () => {
    setSelectedTransportId('');
    setSelectedTransportName('');
    setMessageContent('');
    setSelectedGroup('');
    setFilterRows([]);
    setCampaignName('');
    setScheduleDate('');
    setScheduleTime('');
  };

  const addFilterRow = () =>
    setFilterRows((prev) => [
      ...prev,
      { id: Math.random().toString(36).slice(2), field: '', value: '' },
    ]);

  const removeFilterRow = (id: string) =>
    setFilterRows((prev) => prev.filter((r) => r.id !== id));

  const updateFilterRow = (id: string, patch: Partial<FilterRow>) =>
    setFilterRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    );

  // Badge label for the template/message step
  const templateBadge = useMemo(() => {
    if (!messageContent) return undefined;
    if (isWhatsApp) {
      return (
        templates.data?.find((t: any) => t.externalId === messageContent)
          ?.name ?? messageContent
      );
    }
    return 'Custom message';
  }, [messageContent, isWhatsApp, templates.data]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border bg-card/50 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href={`/projects/el-crm/${projectUUID}/communications/scheduled`}
          >
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Schedule Message
            </h1>
            <p className="text-muted-foreground">
              Create and schedule a new message to your audience
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Schedule Message</CardTitle>
            <CardDescription>
              Choose how you want to schedule your message
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="manual" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Manual
                </TabsTrigger>
                <TabsTrigger value="automatic" className="gap-2">
                  <Zap className="h-4 w-4" />
                  Automatic
                </TabsTrigger>
              </TabsList>

              {/* ── MANUAL TAB ── */}
              <TabsContent value="manual" className="space-y-4">
                {/* Step 1: Channel */}
                <StepCard
                  step={1}
                  title="Select Channel"
                  completed={!!selectedTransportId}
                  active={currentStep === 1}
                  badge={selectedTransportName || undefined}
                >
                  {transport.isLoading ? (
                    <p className="ml-10 text-sm text-muted-foreground">
                      Loading channels…
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-3 ml-10">
                      {transport.data?.map((ch: any) => (
                        <button
                          key={ch.cuid}
                          type="button"
                          onClick={() => {
                            setSelectedTransportId(ch.cuid);
                            setSelectedTransportName(ch.name);
                            setMessageContent('');
                          }}
                          className={cn(
                            'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:border-primary/50',
                            selectedTransportId === ch.cuid
                              ? 'border-primary bg-primary/5'
                              : 'border-border',
                          )}
                        >
                          <MessageSquare className="h-6 w-6" />
                          <span className="text-sm font-medium">{ch.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </StepCard>

                {/* Step 2: Template or custom message */}
                {selectedTransportId && (
                  <StepCard
                    step={2}
                    title={isWhatsApp ? 'Select Template' : 'Message Content'}
                    completed={!!messageContent}
                    active={currentStep === 2}
                    badge={templateBadge}
                  >
                    <div className="ml-10">
                      {isWhatsApp ? (
                        templates.isLoading ? (
                          <p className="text-sm text-muted-foreground">
                            Loading templates…
                          </p>
                        ) : (
                          <Select
                            value={messageContent}
                            onValueChange={setMessageContent}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choose a template" />
                            </SelectTrigger>
                            <SelectContent>
                              {templates.data?.map((t: any) => (
                                <SelectItem
                                  key={t.cuid}
                                  value={t.externalId ?? t.cuid}
                                >
                                  {t.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )
                      ) : (
                        <Textarea
                          placeholder="Type your message here…"
                          value={messageContent}
                          onChange={(e) => setMessageContent(e.target.value)}
                          rows={4}
                        />
                      )}
                    </div>
                  </StepCard>
                )}

                {/* Step 3: Audience Group */}
                {messageContent && (
                  <StepCard
                    step={3}
                    title="Select Audience Group"
                    completed={!!selectedGroup}
                    active={currentStep === 3}
                    badge={
                      AUDIENCE_GROUPS.find((g) => g.id === selectedGroup)?.name
                    }
                  >
                    <div className="grid grid-cols-2 gap-3 ml-10">
                      {AUDIENCE_GROUPS.map((group) => (
                        <button
                          key={group.id}
                          type="button"
                          onClick={() => {
                            setSelectedGroup(group.id);
                            setFilterRows([]);
                          }}
                          className={cn(
                            'flex flex-col items-start gap-1 rounded-lg border-2 p-4 transition-all hover:border-primary/50',
                            selectedGroup === group.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border',
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {group.name}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {group.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  </StepCard>
                )}

                {/* Step 4+: Filters & Schedule */}
                {selectedGroup && (
                  <div className="space-y-4">
                    {/* Audience filters (optional) */}
                    {selectedGroup &&
                      (() => {
                        const activeFieldOptions =
                          selectedGroup === 'VENDOR'
                            ? FILTER_FIELD_OPTIONS
                            : BENEFICIARY_FILTER_FIELD_OPTIONS;
                        return (
                          <div className="rounded-lg border p-4">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-medium">
                                4
                              </div>
                              <div>
                                <span className="font-medium">
                                  Filter Audience
                                </span>
                                <p className="text-xs text-muted-foreground">
                                  Optional: Narrow down your audience
                                </p>
                              </div>
                            </div>

                            <div className="ml-10 space-y-2">
                              {filterRows.map((row) => {
                                const usedFields = filterRows
                                  .filter((r) => r.id !== row.id && r.field)
                                  .map((r) => r.field);
                                const valueOptions = row.field
                                  ? FILTER_VALUE_OPTIONS[
                                      row.field as FilterField
                                    ]
                                  : undefined;
                                return (
                                  <div
                                    key={row.id}
                                    className="flex items-center gap-2"
                                  >
                                    {/* Field selector */}
                                    <Select
                                      value={row.field}
                                      onValueChange={(val) =>
                                        updateFilterRow(row.id, {
                                          field: val as FilterField,
                                          value: '',
                                        })
                                      }
                                    >
                                      <SelectTrigger className="w-44">
                                        <SelectValue placeholder="Select field" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {activeFieldOptions.map((opt) => (
                                          <SelectItem
                                            key={opt.value}
                                            value={opt.value}
                                            disabled={usedFields.includes(
                                              opt.value,
                                            )}
                                          >
                                            {opt.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>

                                    <span className="text-muted-foreground text-sm shrink-0">
                                      =
                                    </span>

                                    {/* Value input — dropdown for known enums, text for location */}
                                    {valueOptions ? (
                                      <Select
                                        value={row.value}
                                        onValueChange={(val) =>
                                          updateFilterRow(row.id, {
                                            value: val,
                                          })
                                        }
                                      >
                                        <SelectTrigger className="flex-1">
                                          <SelectValue placeholder="Select value" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {valueOptions.map((opt) => (
                                            <SelectItem
                                              key={opt.value}
                                              value={opt.value}
                                            >
                                              {opt.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    ) : (
                                      <Input
                                        placeholder={
                                          row.field === 'location'
                                            ? 'e.g., Kathmandu'
                                            : 'Value'
                                        }
                                        value={row.value}
                                        onChange={(e) =>
                                          updateFilterRow(row.id, {
                                            value: e.target.value,
                                          })
                                        }
                                        className="flex-1"
                                      />
                                    )}

                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                                      onClick={() => removeFilterRow(row.id)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                );
                              })}

                              {/* Add filter — hide when all fields are already used */}
                              {filterRows.length <
                                activeFieldOptions.length && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-1.5 mt-1 text-muted-foreground"
                                  onClick={addFilterRow}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                  Add Filter
                                </Button>
                              )}

                              {/* Estimated recipients */}
                              {selectedGroup === 'VENDOR' && (
                                <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                                  <Users className="h-4 w-4" />
                                  <span>
                                    Estimated recipients:{' '}
                                    {recipientEstimate.isLoading ? (
                                      <span className="italic">
                                        calculating…
                                      </span>
                                    ) : (
                                      <>
                                        <strong className="text-foreground">
                                          {recipientEstimate.meta?.total ?? 0}
                                        </strong>{' '}
                                        customers
                                      </>
                                    )}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}

                    {/* Schedule Details */}
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-medium">
                          5
                        </div>
                        <span className="font-medium">Schedule Details</span>
                      </div>

                      <div className="ml-10 space-y-4">
                        <div className="space-y-2">
                          <Label>Campaign Name</Label>
                          <Input
                            placeholder="e.g., March Promo Campaign"
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Date</Label>
                            <Input
                              type="date"
                              min={new Date().toISOString().slice(0, 10)}
                              value={scheduleDate}
                              onChange={(e) => setScheduleDate(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Time</Label>
                            <Input
                              type="time"
                              value={scheduleTime}
                              onChange={(e) => setScheduleTime(e.target.value)}
                            />
                          </div>
                        </div>

                        {!isScheduleDateTimeValid && (
                          <p className="text-sm text-destructive">
                            Please choose a future date and time.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                      <Button
                        disabled={!canSubmit || createCampaign.isPending}
                        onClick={handleSubmit}
                        className="gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        {createCampaign.isPending
                          ? 'Scheduling…'
                          : 'Schedule Message'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Empty state */}
                {!selectedTransportId && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Start by selecting a messaging channel above</p>
                  </div>
                )}
              </TabsContent>

              {/* ── AUTOMATIC TAB ── */}
              <TabsContent value="automatic" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Pre-built automations that trigger based on customer events.
                  Toggle to activate or deactivate.
                </p>

                {automations.isLoading ? (
                  <p className="text-sm text-muted-foreground py-4">
                    Loading automations…
                  </p>
                ) : !automations.data?.length ? (
                  <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg">
                    <Zap className="h-12 w-12 mx-auto mb-3 opacity-40" />
                    <p className="font-medium">No automation rules found</p>
                    <p className="text-xs mt-1">
                      Automation rules are configured in the database.
                    </p>
                  </div>
                ) : (
                  automations.data.map((rule: any) => (
                    <AutomationRuleCard
                      key={rule.uuid}
                      rule={rule}
                      isPending={toggleAutomation.isPending}
                      onToggle={(uuid, isEnabled) =>
                        toggleAutomation.mutate({ uuid, isEnabled })
                      }
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepCard({
  step,
  title,
  completed,
  active,
  badge,
  children,
}: {
  step: number;
  title: string;
  completed: boolean;
  active: boolean;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'rounded-lg border p-4 transition-all',
        active ? 'border-primary bg-primary/5' : 'border-border',
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium',
              completed
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground',
            )}
          >
            {completed ? <Check className="h-4 w-4" /> : step}
          </div>
          <span className="font-medium">{title}</span>
        </div>
        {badge && <Badge variant="secondary">{badge}</Badge>}
      </div>
      {children}
    </div>
  );
}

function AutomationRuleCard({
  rule,
  isPending,
  onToggle,
}: {
  rule: any;
  isPending: boolean;
  onToggle: (uuid: string, isEnabled: boolean) => void;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg border p-4 transition-all',
        rule.isEnabled ? 'border-primary bg-primary/5' : 'border-border',
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg shrink-0',
            rule.isEnabled ? 'bg-primary/10' : 'bg-muted',
          )}
        >
          <Zap className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-medium">
            {CONDITION_LABELS[rule.conditionType] ?? rule.conditionType}
          </h4>
          <p className="text-sm text-muted-foreground">
            {rule.campaign?.name ?? '—'}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant="outline" className="text-xs">
              {TARGET_LABELS[rule.targetType] ?? rule.targetType}
            </Badge>
            {rule.isRecurring && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Recurring
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span
          className={cn(
            'text-xs font-medium',
            rule.isEnabled ? 'text-primary' : 'text-muted-foreground',
          )}
        >
          {rule.isEnabled ? 'Active' : 'Inactive'}
        </span>
        <Switch
          checked={rule.isEnabled}
          disabled={isPending}
          onCheckedChange={(checked) => onToggle(rule.uuid, checked)}
        />
      </div>
    </div>
  );
}
