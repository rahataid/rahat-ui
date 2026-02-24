import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { FileText, Clock, User, ChevronRight } from 'lucide-react';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';
import { Template } from 'apps/rahat-ui/src/types/activities';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

import {
  useBeneficiariesGroupStore,
  useListAllTransports,
  useStakeholdersGroupsStore,
} from '@rahat-ui/query';
import {
  BeneficiaryGroup,
  StakeholderGroup,
  TemplateDetailsDialogProps,
} from '../types';

export function TemplateDetailsDialog({
  open,
  onOpenChange,
  template,
  onSelectTemplate,
  setOpen,
}: TemplateDetailsDialogProps) {
  if (!template) return null;
  const appTransports = useListAllTransports();

  const isCompleted = template.status === 'COMPLETED';
  const stakeholdersGroups: StakeholderGroup[] = useStakeholdersGroupsStore(
    (state) => state.stakeholdersGroups,
  );
  const beneficiaryGroups: BeneficiaryGroup[] = useBeneficiariesGroupStore(
    (state) => state.beneficiariesGroups,
  );
  const getPhaseBadgeColor = (phase: string) => {
    switch (phase?.toUpperCase()) {
      case 'READINESS':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'PREPAREDNESS':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'ACTIVATION':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'NOT_STARTED':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-4 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <h3 className="flex semi-bold items-center gap-2">Activity Title</h3>
          <DialogTitle className="text-xl font-semibold flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <TruncatedCell
                text={template.title}
                maxLength={50}
                className="max-w-[400px] text-wrap"
              />
              <Badge
                className={`${getStatusBadgeVariant(
                  template.status,
                )} border h-6 px-2 text-xs font-medium`}
              >
                {template.status}
              </Badge>
            </div>
            <Button
              type="button"
              onClick={() => {
                onOpenChange(false);
                setOpen(false);
                onSelectTemplate?.(template);
              }}
              className="gap-2"
            >
              Choose Template
              <ChevronRight className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <Separator />

        <ScrollArea className="max-h-[75vh] px-6 pb-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <InfoItem icon={<Clock size={16} />} label="Lead Time">
              {template.leadTime || '—'}
            </InfoItem>

            <InfoItem icon={<User size={16} />} label="Responsibility">
              {template.manager?.name}
            </InfoItem>

            <InfoItem label="Phase">
              <Badge
                className={`${getPhaseBadgeColor(
                  template?.phase?.name,
                )} border`}
              >
                {template.phase?.name}
              </Badge>
            </InfoItem>

            <InfoItem label="Category">{template.category?.name}</InfoItem>
          </div>

          <Separator className="my-6" />

          {/* Description */}
          {template.description && (
            <Section title="Description">
              <p className="text-sm text-muted-foreground text-justify">
                {template.description}
              </p>
            </Section>
          )}

          {/* Notes */}
          {template.notes && (
            <Section title="Notes">
              <p className="text-sm text-muted-foreground">{template.notes}</p>
            </Section>
          )}

          {/* Automation */}
          <Section title="Automation">
            <Badge variant={template.isAutomated ? 'default' : 'outline'}>
              {template.isAutomated ? 'Automated' : 'Manual'}
            </Badge>
          </Section>

          {/* Documents */}
          {template.activityDocuments?.length > 0 && (
            <Section title="Documents">
              <div className="space-y-2">
                {template.activityDocuments.map(
                  (
                    doc: Partial<Template['activityDocuments']>,
                    index: number,
                  ) => (
                    <a
                      key={index}
                      href={doc.mediaURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 border rounded-md hover:bg-muted transition"
                    >
                      <FileText size={16} />
                      <span className="text-sm">{doc.fileName}</span>
                    </a>
                  ),
                )}
              </div>
            </Section>
          )}

          {/* Communications */}
          {template.activityCommunication?.length > 0 && (
            <Section title="Communications">
              <div className="space-y-3">
                {template.activityCommunication.map(
                  (
                    comm: Partial<Template['activityCommunication']>,
                    index: number,
                  ) => {
                    const transportName = appTransports?.find(
                      (t) => t.cuid === comm.transportId,
                    )?.name;
                    const groupName =
                      comm.groupType === 'BENEFICIARY'
                        ? beneficiaryGroups.find((g) => g.uuid === comm.groupId)
                        : stakeholdersGroups.find(
                            (g) => g.uuid === comm.groupId,
                          );
                    return (
                      <div
                        key={index}
                        className="border rounded-lg p-3 bg-muted/40"
                      >
                        <div className="flex items-center justify-between  ">
                          <div className="flex flex-col space-y-1">
                            {/* NEW: Communication Name */}
                            {transportName && (
                              <span className="text-xs font-medium text-muted-foreground">
                                Communication Type: {transportName}
                              </span>
                            )}

                            <span className="text-sm font-medium text-muted-foreground">
                              Title:{comm.communicationTitle}
                            </span>
                          </div>

                          <Badge variant="outline">{comm.groupType}</Badge>
                        </div>

                        {typeof comm.message === 'string' ? (
                          <>
                            {transportName === 'EMAIL' && (
                              <p className="text-sm text-muted-foreground">
                                Subject: {comm.subject}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground text-justify">
                              Message: {comm.message}
                            </p>
                          </>
                        ) : comm.message?.fileName?.endsWith('.mp3') ||
                          comm.message?.fileName?.endsWith('.wav') ? (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">
                              {comm.message.fileName}
                            </p>
                            <audio controls className="w-full">
                              <source
                                src={comm.message.mediaURL}
                                type="audio/mpeg"
                              />
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        ) : (
                          <a
                            href={comm.message?.mediaURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 underline"
                          >
                            {comm.message?.fileName}
                          </a>
                        )}

                        {/* Group Name */}
                        <span className="text-sm font-medium text-muted-foreground">
                          Group Name: {groupName?.name || '—'}
                        </span>
                      </div>
                    );
                  },
                )}
              </div>
            </Section>
          )}

          {/* Completed Info */}
          {isCompleted && (
            <>
              <Separator className="my-6" />
              <Section title="Completion Details">
                <p className="text-sm">
                  Completed By: <strong>{template.completedBy}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  Completed At:{' '}
                  {new Date(template.completedAt).toLocaleString()}
                </p>
              </Section>
            </>
          )}
          {/* <Button
            type="button"
            onClick={() => {
              onOpenChange(false);
              setOpen(false);
              onSelectTemplate?.(template);
            }}
            className="w-full mt-4 gap-2"
          >
            Choose Template
            <ChevronRight className="w-4 h-4" />
          </Button> */}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}

function InfoItem({
  icon,
  label,
  children,
}: {
  icon?: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-2">
      {icon}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="text-sm font-medium">{children}</div>
      </div>
    </div>
  );
}
