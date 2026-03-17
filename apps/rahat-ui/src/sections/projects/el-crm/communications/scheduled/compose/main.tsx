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
  Filter,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
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
  useCreateElCrmAutomationRule,
  useDeleteElCrmAutomationRule,
  useCustomers,
  useListElCrmAutomation,
  useListElCrmCampaign,
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

const OPERATOR_LABELS: Record<string, string> = {
  EQ: 'equals',
  NEQ: 'not equals',
  GT: 'greater than',
  GTE: 'greater than or equal',
  LT: 'less than',
  LTE: 'less than or equal',
  IN: 'is one of',
  NOT_IN: 'is not one of',
  IS_NULL: 'is empty',
  IS_NOT_NULL: 'is not empty',
  DATE_BEFORE_NOW_MINUS_DAYS: 'date is older than N days',
  DATE_AFTER_NOW_MINUS_DAYS: 'date is within last N days',
  DATE_DAY_OF_YEAR_EQUALS: 'anniversary (N days ago)',
  CONTAINS: 'contains',
  NOT_CONTAINS: 'does not contain',
};

const VALUE_TYPE_OPTIONS = [
  { value: 'STRING', label: 'Text' },
  { value: 'NUMBER', label: 'Number' },
  { value: 'BOOLEAN', label: 'Boolean' },
  { value: 'DATE', label: 'Date' },
  { value: 'STRING_LIST', label: 'Text list (JSON)' },
  { value: 'NUMBER_LIST', label: 'Number list (JSON)' },
];

type RuleConditionRow = {
  id: string;
  fieldPath: string;
  operator: string;
  valueType: string;
  value: string;
  groupNo: number;
};

type RuleTargetType = 'VENDOR' | 'BENEFICIARY';

type TransportOption = {
  cuid: string;
  name: string;
};

type TemplateOption = {
  cuid: string;
  externalId?: string | null;
  name: string;
};

type CampaignOption = {
  id: number;
  name: string;
  targetType: RuleTargetType;
};

type AutomationRuleConditionSummary = {
  uuid?: string;
  fieldPath: string;
  operator: string;
  value?: string | null;
};

type AutomationRuleSummary = {
  uuid: string;
  isEnabled: boolean;
  isRecurring: boolean;
  targetType: RuleTargetType;
  conditionType?: string | null;
  campaign?: { name?: string | null } | null;
  conditions?: AutomationRuleConditionSummary[];
};

type ConditionValueOption = {
  value: string;
  label: string;
};

type ConditionFieldConfig = {
  value: string;
  label: string;
  valueType: string;
  operators: string[];
  valueOptions?: ConditionValueOption[];
  placeholder?: string;
};

const NULLABLE_OPERATORS = ['IS_NULL', 'IS_NOT_NULL'];

const VENDOR_CONDITION_FIELDS: ConditionFieldConfig[] = [
  {
    value: 'category',
    label: 'Customer Category',
    valueType: 'STRING',
    operators: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
    valueOptions: FILTER_VALUE_OPTIONS.category,
  },
  {
    value: 'source',
    label: 'Customer Source',
    valueType: 'STRING',
    operators: ['EQ', 'NEQ', 'IN', 'NOT_IN'],
    valueOptions: FILTER_VALUE_OPTIONS.source,
  },
  {
    value: 'location',
    label: 'Location',
    valueType: 'STRING',
    operators: [
      'EQ',
      'NEQ',
      'CONTAINS',
      'NOT_CONTAINS',
      'IS_NULL',
      'IS_NOT_NULL',
    ],
    placeholder: 'e.g. Kathmandu',
  },
  {
    value: 'lastPurchaseDate',
    label: 'Last Purchase Date',
    valueType: 'NUMBER',
    operators: [
      'DATE_BEFORE_NOW_MINUS_DAYS',
      'DATE_AFTER_NOW_MINUS_DAYS',
      'IS_NULL',
      'IS_NOT_NULL',
    ],
    placeholder: 'days, e.g. 183',
  },
  {
    value: 'createdAt',
    label: 'Created Date',
    valueType: 'NUMBER',
    operators: ['DATE_BEFORE_NOW_MINUS_DAYS', 'DATE_AFTER_NOW_MINUS_DAYS'],
    placeholder: 'days, e.g. 30',
  },
  {
    value: 'customerCode',
    label: 'Customer Code',
    valueType: 'STRING',
    operators: ['EQ', 'NEQ', 'CONTAINS', 'NOT_CONTAINS'],
    placeholder: 'e.g. VEND-001',
  },
];

