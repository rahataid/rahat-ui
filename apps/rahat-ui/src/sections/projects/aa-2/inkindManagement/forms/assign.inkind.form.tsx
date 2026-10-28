'use client';

import { useTranslations } from 'next-intl';
import React, { useRef, useState } from 'react';
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
  buildAssignInkindOfflineSchema,
  buildAssignInkindSchema,
  AssignInkindValues,
} from './schema/inkinds.schema';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';

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
  const tv = useTranslations('AA_PROJECT_WITH_GNOSIS');
  const tg = useTranslations('GLOBAL');
  const tAA = useTranslations('AA_PROJECT');
  const formatDigits = useLabelDigits();
  const { id } = useParams();
  const projectUUID = id as UUID;

  const [inkindOpen, setInkindOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [vendorOpen, setVendorOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  const isOfflineRef = useRef(false);

  const form = useForm<AssignInkindValues>({
    resolver: (values, context, options) => {
      const schema = isOfflineRef.current
        ? buildAssignInkindOfflineSchema(tAA)
        : buildAssignInkindSchema(tAA);
      return zodResolver(schema)(values, context, options);
    },
    defaultValues: { inkindId: '', groupId: '', vendorId: '' },
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
    const newOffline = !checked;
    setIsOffline(newOffline);
    isOfflineRef.current = newOffline;
    if (checked) {
      setSelectedVendor(null);
      setValue('vendorId', '');
    }
  };

  const onSubmit = (data: AssignInkindValues) => {
    const availableStock = selectedInkind?.availableStock ?? 0;

    onNext({
      ...data,
      inkindName: selectedInkind?.name ?? '',
      groupName: selectedGroup?.name ?? '',
      availableStock,
      beneficiaryCount: 0,
      mode: isOffline ? PayoutMode.OFFLINE : PayoutMode.ONLINE,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="border rounded-sm p-4 flex flex-col space-y-4">
          <div className="flex items-center justify-between ">
            <p className="text-base font-semibold">{tv('ASSIGN_INKIND_TO_GROUP')}</p>

            <div className="flex items-center space-x-3">
              <Switch
                checked={!isOffline}
                onCheckedChange={handleModeToggle}
                id="assign-mode-switch"
              />
              <Label htmlFor="assign-mode-switch">
                {tv('ASSIGN_MODE')}{' '}
                <span className="font-semibold">
                  {isOffline ? tv('OFFLINE') : tv('ONLINE')}
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
                  {tv('INKIND_ITEM')}
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
                          : tv('SELECT_INKIND_ITEM')}
                        <ChevronDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
                    <Command>
                      <CommandInput
                        placeholder={tv('SEARCH_INKIND_ITEMS')}
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>{tv('NO_ITEMS_FOUND')}</CommandEmpty>
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
                                setValue('vendorId', '');
                                setSelectedVendor(null);
                                setInkindOpen(false);
                              }}
                            >
                              <span className="flex-1">{item.name}</span>
                              <span className="text-xs text-muted-foreground mr-2">
                                {tv('STOCK_LABEL')}{' '}
                                {formatDigits(item.availableStock ?? 0)}
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
                    {tv('AVAILABLE_STOCK_WITH_COLON')}{' '}
                    <span className="font-semibold text-primary">
                      {formatDigits(selectedInkind.availableStock ?? 0)}
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
                  {tv('BENEFICIARY_GROUP')}
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
                          : tv('BENEFICIARY_GROUP')}
                        <ChevronDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
                    <Command>
                      <CommandInput
                        placeholder={tv('SEARCH_GROUPS')}
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>{tv('NO_GROUPS_FOUND')}</CommandEmpty>
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
                    {tv('SELECTED_GROUP')}{' '}
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
            <FormField
              control={control}
              name="vendorId"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-3 w-full">
                  <div className="flex items-center justify-between">
                    <FormLabel className="mt-1 text-base font-medium">
                      {tv('SELECT_VENDOR')}
                    </FormLabel>

                  </div>
                  <Popover open={vendorOpen} onOpenChange={setVendorOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'justify-between font-normal w-full',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {selectedVendor
                            ? `${selectedVendor.name ?? 'N/A'} `
                            : tv('SELECT_VENDOR')}
                          <ChevronDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
                      <Command>
                        <CommandInput
                          placeholder={tv('SEARCH_VENDORS')}
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>{tv('NO_VENDORS_FOUND')}</CommandEmpty>
                          <CommandGroup>
                            {vendorItems.map((item: any) => (
                              <CommandItem
                                key={item.uuid}
                                value={item.name}
                                onSelect={() => {
                                  setValue('vendorId', item.uuid, {
                                    shouldValidate: true,
                                  });
                                  setSelectedVendor(item);
                                  setVendorOpen(false);
                                }}
                              >
                                <span className="flex-1">{item.name}</span>
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    field.value === item.uuid
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
                  {selectedVendor && (
                    <p className="text-xs text-muted-foreground -mt-1">
                      {tv('SELECTED_VENDOR')}{' '}
                      <span className="font-semibold text-primary">
                        {selectedVendor.name}
                      </span>
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
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
                {tg('CLEAR')}
              </Button>
              <Button type="submit" className="px-10 rounded-sm w-40">
                {tg('CONTINUE')}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
