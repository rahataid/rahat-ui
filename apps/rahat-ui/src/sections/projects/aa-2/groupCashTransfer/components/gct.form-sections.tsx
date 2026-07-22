'use client';
import { useTranslations } from 'next-intl';

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
  titleKey,
  action,
  children,
}: {
  title?: string;
  titleKey?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const t = useTranslations('AA Project with Cash Tracker');

  return (
    <div className="p-4 rounded-sm border bg-card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {titleKey ? t(titleKey) : title}
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
  const t = useTranslations('AA Project with Cash Tracker');
  const tGlobal = useTranslations('GLOBAL');
  return (
    <SectionCard titleKey="BASIC_INFO">
      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <Label>{t('GCT_GROUP_NAME')} <Req /></Label>
              <FormControl>
                <Input placeholder={t('ENTER_GCT_GROUP_NAME')} {...field} />
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
              <Label>{tGlobal('PHONE_NUMBER')} <Req /></Label>
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
              <Label>{t('EMAIL_OPTIONAL')}</Label>
              <FormControl>
                <Input type="text" placeholder={t('ENTER_EMAIL_ADDRESS')} {...field} />
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
              <Label>{t('DISTRICT')} <Req /></Label>
              <FormControl>
                <Input placeholder={t('ENTER_DISTRICT')} {...field} />
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
              <Label>{tGlobal('WARD_COMMUNITY')} <Req /></Label>
              <FormControl>
                <Input placeholder={t('ENTER_WARD_AND_COMMUNITY')} {...field} />
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
              <Label>{tGlobal('MUNICIPALITY')} <Req /></Label>
              <FormControl>
                <Input placeholder={t('ENTER_MUNICIPALITY')} {...field} />
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
  const t = useTranslations('AA Project with Cash Tracker');
  return (
    <SectionCard titleKey="BANK_DETAILS">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="bankCode"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-3">
              <Label className="mt-1">{t('BANK_NAME')} <Req /></Label>
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
                        : t('SELECT_A_BANK')}
                      <ChevronDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
                  <Command>
                    <CommandInput placeholder={t('SEARCH_BANK')} className="h-9" />
                    <CommandList>
                      <CommandEmpty>{t('NO_BANK_FOUND')}</CommandEmpty>
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
              <Label>{t('BANK_BRANCH_NAME')} <Req /></Label>
              <FormControl>
                <Input placeholder={t('ENTER_BANK_BRANCH_NAME')} {...field} />
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
              <Label>{t('ACCOUNT_HOLDER_NAME')} <Req /></Label>
              <FormControl>
                <Input placeholder={t('ENTER_BANK_ACCOUNT_HOLDER_NAME')} {...field} />
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
              <Label>{t('ACCOUNT_NUMBER')} <Req /></Label>
              <FormControl>
                <Input placeholder={t('ENTER_BANK_ACCOUNT_NUMBER')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </SectionCard>
  );
}
