'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import { Loader2 } from 'lucide-react';
import { Form } from '@rahat-ui/shadcn/src/components/ui/form';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { HeaderWithBack } from 'apps/rahat-ui/src/common';
import { useCreateGroupCashTransfer, useValidateBankAccount } from '@rahat-ui/query';
import { buildGctGroupSchema, GctGroupValues, applyDuplicateErrors } from './types/gct.schemas';
import { BasicInfoSection, BankDetailsSection } from './components/gct.form-sections';

const DEFAULT_VALUES: GctGroupValues = {
  name: '',
  phone: '+977',
  district: '',
  municipality: '',
  ward: '',
  bankName: '',
  bankCode: '',
  bankBranchName: '',
  accountName: '',
  accountNumber: '',
  email: '',
  supportArea: [],
};

export default function AddGct() {
  const t = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const tGlobal = useTranslations('GLOBAL');
  const { id } = useParams();
  const router = useRouter();
  const projectUUID = id as UUID;

  const [validating, setValidating] = useState(false);
  const [hasUnsavedTag, setHasUnsavedTag] = useState(false);
  const [clearKey, setClearKey] = useState(0);

  const createGct = useCreateGroupCashTransfer(projectUUID);
  const validateBank = useValidateBankAccount(projectUUID);

  const GctGroupSchema = buildGctGroupSchema(t);
  const form = useForm<GctGroupValues>({
    resolver: zodResolver(GctGroupSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const handleSubmit = async (values: GctGroupValues) => {
    // setValidating(true);
    // try {
    //   await validateBank.mutateAsync({
    //     bankName: values.bankName,
    //     bankBranchName: values.bankBranchName,
    //     accountName: values.accountName,
    //     accountNumber: values.accountNumber,
    //   });
    // } catch (error: any) {
    //   setValidating(false);
    //   form.setError('accountNumber', {
    //     message:
    //       error?.response?.data?.message ||
    //       error?.message ||
    //       'Bank account validation failed.',
    //   });
    //   return;
    // }
    // setValidating(false);

    const supportAreaStrings = (values.supportArea ?? []).map((t) => t.text);
    try {
      await createGct.mutateAsync({
        name: values.name,
        phone: values.phone === '+977' ? undefined : values.phone,
        bankDetails: {
          bankName: values.bankName,
          bankCode: values.bankCode,
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
      router.push(`/projects/aa/${id}/group-cash-transfer`);
    } catch (error: any) {
      const msg: string = error?.response?.data?.message || error?.message || '';
      applyDuplicateErrors(msg, (field, err) =>
        form.setError(field as keyof GctGroupValues, err), t,
      );
    }
  };

  const isPending = validating || createGct.isPending;

  return (
    <div className="p-4">
      <HeaderWithBack
        title={t('CREATE_GCT_GROUP')}
        subtitle={t('FILL_THE_FORM_BELOW_TO_CREATE')}
        path={`/projects/aa/${id}/group-cash-transfer`}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <BasicInfoSection
            key={clearKey}
            form={form}
            onUnsavedChange={setHasUnsavedTag}
          />
          <BankDetailsSection form={form} />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              className="px-8"
              onClick={() => { form.reset(DEFAULT_VALUES); setClearKey((k) => k + 1); }}
              disabled={isPending}
            >
              {t('CLEAR')}
            </Button>
            <Button
              type="submit"
              className="px-8"
              disabled={isPending || hasUnsavedTag}
            >
              {validating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('VALIDATING_BANK_ACCOUNT')}
                </>
              ) : createGct.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('CREATING')}
                </>
              ) : (
                tGlobal('CREATE')
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
