import { z } from 'zod';

export const paymentSchema = z
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
        message: 'Please select a beneficiary group',
        path: ['group'],
      });
    }

    if (
      data.method === 'FSP' &&
      (!data.paymentProvider || Object.keys(data.paymentProvider).length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select a payment provider',
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
        message: 'Please select a vendor',
        path: ['vendor'],
      });
    }
  });

export type PaymentSchema = z.infer<typeof paymentSchema>;
