'use client';

import { useEffect, useState } from 'react';
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
import { HeaderWithBack } from 'apps/rahat-ui/src/common';
import {
  useGetOneGroupCashTransfer,
  useUpdateGroupCashTransfer,
} from '@rahat-ui/query';
import SpinnerLoader from 'apps/rahat-ui/src/sections/projects/components/spinner.loader';

// ─── Schema ───────────────────────────────────────────────────────────────────

const EditGctSchema = z.object({
  name: z.string().min(1, 'GCT Group Name is required'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine((v) => v !== '+977' && isValidPhoneNumber(v), {
      message: 'Invalid phone number',
    }),
  district: z.string().min(1, 'District is required'),
  municipality: z.string().min(1, 'Municipality is required'),
  ward: z.string().min(1, 'Ward is required'),
  bankName: z.string().min(1, 'Bank name is required'),
  bankBranchName: z.string().min(1, 'Branch name is required'),
  accountName: z.string().min(1, 'Account holder name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
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

type EditGctValues = z.infer<typeof EditGctSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function EditGct() {
  const { id, uuid } = useParams();
  const router = useRouter();
  const projectUUID = id as UUID;
  const gctUUID = uuid as string;

  const [supportAreaTags, setSupportAreaTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
  const [unsavedTagInput, setUnsavedTagInput] = useState('');
  const [pendingValues, setPendingValues] = useState<EditGctValues | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data, isLoading } = useGetOneGroupCashTransfer(projectUUID, gctUUID);
  const item = data?.data ?? data ?? null;
  const updateGct = useUpdateGroupCashTransfer(projectUUID);

  const form = useForm<EditGctValues>({
    resolver: zodResolver(EditGctSchema),
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

  // Populate once data arrives
  useEffect(() => {
    if (!item) return;
    const extras = item.extras ?? {};
    const existingTags: Tag[] = Array.isArray(extras.supportArea)
      ? extras.supportArea.map((s: string, i: number) => ({
          id: String(i),
          text: s,
        }))
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
  }, [item]); // eslint-disable-line react-hooks/exhaustive-deps

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
        form.setValue('supportArea', updated, { shouldDirty: true });
        setUnsavedTagInput('');
      }
    }
  };

  const handleSubmit = (values: EditGctValues) => {
    setPendingValues(values);
    setConfirmOpen(true);
  };

  const handleConfirmedUpdate = async () => {
    if (!pendingValues) return;
    setConfirmOpen(false);
    const supportAreaStrings = (pendingValues.supportArea ?? []).map(
      (t) => t.text,
    );

    try {
      await updateGct.mutateAsync({
        uuid: gctUUID,
        name: pendingValues.name,
        phone:
          pendingValues.phone === '+977' ? undefined : pendingValues.phone,
        bankDetails: {
          bankName: pendingValues.bankName,
          bankBranchName: pendingValues.bankBranchName,
          accountName: pendingValues.accountName,
          accountNumber: pendingValues.accountNumber,
        },
        extras: {
          district: pendingValues.district,
          municipality: pendingValues.municipality,
          ward: pendingValues.ward,
          email: pendingValues.email,
          supportArea: supportAreaStrings,
        },
      });
      router.push(`/projects/aa/${id}/group-cash-transfer`);
    } catch (error: any) {
      const msg: string =
        error?.response?.data?.message || error?.message || '';
      if (/\bname\b/i.test(msg)) {
        form.setError('name', { message: 'Group name already exists' });
      }
      if (/phone/i.test(msg)) {
        form.setError('phone', { message: 'Phone number already exists' });
      }
      if (/email/i.test(msg)) {
        form.setError('email', { message: 'Email already exists' });
      }
      if (/account.?number/i.test(msg) || /account/i.test(msg)) {
        form.setError('accountNumber', {
          message: 'Account number already exists',
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <SpinnerLoader />
      </div>
    );
  }

  const isDirty = form.formState.isDirty;

  return (
    <div className="p-4">
      <HeaderWithBack
        title="Edit GCT Group"
        subtitle="Update the details for this GCT Group"
        path={`/projects/aa/${id}/group-cash-transfer`}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

          {/* ── Basic Info ────────────────────────────────────────────────── */}
          <div className="p-4 rounded-sm border bg-card space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Basic Info
            </h3>
            <div className="grid grid-cols-3 gap-4">
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
                    <Label>Phone Number <span className="text-destructive">*</span></Label>
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
                    <Label>District <span className="text-destructive">*</span></Label>
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
                    <Label>Ward (Community) <span className="text-destructive">*</span></Label>
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
                    <Label>Municipality <span className="text-destructive">*</span></Label>
                    <FormControl>
                      <Input placeholder="Enter municipality" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                          form.setValue(
                            'supportArea',
                            newTags as [Tag, ...Tag[]],
                            { shouldDirty: true },
                          );
                        }}
                        placeholder="Enter value and press ENTER"
                        className="min-h-[23px]"
                        styleClasses={{
                          inlineTagsContainer:
                            'border-input rounded shadow-xs p-1 gap-1 ' +
                            'focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500',
                          input:
                            'w-full rounded-sm min-w-[80px] shadow-none px-2 h-7',
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
                          onChange: (
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => setUnsavedTagInput(e.target.value),
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

          {/* ── Bank Details ──────────────────────────────────────────────── */}
          <div className="p-4 rounded-sm border bg-card space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Bank Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <Label>Bank Name <span className="text-destructive">*</span></Label>
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
                    <Label>Bank Branch Name <span className="text-destructive">*</span></Label>
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
                    <Label>Bank Account Holder Name <span className="text-destructive">*</span></Label>
                    <FormControl>
                      <Input
                        placeholder="Enter Bank Account Holder Name"
                        {...field}
                      />
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
                    <Label>Bank Account Number <span className="text-destructive">*</span></Label>
                    <FormControl>
                      <Input placeholder="Enter Bank Account Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* ── Footer ───────────────────────────────────────────────────── */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              className="px-8"
              onClick={() => router.push(`/projects/aa/${id}/group-cash-transfer`)}
              disabled={updateGct.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-8"
              disabled={
                updateGct.isPending ||
                !isDirty ||
                unsavedTagInput.trim() !== ''
              }
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

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Edit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save changes to{' '}
              <span className="font-semibold text-foreground">
                "{item?.name}"
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateGct.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmedUpdate}
              disabled={updateGct.isPending}
            >
              {updateGct.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