const BENEFICIARY_CONDITION_FIELDS: ConditionFieldConfig[] = [
  {
    value: 'isVerified',
    label: 'Verified Status',
    valueType: 'BOOLEAN',
    operators: ['EQ', 'NEQ'],
    valueOptions: FILTER_VALUE_OPTIONS.isVerified,
  },
  {
    value: 'createdAt',
    label: 'Created Date',
    valueType: 'NUMBER',
    operators: ['DATE_BEFORE_NOW_MINUS_DAYS', 'DATE_AFTER_NOW_MINUS_DAYS'],
    placeholder: 'days, e.g. 30',
  },
  {
    value: 'extras.lastEyewearPurchaseDate',
    label: 'Last Eyewear Purchase Date',
    valueType: 'NUMBER',
    operators: [
      'DATE_DAY_OF_YEAR_EQUALS',
      'DATE_BEFORE_NOW_MINUS_DAYS',
      'DATE_AFTER_NOW_MINUS_DAYS',
      'IS_NULL',
      'IS_NOT_NULL',
    ],
    placeholder: 'days, e.g. 365',
  },
  {
    value: 'extras.phone',
    label: 'Phone in Extras',
    valueType: 'STRING',
    operators: ['IS_NULL', 'IS_NOT_NULL', 'CONTAINS', 'NOT_CONTAINS'],
    placeholder: 'phone fragment',
  },
];

