import { z } from 'zod';

export const stakeholderGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required.'),
  stakeholders: z
    .array(z.string())
    .min(1, 'Please select at least one stakeholder.'),
});

export type StakeholderGroupFormData = z.infer<typeof stakeholderGroupSchema>;
