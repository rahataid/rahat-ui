import { z } from 'zod';

type TFunction = (key: string) => string;

export function buildAddPhaseSchema(t: TFunction) {
  const requiredMandatoryTriggerNumber = z.preprocess(
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
        required_error: t('PLEASE_ENTER_NUMBER_OF_MANDATORY_TRIGGERS'),
        invalid_type_error: t('PLEASE_ENTER_VALID_NUMBER'),
      })
      .int(t('PLEASE_ENTER_INTEGER'))
      .nonnegative(t('VALUE_MUST_BE_GTE_0')),
  );

  const requiredOptionalTriggerNumber = z.preprocess(
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
        required_error: t('PLEASE_ENTER_NUMBER_OF_OPTIONAL_TRIGGERS'),
        invalid_type_error: t('PLEASE_ENTER_VALID_NUMBER'),
      })
      .int(t('PLEASE_ENTER_INTEGER'))
      .nonnegative(t('VALUE_MUST_BE_GTE_0')),
  );

  return z
    .object({
      name: z
        .string()
        .trim()
        .min(2, { message: t('PLEASE_ENTER_PHASE_NAME') })
        .max(50, { message: t('PHASE_NAME_MAX_50_CHARACTERS') }),
      riverBasin: z.string().min(1, { message: t('RIVER_BASIN_IS_REQUIRED') }),
      requiredMandatoryTriggers: requiredMandatoryTriggerNumber,
      requiredOptionalTriggers: requiredOptionalTriggerNumber,
      canRevert: z.boolean().optional(),
      canTriggerPayout: z.boolean().optional(),
      disbursementMethods: z.array(z.string()).optional(),
      isAutomatedActivity: z.boolean().optional(),
      isRequiredLeadTime: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
      if (
        data.canTriggerPayout &&
        (!data.disbursementMethods || data.disbursementMethods.length === 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('AT_LEAST_ONE_DISBURSEMENT_METHOD'),
          path: ['disbursementMethods'],
        });
      }
    });
}

export type AddPhaseFormValues = z.output<ReturnType<typeof buildAddPhaseSchema>>;
export type AddPhaseFormInputValues = z.input<ReturnType<typeof buildAddPhaseSchema>>;

export const getAddPhaseDefaultValues = (
  riverBasin?: string,
): AddPhaseFormInputValues => ({
  name: '',
  riverBasin: riverBasin || '',
  requiredMandatoryTriggers: undefined,
  requiredOptionalTriggers: undefined,
  canRevert: true,
  canTriggerPayout: false,
  disbursementMethods: [],
  isAutomatedActivity: false,
  isRequiredLeadTime: false,
});
