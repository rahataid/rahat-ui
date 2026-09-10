import { z } from 'zod';

export function buildStakeholderGroupSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(1, t('GROUP_NAME_REQUIRED')),
    stakeholders: z
      .array(z.string())
      .min(1, t('PLEASE_SELECT_AT_LEAST_ONE_STAKEHOLDER')),
  });
}

export type StakeholderGroupFormData = z.infer<
  ReturnType<typeof buildStakeholderGroupSchema>
>;
