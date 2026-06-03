'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { Tag, TagInput } from 'emblor';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { Loader2 } from 'lucide-react';
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
import { HeaderWithBack } from 'apps/rahat-ui/src/common';
import { useCreateGroupCashTransfer } from '@rahat-ui/query';

// ─── Schema ───────────────────────────────────────────────────────────────────

const CreateGctSchema = z.object({
  name: z.string().min(1, 'GCT Group Name is required'),
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

type CreateGctValues = z.infer<typeof CreateGctSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function AddGct() {
  const { id } = useParams();
  const router = useRouter();
  const projectUUID = id as UUID;

  // Support area tag state
  const [supportAreaTags, setSupportAreaTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
  const [unsavedTagInput, setUnsavedTagInput] = useState('');

  const createGct = useCreateGroupCashTransfer(projectUUID);

  const form = useForm<CreateGctValues>({
    resolver: zodResolver(CreateGctSchema),
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

  // Add tag on Enter
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (unsavedTagInput.trim()) {
        const newTag: Tag = {
          id: Date.now().toString(),
          text: unsavedTagInput.trim(),
        };
        const updated = [...supportAreaTags, newTag];
        setSupportAreaTags(updated);
        form.setValue('supportArea', updated);
        setUnsavedTagInput('');
      }
    }
  };

  const handleSubmit = async (values: CreateGctValues) => {
    const supportAreaStrings = (values.supportArea ?? []).map((t) => t.text);

    await createGct.mutateAsync({
      name: values.name,
      phone: values.phone === '+977' ? undefined : values.phone,
      bankDetails: {
        bankName: values.bankName,
        bankBranchName: values.bankBranchName,
        accountName: values.accountName,
        accountNumber: values.accountNumber,
      },
      // fields not in the top-level payload go into extras
      extras: {
        district: values.district,
        municipality: values.municipality,
        ward: values.ward,
        email: values.email,
        supportArea: supportAreaStrings,
      },
    });

    router.push(`/projects/aa/${id}/group-cash-transfer`);
  };

  const handleClear = () => {
    form.reset();
    setSupportAreaTags([]);
    setUnsavedTagInput('');
  };

  return (
    <div className="p-4">
      <HeaderWithBack
        title="Create GCT Group"
        subtitle="Fill the form below to create new Group for Group Cash Transfer"
        path={`/projects/aa/${id}/group-cash-transfer`}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="p-4 rounded-sm border bg-card space-y-4">

            {/* Row 1: Name + Phone */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label>GCT Group Name <span className="text-destructive">*</span></Label>
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
                    <Label>Phone Number</Label>
                    <FormControl>
                      <PhoneInput defaultCountry="NP" placeholder="+977" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 2: District + Municipality + Ward */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <Label>District</Label>
                    <FormControl>
                      <Input placeholder="Enter district" {...field} />
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
                      <Input placeholder="Enter municipality" {...field} />
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
                      <Input placeholder="Enter Ward and community" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 3: Bank Name + Bank Branch Name + Account Holder Name */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <Label>Bank Name</Label>
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
                    <Label>Bank Branch Name</Label>
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
                    <Label>Bank Account Holder Name</Label>
                    <FormControl>
                      <Input placeholder="Enter Bank Account Holder Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 4: Account Number + Email + Support Area */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <Label>Bank Account Number</Label>
                    <FormControl>
                      <Input placeholder="Enter Bank Account Number" {...field} />
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
                      <Input type="email" placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="supportArea"
                render={({ field }) => (
                  <FormItem>
                    <Label>Support Area (Optional)</Label>
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
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                className="px-8"
                onClick={handleClear}
                disabled={createGct.isPending}
              >
                Clear
              </Button>
              <Button
                type="submit"
                className="px-8"
                disabled={createGct.isPending || unsavedTagInput.trim() !== ''}
              >
                {createGct.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create'
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
