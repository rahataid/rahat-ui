'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@rahat-ui/shadcn/src/components/ui/command';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import { X } from 'lucide-react';
import React from 'react';
import { simpleString } from '../../utils';

type FieldDef = { uuid: string; name: string };

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labels: string[];
  onLabelsChange: (labels: string[]) => void;
  sortedSelectables: FieldDef[];
  onDownload: () => void;
};

export default function DownloadDialog({
  open,
  onOpenChange,
  labels,
  onLabelsChange,
  sortedSelectables,
  onDownload,
}: Props) {
  const handleUnselect = (item: string) => {
    onLabelsChange(labels.filter((s) => s !== item));
  };

  const handleSelectChange = (item: string) => {
    if (item === 'Select All') {
      onLabelsChange(
        sortedSelectables
          .filter((s) => s.name !== 'Select All')
          .map((s) => simpleString(s.name)),
      );
      return;
    }
    onLabelsChange([...labels, simpleString(item)]);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full">
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="flex justify-between items-center pb-1 gap-4">
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger>
                    <Label className="text-lg font-medium">
                      Select fields to download
                    </Label>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger onClick={() => onOpenChange(false)}>
                    <X
                      className="text-muted-foreground hover:text-foreground text-red-700"
                      size={23}
                      strokeWidth={1.9}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Close</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <ScrollArea
              className={`${
                labels.length < 10 ? 'h-32' : 'h-52'
              } w-[95%] border m-2 pt-1 pb-1 text-sm rounded-md shadow-lg cursor-pointer bg-white`}
              hidden={labels.length === 0}
            >
              {labels.map((item) => (
                <Badge key={item} variant="secondary" className="m-1">
                  {item}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUnselect(item);
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(item)}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))}
              {labels.length === 0 && (
                <h1 className="text-center">No fields selected</h1>
              )}
            </ScrollArea>
            <Command className="h-52">
              <CommandInput placeholder="Search field..." autoFocus={true} />
              <CommandList className="no-scrollbar">
                <CommandEmpty>No field found.</CommandEmpty>
                <CommandGroup>
                  {sortedSelectables.map((item) => (
                    <CommandItem
                      key={item.uuid}
                      value={item.name}
                      onSelect={() => handleSelectChange(item.name)}
                    >
                      {simpleString(item.name)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => onLabelsChange(['uuid'])}
            disabled={labels.length <= 1}
          >
            Clear All
          </Button>
          <AlertDialogAction onClick={onDownload} disabled={labels.length === 0}>
            Download
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
