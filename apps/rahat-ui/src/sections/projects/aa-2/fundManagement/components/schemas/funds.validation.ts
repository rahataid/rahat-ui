import z from 'zod';

export const FundAssignmentFormSchema = z.object({
  title: z.string().min(4, { message: 'Title must be at least 4 characters' }),
  beneficiaryGroupId: z
    .string()
    .min(1, { message: 'Select a beneficiary group' }),
  tokenAmountPerBenef: z
    .number({ invalid_type_error: 'Enter a valid amount' })
    .int({ message: 'Amount must be a positive integer' })
    .positive({ message: 'Amount must be greater than 0' }),
  totalTokenAmount: z
    .number({ invalid_type_error: 'Enter a valid amount' })
    .int({ message: 'Amount must be a positive integer' })
    .min(0),
});

export type FundAssignmentFormValues = z.infer<typeof FundAssignmentFormSchema>;
