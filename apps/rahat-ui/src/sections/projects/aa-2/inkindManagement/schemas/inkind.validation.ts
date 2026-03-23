import { z } from 'zod';

export const INKIND_TYPES = ['PRE_DEFINED', 'WALK_IN'] as const;
export type InkindType = (typeof INKIND_TYPES)[number];

export const INKIND_TYPE_LABELS: Record<InkindType, string> = {
  PRE_DEFINED: 'Pre-Defined',
  WALK_IN: 'Walk-In',
};

export const NAME_MAX = 100;
export const DESCRIPTION_MAX = 500;

export const InkindDetailsSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(NAME_MAX, `Name must be ${NAME_MAX} characters or fewer`),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(
      DESCRIPTION_MAX,
      `Description must be ${DESCRIPTION_MAX} characters or fewer`,
    ),
  type: z.string().refine((val) => INKIND_TYPES.includes(val as any), {
    message: 'Type is required',
  }),
});

export type InkindDetailsValues = z.infer<typeof InkindDetailsSchema>;

export const InkindGroupSchema = z.object({
  beneficiaryGroupId: z.string().optional(),
  beneficiaryGroupName: z.string().optional(),
});

export type InkindGroupValues = z.infer<typeof InkindGroupSchema>;

export type InkindFormData = InkindDetailsValues & InkindGroupValues;
