'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useInkinds, useBeneficiaryGroups } from '@rahat-ui/query';
import { BeneficiaryGroupListItem } from '@rahat-ui/types';
import { cn } from 'libs/shadcn/src';
import { Button } from 'libs/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'libs/shadcn/src/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'libs/shadcn/src/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from 'libs/shadcn/src/components/ui/command';
import { Check, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';

export const AssignInkindSchema = z.object({
  inkindId: z.string().min(1, 'Please select an in-kind item'),
  groupId: z.string().min(1, 'Please select a beneficiary group'),
});

export type AssignInkindValues = z.infer<typeof AssignInkindSchema>;

interface Props {
  onNext: (
    data: AssignInkindValues & {
      inkindName: string;
      groupName: string;
      availableStock: number;
      beneficiaryCount: number;
    },
  ) => void;
}

export default function AssignInkindForm({ onNext }: Props) {
  const { id } = useParams();
  const projectUUID = id as UUID;

  const [inkindOpen, setInkindOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);

  const { data: inkindsData } = useInkinds(projectUUID, {
    perPage: 1000,
    order: 'asc',
    sort: 'name',
  });

  const benGroups = useBeneficiaryGroups(projectUUID, {
    page: 1,
    perPage: 100,
  });

  const inkindItems: any[] = inkindsData?.data ?? [];
  const groups: BeneficiaryGroupListItem[] = benGroups.data ?? [];

  const form = useForm<AssignInkindValues>({
    resolver: zodResolver(AssignInkindSchema),
    defaultValues: { inkindId: '', groupId: '' },
  });

  const { control, handleSubmit, watch, setValue } = form;

  const selectedInkindId = watch('inkindId');
  const selectedGroupId = watch('groupId');

  const selectedInkind = inkindItems.find((i) => i.uuid === selectedInkindId);
  const selectedGroup = groups.find((g) => g.uuid === selectedGroupId);

  const onSubmit = (data: AssignInkindValues) => {
    const availableStock = selectedInkind?.availableStock ?? 0;
    const beneficiaryCount = selectedGroup?._count?.groupedBeneficiaries ?? 0;

    if (beneficiaryCount === 0) {
      toast.error('The selected group has no beneficiaries.');
      return;
    }

    if (availableStock < beneficiaryCount) {
      toast.error(
        `Not enough inkind stock. Available: ${availableStock}, required: ${beneficiaryCount} (one per beneficiary).`,
      );
      return;
    }

    onNext({
      ...data,
      inkindName: selectedInkind?.name ?? '',
      groupName: selectedGroup?.name ?? '',
      availableStock,
      beneficiaryCount,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="border rounded-sm p-4 flex flex-col space-y-4">
          <p className="text-base font-semibold">Assign Inkind to Group</p>
          <FormField
            control={control}
            name="inkindId"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-3 w-full">
                <FormLabel className="mt-1 text-base font-medium">
                  Inkind Item
                </FormLabel>
                <Popover open={inkindOpen} onOpenChange={setInkindOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'justify-between font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value
                          ? inkindItems.find((i) => i.uuid === field.value)
                              ?.name
                          : 'Select In-Kind Item'}
                        <ChevronDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
                    <Command>
                      <CommandInput
                        placeholder="Search in-kind items..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No items found.</CommandEmpty>
                        <CommandGroup>
                          {inkindItems.map((item: any) => (
                            <CommandItem
                              key={item.uuid}
                              value={item.uuid}
                              onSelect={() => {
                                setValue('inkindId', item.uuid, {
                                  shouldValidate: true,
                                });
                                setInkindOpen(false);
                              }}
                            >
                              <span className="flex-1">{item.name}</span>
                              <span className="text-xs text-muted-foreground mr-2">
                                Stock: {item.availableStock ?? 0}
                              </span>
                              <Check
                                className={cn(
                                  'ml-auto',
                                  item.uuid === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedInkind && (
                  <p className="text-xs text-muted-foreground -mt-1">
                    Available stock:{' '}
                    <span className="font-semibold text-primary">
                      {selectedInkind.availableStock ?? 0}
                    </span>
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="groupId"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-3 w-full">
                <FormLabel className="mt-1 text-base font-medium">
                  Beneficiary Group
                </FormLabel>
                <Popover open={groupOpen} onOpenChange={setGroupOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'justify-between font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value
                          ? groups.find((g) => g.uuid === field.value)?.name
                          : 'Select Beneficiary Group'}
                        <ChevronDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
                    <Command>
                      <CommandInput
                        placeholder="Search groups..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No groups found.</CommandEmpty>
                        <CommandGroup>
                          {groups.map((group: BeneficiaryGroupListItem) => (
                            <CommandItem
                              key={group.uuid}
                              value={group.uuid}
                              onSelect={() => {
                                setValue('groupId', group.uuid, {
                                  shouldValidate: true,
                                });
                                setGroupOpen(false);
                              }}
                            >
                              <span className="flex-1">{group.name}</span>
                              <span className="text-xs text-muted-foreground mr-2">
                                {group._count?.groupedBeneficiaries ?? 0}{' '}
                                beneficiaries
                              </span>
                              <Check
                                className={cn(
                                  'ml-auto',
                                  group.uuid === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedGroup && (
                  <p className="text-xs text-muted-foreground -mt-1">
                    Beneficiaries in group:{' '}
                    <span className="font-semibold text-primary">
                      {selectedGroup._count?.groupedBeneficiaries ?? 0}
                    </span>
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end items-center">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                className="px-10 rounded-sm w-40"
              >
                Clear
              </Button>
              <Button type="submit" className="px-10 rounded-sm w-40">
                Next
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
