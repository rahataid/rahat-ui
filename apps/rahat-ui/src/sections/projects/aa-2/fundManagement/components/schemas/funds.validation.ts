import z from 'zod';
import { normalizeNumeralsToNumberPreprocessor } from 'apps/rahat-ui/src/utils/i18n/numeral';

export function buildFundAssignmentFormSchema(t: (key: string) => string) {
  return z.object({
    title: z.string().min(4, { message: t('TITLE_MUST_BE_AT_LEAST_4_CHARACTER') }),
    beneficiaryGroupId: z
      .string()
      .min(1, { message: t('SELECT_A_BENEFICIARY_GROUP') }),
    tokenAmountPerBenef: z.preprocess(
      normalizeNumeralsToNumberPreprocessor,
      z
        .number({ invalid_type_error: t('ENTER_A_VALID_AMOUNT') })
        .int({ message: t('AMOUNT_MUST_BE_POSITIVE_INTEGER') })
        .positive({ message: t('AMOUNT_MUST_BE_GREATER_THAN_0') }),
    ),
    totalTokenAmount: z.preprocess(
      normalizeNumeralsToNumberPreprocessor,
      z
        .number({ invalid_type_error: t('ENTER_A_VALID_AMOUNT') })
        .int({ message: t('AMOUNT_MUST_BE_POSITIVE_INTEGER') })
        .min(0),
    ),
  });
}

export type FundAssignmentFormValues = z.infer<ReturnType<typeof buildFundAssignmentFormSchema>>;