const emptyCondition = (): RuleConditionRow => ({
  id: Math.random().toString(36).slice(2),
  fieldPath: '',
  operator: 'EQ',
  valueType: 'STRING',
  value: '',
  groupNo: 0,
});

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ComposeScheduleView() {
  const { id: projectUUID } = useParams() as { id: UUID };
  const router = useRouter();
  const searchParams = useSearchParams();

  // Progressive wizard state
  const [selectedTransportId, setSelectedTransportId] = useState('');
  const [selectedTransportName, setSelectedTransportName] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [filterRows, setFilterRows] = useState<FilterRow[]>([]);
  const [campaignName, setCampaignName] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  // Automation rule creation state
  const [showRuleBuilder, setShowRuleBuilder] = useState(false);
  const [ruleTargetType, setRuleTargetType] =
    useState<RuleTargetType>('VENDOR');
  const [ruleCampaignId, setRuleCampaignId] = useState('');
  const [ruleConditions, setRuleConditions] = useState<RuleConditionRow[]>([
    emptyCondition(),
  ]);
  const [ruleIsRecurring, setRuleIsRecurring] = useState(false);
  const [ruleCooldownDays, setRuleCooldownDays] = useState('');
  const [ruleMaxSends, setRuleMaxSends] = useState('');
  const [ruleFireOnce, setRuleFireOnce] = useState(false);

  // Data hooks
  const transport = useListElCrmTransport(projectUUID);
  const templates = useListElCrmTemplate(projectUUID, { status: 'APPROVED' });
  const campaignList = useListElCrmCampaign(projectUUID, {
    page: 1,
    perPage: 100,
  });
  const createCampaign = useCreateElCrmCampaign(projectUUID);
  const trigger = useTriggerElCrmCampaign(projectUUID);
  const automations = useListElCrmAutomation(projectUUID);
  const toggleAutomation = useToggleElCrmAutomation(projectUUID);
  const createAutomationRule = useCreateElCrmAutomationRule(projectUUID);
  const deleteAutomationRule = useDeleteElCrmAutomationRule(projectUUID);
  const canCreateRules = searchParams.get('createRule') === 'true';

  const conditionFieldOptions = useMemo(() => {
    return ruleTargetType === 'VENDOR'
      ? VENDOR_CONDITION_FIELDS
      : BENEFICIARY_CONDITION_FIELDS;
  }, [ruleTargetType]);

  const availableRuleCampaigns = useMemo(() => {
    return (campaignList.data ?? []).filter(
      (campaign: CampaignOption) => campaign.targetType === ruleTargetType,
    );
  }, [campaignList.data, ruleTargetType]);

  const automationRules = (automations.data ?? []) as AutomationRuleSummary[];

  const getConditionFieldConfig = (fieldPath: string) =>
    conditionFieldOptions.find((field) => field.value === fieldPath);

  const updateRuleCondition = (
    id: string,
    patch: Partial<RuleConditionRow>,
  ) => {
    setRuleConditions((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  };

  const handleConditionFieldChange = (id: string, fieldPath: string) => {
    const fieldConfig = conditionFieldOptions.find(
      (field) => field.value === fieldPath,
    );
    if (!fieldConfig) return;

    updateRuleCondition(id, {
      fieldPath,
      operator: fieldConfig.operators[0] ?? 'EQ',
      valueType: fieldConfig.valueType,
      value: '',
    });
  };

  const handleConditionOperatorChange = (id: string, operator: string) => {
    updateRuleCondition(id, {
      operator,
      value: NULLABLE_OPERATORS.includes(operator)
        ? ''
        : ruleConditions.find((row) => row.id === id)?.value ?? '',
    });
  };

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
        templates.data?.find(
          (t: TemplateOption) => t.externalId === messageContent,
        )?.name ?? messageContent
      );
    }
    return 'Custom message';
  }, [messageContent, isWhatsApp, templates.data]);

  return (
    <TooltipProvider delayDuration={200}>
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/projects/el-crm/${projectUUID}/communications/scheduled`}
              >
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Back to scheduled messages</TooltipContent>
          </Tooltip>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Schedule Message
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Create and schedule a new message to your audience
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <Card>
          <CardHeader className="border-b pb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">Schedule Message</CardTitle>
            </div>
            <CardDescription className="text-xs">
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
                      {transport.data?.map((ch: TransportOption) => (
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
                              {templates.data?.map((t: TemplateOption) => (
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
                    <div className="rounded-full bg-muted p-4 mx-auto mb-3 w-fit">
                      <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm">Start by selecting a messaging channel above</p>
                  </div>
                )}
              </TabsContent>

              {/* ── AUTOMATIC TAB ── */}
              <TabsContent value="automatic" className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Automations that trigger based on data-driven conditions.
                    Toggle to activate or deactivate.
                  </p>
                  {canCreateRules && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => {
                        setShowRuleBuilder((v) => !v);
                        setRuleConditions([emptyCondition()]);
                      }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      {showRuleBuilder ? 'Cancel' : 'Create Rule'}
                    </Button>
                  )}
                </div>

                {/* ── Rule Builder ── */}
                {canCreateRules && showRuleBuilder && (
                  <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                    <p className="font-medium text-sm">New Automation Rule</p>

                    {/* Campaign selector */}
                    <div className="space-y-1">
                      <Label className="text-xs">Linked Campaign</Label>
                      <Select
                        value={ruleCampaignId}
                        onValueChange={setRuleCampaignId}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select campaign…" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableRuleCampaigns.map((c: CampaignOption) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Target type */}
                    <div className="space-y-1">
                      <Label className="text-xs">Target Group</Label>
                      <Select
                        value={ruleTargetType}
                        onValueChange={(value) => {
                          setRuleTargetType(value as RuleTargetType);
                          setRuleCampaignId('');
                        }}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VENDOR">
                            Customers (Vendor)
                          </SelectItem>
                          <SelectItem value="BENEFICIARY">
                            Consumers (Beneficiary)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Conditions */}
                    <div className="space-y-2">
                      <Label className="text-xs">Conditions</Label>
                      {ruleConditions.map((cond, idx) => (
                        <div
                          key={cond.id}
                          className="grid grid-cols-12 gap-1 items-start"
                        >
                          {(() => {
                            const fieldConfig = getConditionFieldConfig(
                              cond.fieldPath,
                            );
                            const operatorOptions = (
                              fieldConfig?.operators ?? ['EQ']
                            ).map((operator) => ({
                              value: operator,
                              label: OPERATOR_LABELS[operator] ?? operator,
                            }));
                            const hideValueInput = NULLABLE_OPERATORS.includes(
                              cond.operator,
                            );
                            const valueOptions =
                              fieldConfig?.valueOptions ?? [];
                            return (
                              <>
                                <div className="col-span-3">
                                  <Select
                                    value={cond.fieldPath}
                                    onValueChange={(value) =>
                                      handleConditionFieldChange(cond.id, value)
                                    }
                                  >
                                    <SelectTrigger className="h-8 text-xs">
                                      <SelectValue placeholder="Select field" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {conditionFieldOptions.map((field) => (
                                        <SelectItem
                                          key={field.value}
                                          value={field.value}
                                        >
                                          {field.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="col-span-3">
                                  <Select
                                    value={cond.operator}
                                    onValueChange={(value) =>
                                      handleConditionOperatorChange(
                                        cond.id,
                                        value,
                                      )
                                    }
                                    disabled={!cond.fieldPath}
                                  >
                                    <SelectTrigger className="h-8 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {operatorOptions.map((o) => (
                                        <SelectItem
                                          key={o.value}
                                          value={o.value}
                                        >
                                          {o.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="col-span-2">
                                  <Select
                                    value={cond.valueType}
                                    onValueChange={(value) =>
                                      updateRuleCondition(cond.id, {
                                        valueType: value,
                                      })
                                    }
                                    disabled={!cond.fieldPath || !!fieldConfig}
                                  >
                                    <SelectTrigger className="h-8 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {VALUE_TYPE_OPTIONS.map((o) => (
                                        <SelectItem
                                          key={o.value}
                                          value={o.value}
                                        >
                                          {o.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="col-span-3">
                                  {hideValueInput ? (
                                    <div className="h-8 rounded-md border border-dashed px-3 text-xs text-muted-foreground flex items-center">
                                      No value needed
                                    </div>
                                  ) : valueOptions.length ? (
                                    <Select
                                      value={cond.value}
                                      onValueChange={(value) =>
                                        updateRuleCondition(cond.id, { value })
                                      }
                                    >
                                      <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Select value" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {valueOptions.map((option) => (
                                          <SelectItem
                                            key={option.value}
                                            value={option.value}
                                          >
                                            {option.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <Input
                                      className="h-8 text-xs"
                                      placeholder={
                                        fieldConfig?.placeholder ?? 'value'
                                      }
                                      value={cond.value}
                                      onChange={(e) =>
                                        updateRuleCondition(cond.id, {
                                          value: e.target.value,
                                        })
                                      }
                                      disabled={!cond.fieldPath}
                                    />
                                  )}
                                </div>
                                <div className="col-span-1 flex justify-center pt-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setRuleConditions(
                                        ruleConditions.filter(
                                          (_, i) => i !== idx,
                                        ),
                                      )
                                    }
                                    className="text-destructive hover:opacity-70"
                                    title="Remove condition"
                                    aria-label="Remove condition"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() =>
                          setRuleConditions([
                            ...ruleConditions,
                            emptyCondition(),
                          ])
                        }
                      >
                        <Plus className="h-3 w-3" /> Add Condition
                      </Button>
                    </div>

                    {/* Recurrence options */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          id="rule-recurring"
                          checked={ruleIsRecurring}
                          onCheckedChange={setRuleIsRecurring}
                        />
                        <Label
                          htmlFor="rule-recurring"
                          className="text-xs cursor-pointer"
                        >
                          Recurring
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          id="rule-fire-once"
                          checked={ruleFireOnce}
                          onCheckedChange={setRuleFireOnce}
                        />
                        <Label
                          htmlFor="rule-fire-once"
                          className="text-xs cursor-pointer"
                        >
                          Fire once per target
                        </Label>
                      </div>
                      {ruleIsRecurring && (
                        <div className="space-y-1">
                          <Label className="text-xs">Cooldown days</Label>
                          <Input
                            className="h-8 text-xs"
                            type="number"
                            placeholder="e.g. 30"
                            value={ruleCooldownDays}
                            onChange={(e) =>
                              setRuleCooldownDays(e.target.value)
                            }
                          />
                        </div>
                      )}
                      <div className="space-y-1">
                        <Label className="text-xs">Max sends per target</Label>
                        <Input
                          className="h-8 text-xs"
                          type="number"
                          placeholder="unlimited"
                          value={ruleMaxSends}
                          onChange={(e) => setRuleMaxSends(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowRuleBuilder(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        disabled={
                          !ruleCampaignId ||
                          ruleConditions.length === 0 ||
                          ruleConditions.some(
                            (c) =>
                              !c.fieldPath ||
                              (!NULLABLE_OPERATORS.includes(c.operator) &&
                                !c.value),
                          ) ||
                          createAutomationRule.isPending
                        }
                        onClick={() => {
                          createAutomationRule.mutate(
                            {
                              campaignId: Number(ruleCampaignId),
                              targetType: ruleTargetType,
                              isRecurring: ruleIsRecurring,
                              fireOnceOnEntry: ruleFireOnce,
                              ...(ruleCooldownDays
                                ? {
                                    recurrenceCooldownDays:
                                      Number(ruleCooldownDays),
                                  }
                                : {}),
                              ...(ruleMaxSends
                                ? { maxSendsPerTarget: Number(ruleMaxSends) }
                                : {}),
                              conditions: ruleConditions.map((c, idx) => ({
                                fieldPath: c.fieldPath,
                                operator: c.operator,
                                valueType: c.valueType,
                                value: c.value || undefined,
                                groupNo: c.groupNo,
                                sortOrder: idx,
                              })),
                            },
                            {
                              onSuccess: () => {
                                setShowRuleBuilder(false);
                                setRuleConditions([emptyCondition()]);
                                setRuleCampaignId('');
                              },
                            },
                          );
                        }}
                      >
                        {createAutomationRule.isPending
                          ? 'Saving…'
                          : 'Save Rule'}
                      </Button>
                    </div>
                  </div>
                )}

                {automations.isLoading ? (
                  <p className="text-sm text-muted-foreground py-4">
                    Loading automations…
                  </p>
                ) : !automations.data?.length ? (
                  <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg">
                    <div className="rounded-full bg-muted p-4 mx-auto mb-3 w-fit">
                      <Zap className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-sm">No automation rules found</p>
                    <p className="text-xs mt-1">
                      {canCreateRules
                        ? 'Click Create Rule to define a data-driven automation.'
                        : 'No automation rules are configured for this project.'}
                    </p>
                  </div>
                ) : (
                  automationRules.map((rule) => (
                    <AutomationRuleCard
                      key={rule.uuid}
                      rule={rule}
                      isPending={
                        toggleAutomation.isPending ||
                        deleteAutomationRule.isPending
                      }
                      onToggle={(uuid, isEnabled) =>
                        toggleAutomation.mutate({ uuid, isEnabled })
                      }
                      onDelete={(uuid) => deleteAutomationRule.mutate(uuid)}
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
    </TooltipProvider>
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
  onDelete,
}: {
  rule: AutomationRuleSummary;
  isPending: boolean;
  onToggle: (uuid: string, isEnabled: boolean) => void;
  onDelete?: (uuid: string) => void;
}) {
  const hasGenericConditions =
    Array.isArray(rule.conditions) && rule.conditions.length > 0;
  return (
    <div
      className={cn(
        'rounded-lg border p-4 transition-all space-y-3',
        rule.isEnabled ? 'border-primary bg-primary/5' : 'border-border',
      )}
    >
      <div className="flex items-center justify-between">
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
              {(rule.conditionType
                ? CONDITION_LABELS[rule.conditionType]
                : undefined) ??
                rule.campaign?.name ??
                'Automation Rule'}
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
          {onDelete && (
            <button
              type="button"
              className="text-destructive hover:opacity-70 ml-1"
              disabled={isPending}
              onClick={() => onDelete(rule.uuid)}
              title="Delete rule"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Generic conditions summary */}
      {hasGenericConditions && (
        <div className="ml-14 space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Conditions:
          </p>
          {rule.conditions?.map(
            (c: AutomationRuleConditionSummary, idx: number) => (
              <div
                key={c.uuid ?? idx}
                className="text-xs flex gap-1.5 text-muted-foreground"
              >
                <span className="font-mono bg-muted px-1 rounded">
                  {c.fieldPath}
                </span>
                <span>{OPERATOR_LABELS[c.operator] ?? c.operator}</span>
                {c.value && (
                  <span className="font-mono bg-muted px-1 rounded">
                    {c.value}
                  </span>
                )}
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
