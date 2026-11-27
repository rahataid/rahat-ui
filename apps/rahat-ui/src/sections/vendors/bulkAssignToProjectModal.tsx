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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@rahat-ui/shadcn/src/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import { UUID } from 'crypto';
import { ChevronDown, InfoIcon } from 'lucide-react';
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
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const projectsList = useProjectList({ page: 1, perPage: 1000 });

  useEffect(() => {
    if (!open) {
      setSelectedProjects([]);
      setProjectDropdownOpen(false);
    }
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
        <Alert className="flex items-center gap-2 rounded-sm border-amber-500/40 bg-amber-50 text-amber-900 [&>svg]:static [&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0 [&>svg]:translate-y-0 [&>svg~*]:pl-0 [&>svg+div]:translate-y-0">
          <InfoIcon aria-hidden="true" color="#78350f" size={20} />
          <AlertDescription className="min-w-0">
            {t('ALREADY_ASSIGNED_VENDORS_WILL_BE_SKIPPED')}
          </AlertDescription>
        </Alert>
        <Popover
          open={projectDropdownOpen}
          onOpenChange={setProjectDropdownOpen}
          modal={false}
        >
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={projectDropdownOpen}
              className="w-full justify-between font-normal"
              disabled={isAssigning}
            >
              {selectedProjects.length > 0
                ? t('PROJECTS_SELECTED', { count: selectedProjects.length })
                : t('SELECT_PROJECTS')}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-[--radix-popover-trigger-width] p-0"
          >
            <Command>
              <CommandInput placeholder={g('SEARCH')} />
              <CommandList className="max-h-60">
                <CommandEmpty>{t('NO_PROJECT_FOUND')}</CommandEmpty>
                <CommandGroup>
                  {projectsList.data?.data?.map((project) => {
                    const projectUUID = project.uuid as UUID;
                    const isSelected = selectedProjects.includes(projectUUID);

                    return (
                      <CommandItem
                        key={project.uuid}
                        value={`${project.name} ${project.uuid}`}
                        onSelect={() => toggleProject(projectUUID, !isSelected)}
                        disabled={isAssigning}
                      >
                        <Checkbox
                          checked={isSelected}
                          aria-hidden="true"
                          tabIndex={-1}
                          className="pointer-events-none mr-2"
                        />
                        {project.name}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

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
