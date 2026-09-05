import { z } from 'zod';
import { normalizeNumeralsPreprocessor } from 'apps/rahat-ui/src/utils/i18n/numeral';

export const INKIND_TYPES = ['PRE_DEFINED', 'WALK_IN'] as const;
export type InkindType = (typeof INKIND_TYPES)[number];

export const INKIND_TYPE_LABELS: Record<InkindType, string> = {
  PRE_DEFINED: 'Pre-Defined',
  WALK_IN: 'Walk-In',
};

export const NAME_MAX = 100;
export const DESCRIPTION_MAX = 500;

type Translator = (key: string, values?: Record<string, any>) => string;

export const buildInkindDetailsSchema = (t: Translator) =>
  z.object({
    name: z
      .string()
      .min(1, t('NAME_IS_REQUIRED'))
      .max(NAME_MAX, t('NAME_MAX_CHARACTERS_OR_FEWER', { max: NAME_MAX })),
    description: z
      .string()
      .min(1, t('DESCRIPTION_REQUIRED'))
      .max(
        DESCRIPTION_MAX,
        t('DESCRIPTION_MAX_CHARACTERS_OR_FEWER', { max: DESCRIPTION_MAX }),
      ),
    type: z.string().refine((val) => INKIND_TYPES.includes(val as any), {
      message: t('TYPE_IS_REQUIRED'),
    }),
    quantity: z.preprocess(
      normalizeNumeralsPreprocessor,
      z
        .string()
        .optional()
        .refine((val) => !val || (Number(val) > 0 && /^\d+$/.test(val)), {
          message: t('QUANTITY_MUST_BE_A_POSITIVE_NUMBER'),
        }),
    ),
  });

export type InkindDetailsValues = z.infer<
  ReturnType<typeof buildInkindDetailsSchema>
>;

export const InkindGroupSchema = z.object({
  beneficiaryGroupId: z.string().optional(),
  beneficiaryGroupName: z.string().optional(),
});

export type InkindGroupValues = z.infer<typeof InkindGroupSchema>;

export type InkindFormData = InkindDetailsValues & InkindGroupValues;
