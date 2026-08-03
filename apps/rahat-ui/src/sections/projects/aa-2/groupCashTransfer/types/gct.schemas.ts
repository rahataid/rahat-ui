import { z } from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { normalizeNumeralsPreprocessor } from 'apps/rahat-ui/src/utils/numeral.utils';

type TFunction = (key: string) => string;

export function buildGctGroupSchema(t: TFunction) {
  const phoneRequired = z.preprocess(
    normalizeNumeralsPreprocessor,
    z
      .string()
      .min(1, t('PHONE_NUMBER_IS_REQUIRED'))
      .refine((v) => v !== '+977' && isValidPhoneNumber(v), {
        message: t('INVALID_PHONE_NUMBER'),
      }),
  );

  const emailOptional = z
    .string()
    .optional()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: t('INVALID_EMAIL_ADDRESS'),
    });

  const supportAreaField = z
    .array(z.object({ id: z.string(), text: z.string() }))
    .optional();

  return z.object({
    name: z.string().min(1, t('GCT_GROUP_NAME_IS_REQUIRED')),
    phone: phoneRequired,
    district: z.string().min(1, t('DISTRICT_IS_REQUIRED')),
    municipality: z.string().min(1, t('MUNICIPALITY_IS_REQUIRED')),
    ward: z.preprocess(
      normalizeNumeralsPreprocessor,
      z.string().min(1, t('WARD_IS_REQUIRED')),
    ),
    bankName: z.string().min(1, t('BANK_NAME_IS_REQUIRED')),
    bankCode: z.string().min(1, t('BANK_IS_REQUIRED')),
    bankBranchName: z.string().min(1, t('BRANCH_NAME_IS_REQUIRED')),
    accountName: z.string().min(1, t('ACCOUNT_HOLDER_NAME_IS_REQUIRED')),
    accountNumber: z.preprocess(
      normalizeNumeralsPreprocessor,
      z.string().min(1, t('ACCOUNT_NUMBER_IS_REQUIRED')),
    ),
    email: emailOptional,
    supportArea: supportAreaField,
  });
}

export type GctGroupValues = z.infer<ReturnType<typeof buildGctGroupSchema>>;

export function buildAssignCashSchema(t: TFunction) {
  return z.object({
    title: z.string().min(1, t('FUND_TITLE_IS_REQUIRED')),
    groupCashTransferId: z.string().min(1, t('PLEASE_SELECT_A_GCT_GROUP')),
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

export type AssignCashValues = z.infer<ReturnType<typeof buildAssignCashSchema>>;

export function applyDuplicateErrors(
  msg: string,
  setError: (field: string, err: { message: string }) => void,
  t: TFunction,
) {
  if (/\bname\b/i.test(msg))
    setError('name', { message: t('GROUP_NAME_ALREADY_EXISTS') });
  if (/phone/i.test(msg))
    setError('phone', { message: t('PHONE_NUMBER_ALREADY_EXISTS') });
  if (/email/i.test(msg))
    setError('email', { message: t('EMAIL_ALREADY_EXISTS') });
  const isBankAccountDuplicate =
    /account.?number/i.test(msg) && /bank.?name/i.test(msg);

  if (isBankAccountDuplicate) {
    setError('bankName', {
      message: t('THIS_BANK_ACCOUNT_ALREADY_EXISTS'),
    });

    setError('accountNumber', {
      message: t('THIS_BANK_ACCOUNT_ALREADY_EXISTS'),
    });
  }
}
