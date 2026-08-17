'use client';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { cn } from '@rahat-ui/shadcn/src';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@rahat-ui/shadcn/src/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import React from 'react';

interface Group {
  uuid: string;
  name: string;
}

interface ImportDestinationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: Group[];
  onConfirm: (groupName: string | null) => void;
}

export default function ImportDestinationDialog({
  open,
  onOpenChange,
  groups,
  onConfirm,
}: ImportDestinationDialogProps) {
  const [useExisting, setUseExisting] = React.useState(false);
  const [groupName, setGroupName] = React.useState<string | null>(null);
  const [groupPopoverOpen, setGroupPopoverOpen] = React.useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setUseExisting(false);
      setGroupName(null);
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Import Beneficiaries</DialogTitle>
          <DialogDescription>
            Where do you want to import these beneficiaries?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div
            className={cn(
              'flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors',
              useExisting ? 'border-primary bg-primary/5' : 'border-gray-200',
            )}
            onClick={() => setUseExisting(true)}
          >
            <div
              className={cn(
                'mt-0.5 h-4 w-4 rounded-full border-2 flex-shrink-0',
                useExisting ? 'border-primary bg-primary' : 'border-gray-400',
              )}
            />
            <div className="flex-1 space-y-2">
              <p className="font-medium text-sm">
                Import into an existing group
              </p>
              {useExisting && (
                <Popover
                  open={groupPopoverOpen}
                  onOpenChange={setGroupPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="secondary"
                      role="combobox"
                      className="w-full justify-between font-normal text-muted-foreground hover:text-muted-foreground bg-white hover:bg-white border"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {groupName ?? 'Select group'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 h-[200px]">
                    <Command>
                      <CommandInput placeholder="Search group..." />
                      <CommandList>
                        <CommandEmpty>No group found.</CommandEmpty>
                        <CommandGroup>
                          {groups.map((item) => (
                            <CommandItem
                              key={item.uuid}
                              value={item.name}
                              onSelect={() => {
                                setGroupName(item.name);
                                setGroupPopoverOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  item.name === groupName
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {item.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>

          <div
            className={cn(
              'flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors',
              !useExisting ? 'border-primary bg-primary/5' : 'border-gray-200',
            )}
            onClick={() => setUseExisting(false)}
          >
            <div
              className={cn(
                'mt-0.5 h-4 w-4 rounded-full border-2 flex-shrink-0',
                !useExisting ? 'border-primary bg-primary' : 'border-gray-400',
              )}
            />
            <div>
              <p className="font-medium text-sm">Proceed without a group</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                A group will be auto-created by the system
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={useExisting && !groupName}
            onClick={() => {
              handleOpenChange(false);
              onConfirm(useExisting ? groupName : null);
            }}
            className="bg-primary hover:ring-2 ring-primary"
          >
            Import Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
