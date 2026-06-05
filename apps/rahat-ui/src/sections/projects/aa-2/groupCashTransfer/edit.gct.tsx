'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { Tag } from 'emblor';
import { Loader2 } from 'lucide-react';
import { Form } from '@rahat-ui/shadcn/src/components/ui/form';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
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
import { useGetOneGroupCashTransfer, useUpdateGroupCashTransfer } from '@rahat-ui/query';
import SpinnerLoader from 'apps/rahat-ui/src/sections/projects/components/spinner.loader';
import { GctGroupSchema, GctGroupValues, applyDuplicateErrors } from './types/gct.schemas';
import { BasicInfoSection, BankDetailsSection } from './components/gct.form-sections';

export default function EditGct() {
  const { id, uuid } = useParams();
  const router = useRouter();
  const projectUUID = id as UUID;
  const gctUUID = uuid as string;

  const [initialTags, setInitialTags] = useState<Tag[]>([]);
  const [hasUnsavedTag, setHasUnsavedTag] = useState(false);
  const [pendingValues, setPendingValues] = useState<GctGroupValues | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data, isLoading } = useGetOneGroupCashTransfer(projectUUID, gctUUID);
  const item = data?.data ?? data ?? null;
  const updateGct = useUpdateGroupCashTransfer(projectUUID);

  const form = useForm<GctGroupValues>({
    resolver: zodResolver(GctGroupSchema),
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

  useEffect(() => {
    if (!item) return;
    const extras = item.extras ?? {};
    const tags: Tag[] = Array.isArray(extras.supportArea)
      ? extras.supportArea.map((s: string, i: number) => ({ id: String(i), text: s }))
      : [];

    setInitialTags(tags);

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
      supportArea: tags,
    });
  }, [item]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (values: GctGroupValues) => {
    setPendingValues(values);
    setConfirmOpen(true);
  };

  const handleConfirmedUpdate = async () => {
    if (!pendingValues) return;
    setConfirmOpen(false);
    const supportAreaStrings = (pendingValues.supportArea ?? []).map((t) => t.text);

    try {
      await updateGct.mutateAsync({
        uuid: gctUUID,
        name: pendingValues.name,
        phone: pendingValues.phone === '+977' ? undefined : pendingValues.phone,
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
      const msg: string = error?.response?.data?.message || error?.message || '';
      applyDuplicateErrors(msg, (field, err) =>
        form.setError(field as keyof GctGroupValues, err),
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <SpinnerLoader />
      </div>
    );
  }

  return (
    <div className="p-4">
      <HeaderWithBack
        title="Edit GCT Group"
        subtitle="Update the details for this GCT Group"
        path={`/projects/aa/${id}/group-cash-transfer`}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/*
            key= remounts BasicInfoSection (and its internal SupportAreaInput state)
            whenever initial data loads, so tags stay in sync with form.reset()
          */}
          <BasicInfoSection
            key={item?.uuid ?? 'edit'}
            form={form}
            initialTags={initialTags}
            shouldDirty
            onUnsavedChange={setHasUnsavedTag}
          />
          <BankDetailsSection form={form} />

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
              disabled={updateGct.isPending || !form.formState.isDirty || hasUnsavedTag}
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
              <span className="font-semibold text-foreground">"{item?.name}"</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateGct.isPending}>Cancel</AlertDialogCancel>
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
