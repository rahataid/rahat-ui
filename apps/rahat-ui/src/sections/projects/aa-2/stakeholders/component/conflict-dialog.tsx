'use client';
import {
  Dialog,
  DialogContent,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Lock } from 'lucide-react';

interface Activity {
  id: string;
  name: string;
  type?: string;
}

export type ConflictDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activities?: Activity[] | string[];
  groupNames?: Activity[] | string[];
  items?: Activity[] | string[];
  groupName?: string;
  stakeholderName?: string;
  entityName?: string;
  title?: string;
  description?: string;
  closeButtonText?: string;
  conflictType?: 'group' | 'stakeholder';
};

export function ConflictDialog({
  open,
  onOpenChange,
  activities,
  groupNames,
  items,
  groupName,
  stakeholderName,
  entityName,
  title,
  closeButtonText = 'Understood',
  conflictType,
}: ConflictDialogProps) {
  // Determine the conflict type and data to use
  const isStakeholderConflict =
    conflictType === 'stakeholder' || groupNames || stakeholderName;
  const conflictItems = items || activities || groupNames || [];
  const displayName =
    entityName ||
    groupName ||
    stakeholderName ||
    (isStakeholderConflict ? 'Stakeholder' : 'Stakeholder Group');

  // Auto-detect conflict type if not provided
  const detectedType = isStakeholderConflict ? 'stakeholder' : 'group';

  // Set appropriate defaults based on conflict type
  const defaultTitle =
    detectedType === 'stakeholder'
      ? 'Cannot Delete Stakeholder'
      : 'Cannot Delete Group';
  const finalTitle = title || defaultTitle;

  // Convert items to Activity[] format
  const itemsList: Activity[] = conflictItems.map((item, index) => {
    if (typeof item === 'string') {
      return { id: index.toString(), name: item };
    }
    return item;
  });

  // Configure messaging based on conflict type
  const config = {
    stakeholder: {
      conflictDescription: `This stakeholder is currently linked to ${
        itemsList.length
      } stakeholder group${
        itemsList.length !== 1 ? 's' : ''
      } which are assigned to activities. Remove it from all of them to delete the stakeholder.`,
      listTitle: 'Stakeholder Groups:',
      // nextStep: 'Navigate to each stakeholder group listed above and remove this stakeholder from them. Once removed from all groups, you\'ll be able to delete the stakeholder.',
    },
    group: {
      conflictDescription: `This stakeholder group is currently linked to ${
        itemsList.length
      } active communication${
        itemsList.length !== 1 ? 's' : ''
      }. Remove it from all of them to delete the group.`,
      listTitle: 'Communications:',
      // nextStep: 'Navigate to each communication listed above and unlink this group. Once removed from all communications, you\'ll be able to delete it.',
    },
  };

  const currentConfig = config[detectedType as keyof typeof config];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-red-200/50 bg-gradient-to-br from-slate-50 via-white to-slate-50 shadow-2xl sm:rounded-2xl">
        {/* Header Icon */}
        <div className="flex justify-center pt-2">
          <div className="rounded-full bg-red-100 p-4">
            <Lock className="h-8 w-8 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-slate-900">{finalTitle}</h2>
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">
              {`"${displayName}"`}
            </span>{' '}
            is still in use
          </p>
        </div>

        {/* Description */}
        <div className="space-y-4 pt-2">
          <p className="text-sm text-slate-700">
            {currentConfig.conflictDescription}
          </p>

          {/* Items List */}
          <div className="space-y-2 rounded-lg bg-slate-900/5 p-4 max-h-72 overflow-y-auto">
            {detectedType === 'stakeholder' && (
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                {currentConfig.listTitle}
              </div>
            )}
            {itemsList.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg bg-white p-3 transition-all hover:shadow-sm"
              >
                <div className="flex flex-1 items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  <span className="truncate text-sm font-medium text-slate-900">
                    {item.name}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Help Text */}
          {/* <div className="rounded-lg border border-amber-200/50 bg-amber-50/50 p-3">
            <p className="text-xs leading-relaxed text-amber-900/75">
              <span className="font-semibold">Next step:</span> {currentConfig.nextStep}
            </p>
          </div> */}
        </div>

        {/* Footer */}
        <div className="flex gap-2 pt-2">
          <Button onClick={() => onOpenChange(false)} className="w-full ">
            {closeButtonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
