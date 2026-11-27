'use client';

import { useProjectList } from '@rahat-ui/query';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/components/dialog';
import { Alert, AlertDescription } from '@rahat-ui/shadcn/components/alert';
import { Checkbox } from '@rahat-ui/shadcn/components/checkbox';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { UUID } from 'crypto';
import { InfoIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedVendorCount: number;
  isAssigning: boolean;
  onSubmit: (projectUUIDs: UUID[]) => void;
};

export default function BulkAssignToProjectModal({
  open,
  onOpenChange,
  selectedVendorCount,
  isAssigning,
  onSubmit,
}: Props) {
  const g = useTranslations('GLOBAL');
  const t = useTranslations('VENDORS_LIST');
  const [selectedProjects, setSelectedProjects] = useState<UUID[]>([]);
  const projectsList = useProjectList({ page: 1, perPage: 1000 });

  useEffect(() => {
    if (!open) setSelectedProjects([]);
  }, [open]);

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
  };

  const toggleProject = (projectUUID: UUID, checked: boolean) => {
    setSelectedProjects((current) =>
      checked
        ? [...current, projectUUID]
        : current.filter((uuid) => uuid !== projectUUID),
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{g('ASSIGN_PROJECT')}</DialogTitle>
          <DialogDescription>
            {t('SELECT_A_PROJECT_TO_ASSIGN_SELECTED_VENDORS', {
              count: selectedVendorCount,
            })}
          </DialogDescription>
        </DialogHeader>
        <Alert className="flex justify-between items-center w-[90%] h-[60px] border-amber-500/40 bg-amber-50 rounded-sm text-amber-900 ">
          <InfoIcon color="#78350f" size={20} />
          <AlertDescription>
            {t('ALREADY_ASSIGNED_VENDORS_WILL_BE_SKIPPED')}
          </AlertDescription>
        </Alert>

        <div className="max-h-60 space-y-2 overflow-y-auto">
          {projectsList.data?.data?.map((project) => (
            <div key={project.uuid} className="flex items-center gap-2">
              <Checkbox
                id={`project-${project.uuid}`}
                checked={selectedProjects.includes(project.uuid as UUID)}
                onCheckedChange={(checked) =>
                  toggleProject(project.uuid as UUID, checked === true)
                }
                disabled={isAssigning}
              />
              <label
                htmlFor={`project-${project.uuid}`}
                className="cursor-pointer"
              >
                {project.name}
              </label>
            </div>
          ))}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost" disabled={isAssigning}>
              {g('CLOSE')}
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="ghost"
            className="text-primary"
            disabled={selectedProjects.length === 0 || isAssigning}
            onClick={() => onSubmit(selectedProjects)}
          >
            {g('ASSIGN')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
