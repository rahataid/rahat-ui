'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import {
  useInkinds,
  useGetUnassignedGroupInkind,
  PayoutMode,
  useAAVendorsList,
} from '@rahat-ui/query';
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
import {
  AssignInkindSchema,
  AssignInkindValues,
} from './schema/inkinds.schema';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';

interface Props {
  onNext: (
    data: AssignInkindValues & {
      inkindName: string;
      groupName: string;
      availableStock: number;
      beneficiaryCount: number;
      mode: PayoutMode;
      vendorId?: string;
      vendorName?: string;
    },
  ) => void;
}

export default function AssignInkindForm({ onNext }: Props) {
  const { id } = useParams();
  const projectUUID = id as UUID;

  const [inkindOpen, setInkindOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [vendorOpen, setVendorOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  const form = useForm<AssignInkindValues>({
    resolver: zodResolver(AssignInkindSchema),
    defaultValues: { inkindId: '', groupId: '' },
  });

  const { control, handleSubmit, watch, setValue } = form;

  const selectedInkindId = watch('inkindId');
  const selectedGroupId = watch('groupId');

  const { data: inkindsData } = useInkinds(projectUUID, {
    perPage: 1000,
    order: 'asc',
    sort: 'name',
  });

  const inkindItems: any[] = (inkindsData?.data ?? []).filter(
    (i: any) => i.type === 'PRE_DEFINED',
  );

  const { data: unassignedGroupsData } = useGetUnassignedGroupInkind(
    projectUUID,
    selectedInkindId,
  );
  const groups: any[] = unassignedGroupsData?.data ?? [];

  const { data: vendors } = useAAVendorsList({
    projectUUID: projectUUID,
    page: 1,
    perPage: 100,
    order: 'desc',
    sort: 'createdAt',
  });

  const vendorItems: any[] = vendors?.data ?? [];

  const selectedInkind = inkindItems.find((i) => i.uuid === selectedInkindId);
  const selectedGroup = groups.find((g: any) => g.uuid === selectedGroupId);

  const handleModeToggle = (checked: boolean) => {
    setIsOffline(!checked);
    if (checked) {
      setSelectedVendor(null);
    }
  };

  const canContinue = isOffline ? !!selectedVendor : true;

  const onSubmit = (data: AssignInkindValues) => {
    const availableStock = selectedInkind?.availableStock ?? 0;

    onNext({
      ...data,
      inkindName: selectedInkind?.name ?? '',
      groupName: selectedGroup?.name ?? '',
      availableStock,
      beneficiaryCount: 0,
      mode: isOffline ? PayoutMode.OFFLINE : PayoutMode.ONLINE,
      ...(isOffline && selectedVendor
        ? {
            vendorId: selectedVendor.uuid,
          }
        : {}),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="border rounded-sm p-4 flex flex-col space-y-4">
          <div className="flex items-center justify-between ">
            <p className="text-base font-semibold">Assign Inkind to Group</p>

            <div className="flex items-center space-x-3">
              <Switch
                checked={!isOffline}
                onCheckedChange={handleModeToggle}
                id="assign-mode-switch"
              />
              <Label htmlFor="assign-mode-switch">
                Assign mode:{' '}
                <span className="font-semibold">
                  {isOffline ? 'Offline' : 'Online'}
                </span>
              </Label>
            </div>
          </div>
          {/* InKind Item */}
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
                          : 'Select InKind Item'}
                        <ChevronDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
                    <Command>
                      <CommandInput
                        placeholder="Search inkind items..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No items found.</CommandEmpty>
                        <CommandGroup>
                          {inkindItems.map((item: any) => (
                            <CommandItem
                              key={item.uuid}
                              value={item.name}
                              onSelect={() => {
                                setValue('inkindId', item.uuid, {
                                  shouldValidate: true,
                                });
                                setValue('groupId', '');
                                setSelectedVendor(null);
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

          {/* Beneficiary Group */}
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
                        disabled={!selectedInkindId}
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
                          {groups.map((group: any) => (
                            <CommandItem
                              key={group.uuid}
                              value={group.name}
                              onSelect={() => {
                                setValue('groupId', group.uuid, {
                                  shouldValidate: true,
                                });
                                setGroupOpen(false);
                              }}
                            >
                              <span className="flex-1">{group.name}</span>
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
                    Selected group:{' '}
                    <span className="font-semibold text-primary">
                      {selectedGroup.name}
                    </span>
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Vendor selection — shown only in offline mode */}
          {isOffline && (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-base font-medium">Select Vendor</p>
                {selectedVendor && (
                  <p className="text-xs text-muted-foreground">
                    Selected:{' '}
                    <span className="font-semibold text-primary">
                      {selectedVendor.inkind?.name}
                    </span>
                  </p>
                )}
              </div>
              <Popover open={vendorOpen} onOpenChange={setVendorOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    className={cn(
                      'justify-between font-normal w-full',
                      !selectedVendor && 'text-muted-foreground',
                    )}
                  >
                    {selectedVendor
                      ? `${selectedVendor.name ?? 'N/A'} `
                      : 'Select Vendor'}
                    <ChevronDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
                  <Command>
                    <CommandInput
                      placeholder="Search vendors..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No vendors found.</CommandEmpty>
                      <CommandGroup>
                        {vendorItems.map((item: any) => (
                          <CommandItem
                            key={item.uuid}
                            value={item.name}
                            onSelect={() => {
                              setSelectedVendor(item);
                              setVendorOpen(false);
                            }}
                          >
                            <span className="flex-1">{item.name}</span>

                            <Check
                              className={cn(
                                'ml-auto',
                                selectedVendor?.uuid === item.uuid
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
                {selectedVendor && (
                  <p className="text-xs text-muted-foreground -mt-1">
                    Selected Vendor:{' '}
                    <span className="font-semibold text-primary">
                      {selectedVendor.name}
                    </span>
                  </p>
                )}
              </Popover>
            </div>
          )}

          <div className="flex justify-end items-center">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setIsOffline(false);
                  setSelectedVendor(null);
                }}
                className="px-10 rounded-sm w-40"
              >
                Clear
              </Button>
              <Button
                type="submit"
                disabled={!canContinue}
                className="px-10 rounded-sm w-40"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
