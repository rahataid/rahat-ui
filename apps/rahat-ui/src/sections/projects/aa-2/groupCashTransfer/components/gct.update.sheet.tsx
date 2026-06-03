'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UUID } from 'crypto';
import { Loader2 } from 'lucide-react';
import { Tag, TagInput } from 'emblor';
import { isValidPhoneNumber } from 'react-phone-number-input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@rahat-ui/shadcn/src/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { PhoneInput } from '@rahat-ui/shadcn/src/components/ui/phone-input';
import { useUpdateGroupCashTransfer } from '@rahat-ui/query';

// ─── Schema ───────────────────────────────────────────────────────────────────

const UpdateGctSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z
    .string()
    .optional()
    .refine((v) => !v || v === '+977' || isValidPhoneNumber(v), {
      message: 'Invalid phone number',
    }),
  district: z.string().optional(),
  municipality: z.string().optional(),
  ward: z.string().optional(),
  bankName: z.string().optional(),
  bankBranchName: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
  email: z
    .string()
    .optional()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: 'Invalid email address',
    }),
  supportArea: z
    .array(z.object({ id: z.string(), text: z.string() }))
    .optional(),
});

type UpdateGctValues = z.infer<typeof UpdateGctSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface GctUpdateSheetProps {
  projectUUID: UUID;
  item: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GctUpdateSheet({
  projectUUID,
  item,
  open,
  onOpenChange,
}: GctUpdateSheetProps) {
  const updateGct = useUpdateGroupCashTransfer(projectUUID);

  const [supportAreaTags, setSupportAreaTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
  const [unsavedTagInput, setUnsavedTagInput] = useState('');

  const form = useForm<UpdateGctValues>({
    resolver: zodResolver(UpdateGctSchema),
    defaultValues: {
      name: '',
      phone: '+977',
      district: '',
      municipality: '',
      ward: '',
      bankName: '',
      bankBranchName: '',
      accountName: '',
      accountNumber: '',
      email: '',
      supportArea: [],
    },
  });

  // Populate form when item changes
  useEffect(() => {
    if (!item) return;
    const extras = item.extras ?? {};
    const existingTags: Tag[] = Array.isArray(extras.supportArea)
      ? extras.supportArea.map((s: string, i: number) => ({ id: String(i), text: s }))
      : [];

    setSupportAreaTags(existingTags);
    setUnsavedTagInput('');

    form.reset({
      name: item.name ?? '',
      phone: item.phone ?? '+977',
      district: extras.district ?? '',
      municipality: extras.municipality ?? '',
      ward: extras.ward ?? '',
      bankName: item.bankDetails?.bankName ?? '',
      bankBranchName: item.bankDetails?.bankBranchName ?? '',
      accountName: item.bankDetails?.accountName ?? '',
      accountNumber: item.bankDetails?.accountNumber ?? '',
      email: extras.email ?? '',
      supportArea: existingTags,
    });
  }, [item, form]);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (unsavedTagInput.trim()) {
        const newTag: Tag = { id: Date.now().toString(), text: unsavedTagInput.trim() };
        const updated = [...supportAreaTags, newTag];
        setSupportAreaTags(updated);
        form.setValue('supportArea', updated);
        setUnsavedTagInput('');
      }
    }
  };

  const onSubmit = async (values: UpdateGctValues) => {
    if (!item) return;
    const supportAreaStrings = (values.supportArea ?? []).map((t) => t.text);

    await updateGct.mutateAsync({
      uuid: item.uuid,
      name: values.name,
      phone: values.phone === '+977' ? undefined : values.phone,
      bankDetails: {
        bankName: values.bankName,
        bankBranchName: values.bankBranchName,
        accountName: values.accountName,
        accountNumber: values.accountNumber,
      },
      extras: {
        district: values.district,
        municipality: values.municipality,
        ward: values.ward,
        email: values.email,
        supportArea: supportAreaStrings,
      },
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[480px] sm:w-[560px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Edit GCT Group</SheetTitle>
          <SheetDescription>
            Update the details for this group cash transfer.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label>GCT Group Name <span className="text-destructive">*</span></Label>
                  <FormControl>
                    <Input placeholder="Group name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <Label>Phone Number</Label>
                  <FormControl>
                    <PhoneInput defaultCountry="NP" placeholder="+977" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <Label>District</Label>
                    <FormControl>
                      <Input placeholder="District" {...field} />
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
                    <Label>Municipality</Label>
                    <FormControl>
                      <Input placeholder="Municipality" {...field} />
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
                    <Label>Ward (Community)</Label>
                    <FormControl>
                      <Input placeholder="Ward" {...field} />
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
                    <Label>Email</Label>
                    <FormControl>
                      <Input type="email" placeholder="Email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Support area */}
            <FormField
              control={form.control}
              name="supportArea"
              render={({ field }) => (
                <FormItem>
                  <Label>Support Area</Label>
                  <FormControl>
                    <>
                      <TagInput
                        {...field}
                        tags={supportAreaTags}
                        setTags={(newTags) => {
                          setSupportAreaTags(newTags);
                          form.setValue('supportArea', newTags as [Tag, ...Tag[]]);
                        }}
                        placeholder="Enter value and press ENTER"
                        className="min-h-[23px]"
                        styleClasses={{
                          inlineTagsContainer:
                            'border-input rounded shadow-xs p-1 gap-1 ' +
                            'focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500',
                          input: 'w-full rounded-sm min-w-[80px] shadow-none px-2 h-7',
                          tag: {
                            body: 'h-7 relative rounded-sm border border-input font-medium text-xs ps-2 pe-7',
                            closeButton:
                              'absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-muted-foreground/80 hover:text-foreground',
                          },
                        }}
                        activeTagIndex={activeTagIndex}
                        setActiveTagIndex={setActiveTagIndex}
                        inputProps={{
                          value: unsavedTagInput,
                          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                            setUnsavedTagInput(e.target.value),
                          onKeyDown: handleTagKeyDown,
                        }}
                      />
                      {unsavedTagInput && (
                        <span className="text-xs text-muted-foreground ml-1">
                          Press Enter to add.
                        </span>
                      )}
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bank details */}
            <div className="pt-1">
              <p className="text-sm font-semibold mb-3">Bank Details</p>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Bank Name</Label>
                      <FormControl>
                        <Input placeholder="Bank name" {...field} />
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
                      <Label>Branch Name</Label>
                      <FormControl>
                        <Input placeholder="Branch name" {...field} />
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
                      <Label>Account Holder Name</Label>
                      <FormControl>
                        <Input placeholder="Account holder" {...field} />
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
                      <Label>Account Number</Label>
                      <FormControl>
                        <Input placeholder="Account number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
                disabled={updateGct.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-8 rounded-sm"
                disabled={updateGct.isPending || unsavedTagInput.trim() !== ''}
              >
                {updateGct.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
