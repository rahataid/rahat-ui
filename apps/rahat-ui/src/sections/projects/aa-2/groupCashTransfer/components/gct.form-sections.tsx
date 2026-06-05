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
import { PhoneInput } from '@rahat-ui/shadcn/src/components/ui/phone-input';
import { Tag } from 'emblor';
import GctSupportAreaInput from './gct.support-area-input';
import { GctGroupValues } from '../types/gct.schemas';

// ─── Required marker ──────────────────────────────────────────────────────────

function Req() {
  return <span className="text-destructive">*</span>;
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

export function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-sm border bg-card space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        {title}
      </h3>
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
          name="bankName"
          render={({ field }) => (
            <FormItem>
              <Label>Bank Name <Req /></Label>
              <FormControl>
                <Input placeholder="Enter Bank Name" {...field} />
              </FormControl>
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
