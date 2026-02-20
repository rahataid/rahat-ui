'use client';
import {
  Dialog,
  DialogContent,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ExternalLink, Lock } from 'lucide-react';

interface Activity {
  id: string;
  name: string;
  type?: string;
}

export type ConflictDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activities: Activity[] | string[];
  groupName?: string;
  title?: string;
  description?: string;
  closeButtonText?: string;
};

export function ConflictDialog({
  open,
  onOpenChange,
  activities,
  groupName = 'Stakeholder Group',
  title = 'Cannot Delete Group',
  closeButtonText = 'Understood',
}: ConflictDialogProps) {
  // Convert string[] to Activity[] if needed
  const activitiesList: Activity[] = activities.map((activity) => {
    if (typeof activity === 'string') {
      return { id: activity, name: activity };
    }
    return activity;
  });

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
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">
              {`"${groupName}"`}
            </span>{' '}
            is still in use
          </p>
        </div>

        {/* Description */}
        <div className="space-y-4 pt-2">
          <p className="text-sm text-slate-700">
            This stakeholder group is currently linked to{' '}
            <span className="font-semibold">{activitiesList.length}</span>{' '}
            active communication
            {activitiesList.length !== 1 ? 's' : ''}. Remove it from all of them
            to delete the group.
          </p>

          {/* Activities List */}
          <div className="space-y-2 rounded-lg bg-slate-900/5 p-4">
            {activitiesList.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between rounded-lg bg-white p-3 transition-all hover:shadow-sm"
              >
                <button
                  className="flex flex-1 items-center gap-2 text-left"
                  type="button"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  <span className="truncate text-sm font-medium text-slate-900 transition-color">
                    {activity.name}
                  </span>
                </button>
                {/* <ExternalLink className="h-3.5 w-3.5" /> */}
              </div>
            ))}
          </div>

          {/* Help Text */}
          {/* <div className="rounded-lg border border-amber-200/50 bg-amber-50/50 p-3">
            <p className="text-xs leading-relaxed text-amber-900/75">
              <span className="font-semibold">Next step:</span> Click an
              activity name or the Go button to navigate to it, then unlink this
              group. Once removed from all communications, {`you'll`} be able to
              delete it.
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
