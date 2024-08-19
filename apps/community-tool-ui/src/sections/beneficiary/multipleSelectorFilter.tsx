'use client';

import {
  useCommunityBeneficiaryGroupCreate,
  useCommunityBeneficiaryStore,
  useCommunityGroupList,
} from '@rahat-ui/community-query';
import { usePagination } from '@rahat-ui/query';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@rahat-ui/shadcn/components/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { PinIcon, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@rahat-ui/shadcn/src/components/ui/command';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { useState } from 'react';
export default function Filter() {
  const { pagination, filters } = usePagination();
  const [open, setOpen] = useState<boolean>(false);
  const [label, setLabel] = useState<string>('');
  const [grpUUID, setGrpUUID] = useState<string>('');
  const { selectedBeneficiaries, setSelectedBeneficiaries } =
    useCommunityBeneficiaryStore();

  const commuinityBeneficiaryGroupCreate = useCommunityBeneficiaryGroupCreate();

  filters.autoCreated = 'false';
  pagination.perPage = 50;
  pagination.page = 1;
  const { data: groupData } = useCommunityGroupList({
    ...pagination,
    ...filters,
  });

  const totalSelected = selectedBeneficiaries && selectedBeneficiaries.length;

  const handleAssignBeneficiariesGroup = async () => {
    const res = await commuinityBeneficiaryGroupCreate.mutateAsync({
      grpUUID,
      selectedBeneficiaries,
    });
    if (res?.response?.success) {
      setSelectedBeneficiaries([]);
    }
  };

  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="px-2 pb-4 text-muted-foreground"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="no-underline bg-muted hover:bg-primary p-2 rounded hover:text-white">
            {totalSelected}{' '}
            {(totalSelected as number) > 1 ? 'beneficiaries' : 'beneficiary'}{' '}
            selected.
          </AccordionTrigger>
          <AccordionContent className="p-2 flex mt-1">
            <Button
              className="rounded p-2 ml-auto justify-end"
              onClick={() => setOpen(true)}
            >
              Assign Group
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="w-full">
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex justify-between items-center pb-1 gap-4">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Label className="text-lg font-medium">
                        Select Group to assign
                      </Label>
                    </TooltipTrigger>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger
                      onClick={() => {
                        setOpen(false);
                        setLabel('');
                      }}
                    >
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
              <Command className="h-52">
                <CommandInput
                  placeholder={'Search Group...'}
                  autoFocus={true}
                  value={label}
                  onInput={(e) => {
                    setLabel(e.currentTarget.value);
                    setGrpUUID('');
                  }}
                />
                <CommandList className="no-scrollbar">
                  <CommandGroup>
                    {groupData?.data?.rows?.map((item: any) => (
                      <CommandItem
                        key={item.uuid}
                        value={item.name}
                        onSelect={() => {
                          setLabel(item.name);
                          setGrpUUID(item.uuid);
                        }}
                      >
                        {item.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAssignBeneficiariesGroup}
              disabled={grpUUID === '' || label === ''}
            >
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
