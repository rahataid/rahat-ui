import { z } from 'zod';

const requiredTriggerNumber = z.preprocess(
  (val) => {
    if (val === '' || val === null || typeof val === 'undefined') {
      return undefined;
    }

    if (typeof val === 'string') {
      return Number(val);
    }

    return val;
  },
  z
    .number({
      required_error: 'This field is required.',
      invalid_type_error: 'Please enter a valid number.',
    })
    .int('Please enter an integer.')
    .nonnegative('Value cannot be negative.'),
);

export const AddPhaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Please enter phase name.' })
    .max(50, { message: 'Phase name must be less than 50 characters.' }),
  riverBasin: z.string().min(1, { message: 'River basin is required.' }),
  requiredMandatoryTriggers: requiredTriggerNumber,
  requiredOptionalTriggers: requiredTriggerNumber,
  canRevert: z.boolean().optional(),
  canTriggerPayout: z.boolean().optional(),
});

export type AddPhaseFormValues = z.output<typeof AddPhaseSchema>;
export type AddPhaseFormInputValues = z.input<typeof AddPhaseSchema>;

export const getAddPhaseDefaultValues = (
  riverBasin?: string,
): AddPhaseFormInputValues => ({
  name: '',
  riverBasin: riverBasin || '',
  requiredMandatoryTriggers: undefined,
  requiredOptionalTriggers: undefined,
  canRevert: false,
  canTriggerPayout: false,
});
