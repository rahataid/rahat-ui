'use client';

import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { PhoneInput } from '@rahat-ui/shadcn/src/components/ui/phone-input';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from 'libs/shadcn/src/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'libs/shadcn/src/components/ui/popover';
import { cn } from 'libs/shadcn/src';
import { Check, ChevronDown } from 'lucide-react';
import { Tag } from 'emblor';
import GctSupportAreaInput from './gct.support-area-input';
import { GctGroupValues } from '../types/gct.schemas';
import { CIPS_BANKS } from '../types/cips-banks';

// ─── Required marker ──────────────────────────────────────────────────────────

function Req() {
  return <span className="text-destructive">*</span>;
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

export function SectionCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-sm border bg-card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}

// ─── Basic Info section ───────────────────────────────────────────────────────

interface BasicInfoSectionProps {
  form: UseFormReturn<GctGroupValues>;
  initialTags?: Tag[];
  shouldDirty?: boolean;
  onUnsavedChange?: (hasUnsaved: boolean) => void;
}

export function BasicInfoSection({
  form,
  initialTags,
  shouldDirty,
  onUnsavedChange,
}: BasicInfoSectionProps) {
  return (
    <SectionCard title="Basic Info">
      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <Label>GCT Group Name <Req /></Label>
              <FormControl>
                <Input placeholder="Enter GCT Group Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <Label>Phone Number <Req /></Label>
              <FormControl>
                <PhoneInput defaultCountry="NP" placeholder="+977" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label>Email (Optional)</Label>
              <FormControl>
                <Input type="text" placeholder="Enter email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="district"
          render={({ field }) => (
            <FormItem>
              <Label>District <Req /></Label>
              <FormControl>
                <Input placeholder="Enter district" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ward"
          render={({ field }) => (
            <FormItem>
              <Label>Ward (Community) <Req /></Label>
              <FormControl>
                <Input placeholder="Enter Ward and community" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="municipality"
          render={({ field }) => (
            <FormItem>
              <Label>Municipality <Req /></Label>
              <FormControl>
                <Input placeholder="Enter municipality" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <GctSupportAreaInput
        form={form}
        initialTags={initialTags}
        shouldDirty={shouldDirty}
        onUnsavedChange={onUnsavedChange}
      />
    </SectionCard>
  );
}

// ─── Bank Details section ─────────────────────────────────────────────────────

interface BankDetailsSectionProps {
  form: UseFormReturn<GctGroupValues>;
}

export function BankDetailsSection({ form }: BankDetailsSectionProps) {
  return (
    <SectionCard title="Bank Details">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="bankCode"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-3">
              <Label className="mt-1">Bank Name <Req /></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn('justify-between font-normal', !field.value && 'text-muted-foreground')}
                    >
                      {field.value
                        ? CIPS_BANKS.find((b) => b.bankId === field.value)?.bankName
                        : 'Select a bank'}
                      <ChevronDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
                  <Command>
                    <CommandInput placeholder="Search bank..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No bank found.</CommandEmpty>
                      <CommandGroup>
                        {CIPS_BANKS.map((b) => (
                          <CommandItem
                            key={b.bankId}
                            value={b.bankName}
                            onSelect={() => {
                              field.onChange(b.bankId);
                              form.setValue('bankName', b.bankName, { shouldDirty: true });
                            }}
                          >
                            {b.bankName}
                            <Check className={cn('ml-auto', b.bankId === field.value ? 'opacity-100' : 'opacity-0')} />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bankBranchName"
          render={({ field }) => (
            <FormItem>
              <Label>Bank Branch Name <Req /></Label>
              <FormControl>
                <Input placeholder="Enter Bank's Branch Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accountName"
          render={({ field }) => (
            <FormItem>
              <Label>Bank Account Holder Name <Req /></Label>
              <FormControl>
                <Input placeholder="Enter Bank Account Holder Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem>
              <Label>Bank Account Number <Req /></Label>
              <FormControl>
                <Input placeholder="Enter Bank Account Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </SectionCard>
  );
}
