'use client';

import { useMemo, useState } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import { Input } from '@rahat-ui/shadcn/components/input';
import { Badge } from '@rahat-ui/shadcn/components/badge';
import { Textarea } from '@rahat-ui/shadcn/components/textarea';
import { Label } from '@rahat-ui/shadcn/components/label';
import { cn } from '@rahat-ui/shadcn/src/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import {
  useCreateElCrmCampaign,
  useCustomers,
  useListElCrmTemplate,
  useListElCrmTransport,
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

  // Progressive wizard state
  const [selectedTransportId, setSelectedTransportId] = useState('');
  const [selectedTransportName, setSelectedTransportName] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [filterRows, setFilterRows] = useState<FilterRow[]>([]);
  const [campaignName, setCampaignName] = useState('');

  // Data hooks
  const transport = useListElCrmTransport(projectUUID);
  const templates = useListElCrmTemplate(projectUUID, { status: 'APPROVED' });
  const createCampaign = useCreateElCrmCampaign(projectUUID);

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

  const handleSubmit = async () => {
    const options: Record<string, string | undefined> = {};

    for (const row of filterRows) {
      if (!row.field || !row.value) continue;
      if (row.field === 'category') options.vendorStatus = row.value;
      else if (row.field === 'source') options.vendorSource = row.value;
      else if (row.field === 'location') options.location = row.value;
      else if (row.field === 'isVerified')
        options.beneficiaryIsVerified = row.value;
    }

    const payload = {
      targetType: selectedGroup,
      name: campaignName,
      options: Object.keys(options).length ? options : undefined,
      transportId: selectedTransportId,
      message: messageContent,
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

              {/* Step 4: Campaign Details */}
              {selectedGroup && (
                <div className="space-y-4">
                  {/* Audience filters (optional) */}
                  {(() => {
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
                            <span className="font-medium">Filter Audience</span>
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
                              ? FILTER_VALUE_OPTIONS[row.field as FilterField]
                              : undefined;
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

                          {filterRows.length < activeFieldOptions.length && (
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

                          {selectedGroup === 'VENDOR' && (
                            <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>
                                Estimated recipients:{' '}
                                {recipientEstimate.isLoading ? (
                                  <span className="italic">calculating…</span>
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
                          onClick={handleSubmit}
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
