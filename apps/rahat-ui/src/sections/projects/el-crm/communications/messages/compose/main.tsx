'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  MessageSquare,
  Plus,
  Send,
  Users,
  ArrowLeft,
  X,
} from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import { Input } from '@rahat-ui/shadcn/components/input';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import { Switch } from '@rahat-ui/shadcn/components/switch';
import { Textarea } from '@rahat-ui/shadcn/components/textarea';
import { Label } from '@rahat-ui/shadcn/components/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/components/dialog';
import { cn } from '@rahat-ui/shadcn/src/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import {
  useConsumers,
  useCreateElCrmCampaign,
  useCustomers,
  useListElCrmTemplate,
  useListElCrmTransport,
} from '@rahat-ui/query';
import { getPlasgateSmsInfo, isPlasgateChannel } from '../../const';

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

type FilterField =
  | 'category'
  | 'source'
  | 'location'
  | 'isVerified'
  | 'customerCode'
  | 'name'
  | 'vendorName'
  | 'channel';
type FilterRow = { id: string; field: FilterField | ''; value: string };

const collectFilterValues = (rows: FilterRow[], field: FilterField) =>
  rows
    .filter((row) => row.field === field)
    .map((row) => row.value.trim())
    .filter(Boolean);

const FILTER_FIELD_OPTIONS: { value: FilterField; label: string }[] = [
  { value: 'category', label: 'Status' },
  { value: 'source', label: 'Source' },
  { value: 'location', label: 'Location' },
  { value: 'customerCode', label: 'Customer Code' },
  { value: 'channel', label: 'Channel' },
];

const BENEFICIARY_FILTER_FIELD_OPTIONS: {
  value: FilterField;
  label: string;
}[] = [
  { value: 'name', label: 'Beneficiary Name' },
  { value: 'vendorName', label: 'Vendor Name' },
];

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

type TransportOption = {
  cuid: string;
  name: string;
};

