import { z } from 'zod';

type Translator = (key: string, values?: Record<string, any>) => string;

export const buildPaymentSchema = (t: Translator) =>
  z
  .object({
    method: z.string(),
    mode: z.enum(['ONLINE', 'OFFLINE']),
    group: z.record(z.any()),
    paymentProvider: z.record(z.any()).optional(),
    vendor: z.record(z.any()).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.group || Object.keys(data.group).length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('PLEASE_SELECT_A_BENEFICIARY_GROUP'),
        path: ['group'],
      });
    }

    if (
      data.method === 'FSP' &&
      (!data.paymentProvider || Object.keys(data.paymentProvider).length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('PLEASE_SELECT_A_PAYMENT_PROVIDER'),
        path: ['paymentProvider'],
      });
    }

    if (
      data.method === 'CVA' &&
      data.mode === 'OFFLINE' &&
      (!data.vendor || Object.keys(data.vendor).length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('PLEASE_SELECT_A_VENDOR'),
        path: ['vendor'],
      });
    }
  });

export type PaymentSchema = z.infer<ReturnType<typeof buildPaymentSchema>>;

// This is for the integrated payout form as group would be passed directly from the backend
export const buildPayoutFundSchema = (t: Translator) =>
  z
  .object({
    method: z.string(),
    mode: z.enum(['ONLINE', 'OFFLINE']),
    group: z.record(z.any()).optional(),
    paymentProvider: z.record(z.any()).optional(),
    vendor: z.record(z.any()).optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.method === 'FSP' &&
      (!data.paymentProvider || Object.keys(data.paymentProvider).length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('PLEASE_SELECT_A_PAYMENT_PROVIDER'),
        path: ['paymentProvider'],
      });
    }

    if (
      data.method === 'CVA' &&
      data.mode === 'OFFLINE' &&
      (!data.vendor || Object.keys(data.vendor).length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('PLEASE_SELECT_A_VENDOR'),
        path: ['vendor'],
      });
    }
  });

export type FundWithPayoutSchema = z.infer<
  ReturnType<typeof buildPayoutFundSchema>
>;
