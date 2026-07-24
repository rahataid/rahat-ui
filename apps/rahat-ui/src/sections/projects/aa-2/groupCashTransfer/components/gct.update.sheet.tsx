'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UUID } from 'crypto';
import { Loader2 } from 'lucide-react';
import { Tag } from 'emblor';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@rahat-ui/shadcn/src/components/ui/sheet';
import { Form } from '@rahat-ui/shadcn/src/components/ui/form';
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
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useUpdateGroupCashTransfer } from '@rahat-ui/query';
import { buildGctGroupSchema, GctGroupValues, applyDuplicateErrors } from '../types/gct.schemas';
import { BasicInfoSection, BankDetailsSection } from './gct.form-sections';

interface GctUpdateSheetProps {
  projectUUID: UUID;
  item: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GctUpdateSheet({
  projectUUID,
  item,
  open,
  onOpenChange,
}: GctUpdateSheetProps) {
  const t = useTranslations('AA Project with Cash Tracker');
  const tGlobal = useTranslations('GLOBAL');
  const updateGct = useUpdateGroupCashTransfer(projectUUID);

  const [initialTags, setInitialTags] = useState<Tag[]>([]);
  const [hasUnsavedTag, setHasUnsavedTag] = useState(false);
  const [pendingValues, setPendingValues] = useState<GctGroupValues | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const GctGroupSchema = buildGctGroupSchema(t);
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

  const onSubmit = (values: GctGroupValues) => {
    setPendingValues(values);
    setConfirmOpen(true);
  };

  const handleConfirmedUpdate = async () => {
    if (!item || !pendingValues) return;
    setConfirmOpen(false);
    const supportAreaStrings = (pendingValues.supportArea ?? []).map((t) => t.text);

    try {
      await updateGct.mutateAsync({
        uuid: item.uuid,
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
      onOpenChange(false);
    } catch (error: any) {
      const msg: string = error?.response?.data?.message || error?.message || '';
      applyDuplicateErrors(msg, (field, err) =>
        form.setError(field as keyof GctGroupValues, err), t,
      );
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-[480px] sm:w-[560px] overflow-y-auto"
        >
          <SheetHeader className="mb-6">
            <SheetTitle>{t('EDIT_GCT_GROUP')}</SheetTitle>
            <SheetDescription>
              {t('UPDATE_THE_DETAILS_FOR_THIS_GROUP')}
            </SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <BasicInfoSection
                key={item?.uuid ?? 'sheet'}
                form={form}
                initialTags={initialTags}
                shouldDirty
                onUnsavedChange={setHasUnsavedTag}
              />
              <BankDetailsSection form={form} />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => onOpenChange(false)}
                  disabled={updateGct.isPending}
                >
                  {tGlobal('CANCEL')}
                </Button>
                <Button
                  type="submit"
                  className="px-8 rounded-sm"
                  disabled={updateGct.isPending || hasUnsavedTag}
                >
                  {updateGct.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('SAVING')}
                    </>
                  ) : (
                    t('SAVE_CHANGES')
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('CONFIRM_EDIT_TITLE')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('ARE_YOU_SURE_YOU_WANT_TO_SAVE_CHANGES_TO', { name: item?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateGct.isPending}>{tGlobal('CANCEL')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmedUpdate}
              disabled={updateGct.isPending}
            >
              {updateGct.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('SAVING')}
                </>
              ) : (
                t('SAVE_CHANGES')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