type TemplateOption = {
  cuid: string;
  externalId?: string | null;
  name: string;
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ComposeMessageView() {
  const { id: projectUUID } = useParams() as { id: UUID };
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillTemplateId = searchParams?.get('templateId') ?? '';
  const prefillChannel = searchParams?.get('channel') ?? '';
  const hasAppliedPrefill = useRef(false);

  // Progressive wizard state
  const [selectedTransportId, setSelectedTransportId] = useState('');
  const [selectedTransportName, setSelectedTransportName] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [filterRows, setFilterRows] = useState<FilterRow[]>([]);
  const [campaignName, setCampaignName] = useState('');
  const [isAutomatic, setIsAutomatic] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // Data hooks
  const transport = useListElCrmTransport(projectUUID);
  const templates = useListElCrmTemplate(projectUUID, { status: 'APPROVED' });
  const createCampaign = useCreateElCrmCampaign(projectUUID);

  // Apply deep-link prefill (e.g. /compose?templateId=...&channel=WhatsApp)
  useEffect(() => {
    if (hasAppliedPrefill.current) return;
    if (!prefillTemplateId && !prefillChannel) return;
    if (!transport.data?.length) return;

    const channelMatch = prefillChannel
      ? transport.data.find(
          (t: TransportOption) =>
            t.name.toLowerCase() === prefillChannel.toLowerCase(),
        )
      : undefined;

    if (channelMatch) {
      setSelectedTransportId(channelMatch.cuid);
      setSelectedTransportName(channelMatch.name);
    }

    const isWhatsAppChannel = (channelMatch?.name || prefillChannel)
      .toLowerCase()
      .includes('whatsapp');

    if (prefillTemplateId && isWhatsAppChannel) {
      setMessageContent(prefillTemplateId);
    }

    hasAppliedPrefill.current = true;
  }, [prefillTemplateId, prefillChannel, transport.data]);

  const filtersForCount = useMemo(() => {
    const f: Record<string, string | string[]> = {};
    const categories = collectFilterValues(filterRows, 'category');
    const sources = collectFilterValues(filterRows, 'source');
    const locations = collectFilterValues(filterRows, 'location');
    const customerCodes = collectFilterValues(filterRows, 'customerCode');
    const channels = collectFilterValues(filterRows, 'channel');

    if (categories.length) f.category = categories;
    if (sources.length) f.source = sources;
    if (locations.length) f.location = locations;
    if (customerCodes.length) f.customerCode = customerCodes;
    if (channels.length) f.channel = channels;

    return f;
  }, [filterRows]);

  const recipientEstimate = useCustomers(projectUUID, {
    ...filtersForCount,
    page: 1,
    perPage: 1,
  });

  const recipientReachableEstimate = useCustomers(projectUUID, {
    ...filtersForCount,
    hasPhone: 'true',
    page: 1,
    perPage: 1,
  });

  const beneficiaryFiltersForCount = useMemo(() => {
    const f: Record<string, string> = {};
    // Consumer count endpoint matches a single name string (contains).
    const names = collectFilterValues(filterRows, 'name');
    if (names.length) f.name = names[0];
    const vendorNames = collectFilterValues(filterRows, 'vendorName');
    if (vendorNames.length) f.vendorName = vendorNames[0];
    return f;
  }, [filterRows]);

  const consumerEstimate = useConsumers(projectUUID, {
    ...beneficiaryFiltersForCount,
    page: 1,
    perPage: 1,
  });

  const consumerReachableEstimate = useConsumers(projectUUID, {
    ...beneficiaryFiltersForCount,
    hasPhone: 'true',
    page: 1,
    perPage: 1,
  });

  const audienceEstimate =
    selectedGroup === 'BENEFICIARY' ? consumerEstimate : recipientEstimate;
  const reachableEstimate =
    selectedGroup === 'BENEFICIARY' ? consumerReachableEstimate : recipientReachableEstimate;
  const audienceNoun = selectedGroup === 'BENEFICIARY' ? 'consumers' : 'customers';

  const isWhatsApp = selectedTransportName?.toLowerCase().includes('whatsapp');
  const isPlasgate = isPlasgateChannel(selectedTransportName);
  const plasgateSmsInfo = useMemo(
    () => (isPlasgate ? getPlasgateSmsInfo(messageContent) : null),
    [isPlasgate, messageContent],
  );

  // Derive current active step
  const currentStep = useMemo(() => {
    if (!selectedTransportId) return 1;
    if (!messageContent) return 2;
    if (!selectedGroup) return 3;
    return 4;
  }, [selectedTransportId, messageContent, selectedGroup]);

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

  const canSubmit =
    !!campaignName &&
    !!selectedGroup &&
    !!messageContent &&
    !!selectedTransportId;

  const selectedTemplateName = useMemo(() => {
    if (!isWhatsApp || !messageContent) return '';
    return (
      templates.data?.find(
        (t: TemplateOption) => (t.externalId ?? t.cuid) === messageContent,
      )?.name ?? ''
    );
  }, [isWhatsApp, messageContent, templates.data]);

  const selectedGroupName =
    AUDIENCE_GROUPS.find((g) => g.id === selectedGroup)?.name ?? '';

  const handleSubmit = async () => {
    const options: Record<
      string,
      string | string[] | boolean | boolean[] | undefined
    > = {};

    const categories = collectFilterValues(filterRows, 'category');
    const sources = collectFilterValues(filterRows, 'source');
    const locations = collectFilterValues(filterRows, 'location');
    const customerCodes = collectFilterValues(filterRows, 'customerCode');
    const names = collectFilterValues(filterRows, 'name');
    const vendorNames = collectFilterValues(filterRows, 'vendorName');
    const channels = collectFilterValues(filterRows, 'channel');

    if (categories.length) options.vendorStatus = categories;
    if (sources.length) options.vendorSource = sources;
    if (locations.length) options.location = locations;
    if (customerCodes.length) options.customerCode = customerCodes;
    if (names.length && selectedGroup === 'BENEFICIARY') {
      options.beneficiaryName = names;
    }
    if (vendorNames.length && selectedGroup === 'BENEFICIARY') {
      options.beneficiaryVendorName = vendorNames;
    }
    if (channels.length && selectedGroup === 'VENDOR') {
      options.vendorChannel = channels;
    }

    const payload = {
      targetType: selectedGroup,
      name: campaignName,
      options: Object.keys(options).length ? options : undefined,
      transportId: selectedTransportId,
      message: messageContent,
      isAutomatic,
    };
    await createCampaign.mutateAsync(payload);
    router.push(`/projects/el-crm/${projectUUID}/communications/messages`);
  };

  const resetForm = () => {
    setSelectedTransportId('');
    setSelectedTransportName('');
    setMessageContent('');
    setSelectedGroup('');
    setFilterRows([]);
    setCampaignName('');
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

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-5">
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/projects/el-crm/${projectUUID}/communications/messages`}
                >
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Back to messages</TooltipContent>
            </Tooltip>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Compose Message
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Create and send a new message to your audience
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Compose Message</CardTitle>
              <CardDescription>
                Follow the steps below to compose and send your message
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
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
                  <div className="ml-10 space-y-3">
                    {isWhatsApp ? (
                      templates.isLoading ? (
                        <p className="text-sm text-muted-foreground">
                          Loading templates…
                        </p>
                      ) : (
                        <>
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
                          <p className="text-xs text-muted-foreground">
                            Or{' '}
                            <button
                              type="button"
                              className="text-primary underline underline-offset-2 hover:text-primary/80"
                              onClick={() =>
                                router.push(
                                  `/projects/el-crm/${projectUUID}/communications/templates/create`,
                                )
                              }
                            >
                              create a new template
                            </button>
                          </p>
                        </>
                      )
                    ) : (
                      <>
                        <Textarea
                          placeholder="Type your message here…"
                          value={messageContent}
                          onChange={(e) => setMessageContent(e.target.value)}
                          rows={4}
                        />
                        {isPlasgate && plasgateSmsInfo && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>
                                {plasgateSmsInfo.encoding === 'GSM-7'
                                  ? 'GSM-7 (English / standard) — up to 160 chars per SMS'
                                  : 'Unicode (symbols, emoji, Khmer, etc.) — up to 70 chars per SMS'}
                              </span>
                              <span
                                className={cn(
                                  (plasgateSmsInfo.exceeded ||
                                    plasgateSmsInfo.remaining <= 10) &&
                                    'text-destructive font-medium',
                                )}
                              >
                                {plasgateSmsInfo.length} / {plasgateSmsInfo.limit}
                              </span>
                            </div>
                            {plasgateSmsInfo.exceeded && (
                              <p className="text-xs text-destructive">
                                Message exceeds the {plasgateSmsInfo.limit}-character
                                limit for {plasgateSmsInfo.encoding} encoding and
                                will be sent as multiple SMS segments.
                              </p>
                            )}
                          </div>
                        )}
                      </>
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

              {/* Step 4: Campaign Details */}
              {selectedGroup && (
                <div className="space-y-4">
                  {/* Automatic Switch */}
                  <div className="flex items-center gap-2">
                    <Switch
                      id="automatic-switch"
                      checked={isAutomatic}
                      onCheckedChange={setIsAutomatic}
                    />
                    <Label
                      htmlFor="automatic-switch"
                      className="text-xs cursor-pointer"
                    >
                      Automatic Campaign
                    </Label>
                  </div>

                  {/* Audience filters (optional) */}
                  {!isAutomatic &&
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
                              const valueOptions = row.field
                                ? FILTER_VALUE_OPTIONS[row.field as FilterField]
                                : undefined;
                              const selectedValuesForField = row.field
                                ? filterRows
                                    .filter(
                                      (r) =>
                                        r.id !== row.id &&
                                        r.field === row.field &&
                                        !!r.value,
                                    )
                                    .map((r) => r.value)
                                : [];
                              return (
                                <div
                                  key={row.id}
                                  className="flex items-center gap-2"
                                >
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
                                        >
                                          {opt.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>

                                  <span className="text-muted-foreground text-sm shrink-0">
                                    =
                                  </span>

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
                                            disabled={
                                              opt.value !== row.value &&
                                              selectedValuesForField.includes(
                                                opt.value,
                                              )
                                            }
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
                                          : row.field === 'name'
                                          ? 'e.g., John Doe'
                                          : row.field === 'vendorName'
                                          ? 'e.g., Apple Store'
                                          : row.field === 'channel'
                                          ? 'e.g., Wholesale'
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

                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5 mt-1 text-muted-foreground"
                              onClick={addFilterRow}
                            >
                              <Plus className="h-3.5 w-3.5" />
                              Add Filter
                            </Button>

                            <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>
                                Estimated recipients:{' '}
                                {audienceEstimate.isLoading || reachableEstimate.isLoading ? (
                                  <span className="italic">calculating…</span>
                                ) : (
                                  (() => {
                                    const matched = audienceEstimate.meta?.total ?? 0;
                                    const reachable = reachableEstimate.meta?.total ?? 0;
                                    return (
                                      <>
                                        <strong className="text-foreground">{matched}</strong>{' '}
                                        {audienceNoun} matched,{' '}
                                        <strong
                                          className={
                                            reachable < matched
                                              ? 'text-amber-600'
                                              : 'text-foreground'
                                          }
                                        >
                                          {reachable}
                                        </strong>{' '}
                                        reachable
                                      </>
                                    );
                                  })()
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-medium">
                        5
                      </div>
                      <span className="font-medium">Campaign Details</span>
                    </div>

                    <div className="ml-10 space-y-4">
                      <div className="space-y-2">
                        <Label>Campaign Name</Label>
                        <Input
                          placeholder="e.g., Welcome Message Campaign"
                          value={campaignName}
                          onChange={(e) => setCampaignName(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" size="sm" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          disabled={!canSubmit || createCampaign.isPending}
                          onClick={() => setIsConfirmDialogOpen(true)}
                          className="gap-2"
                        >
                          <Send className="h-4 w-4" />
                          {createCampaign.isPending
                            ? 'Sending…'
                            : 'Create Message'}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Send the composed message</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!selectedTransportId && (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="rounded-full bg-muted p-4 inline-flex mb-3">
                    <MessageSquare className="h-8 w-8 opacity-50" />
                  </div>
                  <p>Start by selecting a messaging channel above</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Confirm Message Details</DialogTitle>
            <DialogDescription>
              Review message information before sending this campaign.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2 text-sm">
            <DetailRow label="Campaign" value={campaignName || '-'} />
            <DetailRow label="Channel" value={selectedTransportName || '-'} />
            <DetailRow
              label="Message Type"
              value={isWhatsApp ? 'Template' : 'Custom Message'}
            />
            {isWhatsApp ? (
              <DetailRow
                label="Template"
                value={selectedTemplateName || messageContent || '-'}
              />
            ) : (
              <DetailRow
                label="Message"
                value={messageContent || '-'}
                multiline
              />
            )}
            <DetailRow label="Audience" value={selectedGroupName || '-'} />
            <DetailRow
              label="Campaign Mode"
              value={isAutomatic ? 'Automatic' : 'Manual'}
            />
            {!isAutomatic && (
              <DetailRow
                label="Filters"
                value={
                  filterRows.filter((row) => row.field && row.value).length > 0
                    ? filterRows
                        .filter((row) => row.field && row.value)
                        .map((row) => `${row.field}=${row.value}`)
                        .join(', ')
                    : 'No filters applied'
                }
                multiline
              />
            )}
            <DetailRow
              label="Estimated Recipients"
              value={
                audienceEstimate.isLoading || reachableEstimate.isLoading
                  ? 'Calculating...'
                  : `${audienceEstimate.meta?.total ?? 0} matched, ${
                      reachableEstimate.meta?.total ?? 0
                    } reachable`
              }
            />
          </div>

          <DialogFooter className="gap-2">
            {isWhatsApp && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsConfirmDialogOpen(false);
                  router.push(
                    `/projects/el-crm/${projectUUID}/communications/templates/create`,
                  );
                }}
              >
                Create Template
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={createCampaign.isPending}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {createCampaign.isPending ? 'Sending…' : 'Create Message'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

function DetailRow({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className="grid grid-cols-[140px,1fr] gap-3 items-start">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          'font-medium break-words',
          multiline ? 'whitespace-pre-wrap' : '',
        )}
      >
        {value}
      </span>
    </div>
  );
}
