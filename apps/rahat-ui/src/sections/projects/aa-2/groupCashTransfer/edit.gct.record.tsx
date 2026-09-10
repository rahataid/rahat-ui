'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
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
import { useGetOneGctRecord, useUpdateGctRecord } from '@rahat-ui/query';
import SpinnerLoader from 'apps/rahat-ui/src/sections/projects/components/spinner.loader';
import { normalizeNumeralsPreprocessor } from 'apps/rahat-ui/src/utils/i18n/numeral';
import { SectionCard } from './components/gct.form-sections';

type EditGctRecordValues = z.infer<ReturnType<typeof buildEditGctRecordSchema>>;

function buildEditGctRecordSchema(t: (key: string) => string) {
  return z.object({
    title: z.string().min(1, t('TITLE_IS_REQUIRED')),
    amount: z.preprocess(
      normalizeNumeralsPreprocessor,
      z
        .string()
        .min(1, t('AMOUNT_IS_REQUIRED'))
        .refine((v) => !isNaN(Number(v)) && Number(v) > 0, {
          message: t('AMOUNT_MUST_BE_POSITIVE_NUMBER'),
        }),
    ),
  });
}

export default function EditGctRecord() {
  const t = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const EditGctRecordSchema = buildEditGctRecordSchema(t);
  const tGlobal = useTranslations('GLOBAL');
  const { id, recordUuid } = useParams();
  const router = useRouter();
  const projectUUID = id as UUID;
  const backPath = `/projects/aa/${id}/group-cash-transfer/records/${recordUuid}`;

  const [pendingValues, setPendingValues] = useState<EditGctRecordValues | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data, isLoading } = useGetOneGctRecord(projectUUID, recordUuid as string);
  const updateRecord = useUpdateGctRecord(projectUUID);
  const record = data?.data ?? data ?? null;

  const form = useForm<EditGctRecordValues>({
    resolver: zodResolver(EditGctRecordSchema),
    defaultValues: { title: '', amount: '' },
  });

  useEffect(() => {
    if (!record) return;
    form.reset({
      title: record.title ?? '',
      amount: String(record.amount ?? ''),
    });
  }, [record]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (values: EditGctRecordValues) => {
    setPendingValues(values);
    setConfirmOpen(true);
  };

  const handleConfirmedUpdate = async () => {
    if (!pendingValues) return;
    setConfirmOpen(false);
    await updateRecord.mutateAsync({
      uuid: recordUuid as string,
      title: pendingValues.title,
      amount: Number(pendingValues.amount),
    });
    router.push(backPath);
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
        title={t('EDIT_FUND_RECORD')}
        subtitle={t('UPDATE_THE_DETAILS_FOR_THIS_FUND')}
        path={backPath}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <SectionCard titleKey="RECORD_DETAILS">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <Label>
                      {t('FUND_TITLE')} <span className="text-destructive">*</span>
                    </Label>
                    <FormControl>
                      <Input placeholder={t('ENTER_FUND_TITLE')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <Label>
                      {t('AMOUNT')} <span className="text-destructive">*</span>
                    </Label>
                    <FormControl>
                      <Input type="number" min={1} placeholder={t('ENTER_AMOUNT')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                className="px-8"
                onClick={() => form.reset({ title: record?.title ?? '', amount: String(record?.amount ?? '') })}
                disabled={updateRecord.isPending}
              >
                {t('CLEAR')}
              </Button>
              <Button
                type="submit"
                className="px-8"
                disabled={updateRecord.isPending || !form.formState.isDirty}
              >
                {updateRecord.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('SAVING')}
                  </>
                ) : (
                  tGlobal('CONFIRM')
                )}
              </Button>
            </div>
          </SectionCard>
        </form>
      </Form>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('CONFIRM_UPDATE')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('ARE_YOU_SURE_YOU_WANT_TO_UPDATE', { title: record?.title })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateRecord.isPending}>{tGlobal('CANCEL')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmedUpdate}
              disabled={updateRecord.isPending}
            >
              {updateRecord.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('SAVING')}
                </>
              ) : (
                tGlobal('CONFIRM')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
