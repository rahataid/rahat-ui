import z from 'zod';

type Translator = (key: string, values?: Record<string, any>) => string;

export const buildAssignInkindSchema = (t: Translator) =>
  z.object({
    inkindId: z.string().min(1, t('PLEASE_SELECT_AN_IN_KIND_ITEM')),
    groupId: z.string().min(1, t('PLEASE_SELECT_A_BENEFICIARY_GROUP')),
    vendorId: z.string().optional(),
  });

export const buildAssignInkindOfflineSchema = (t: Translator) =>
  buildAssignInkindSchema(t).extend({
    vendorId: z.string().min(1, t('PLEASE_SELECT_A_VENDOR')),
  });

export type AssignInkindValues = z.infer<
  ReturnType<typeof buildAssignInkindSchema>
>;
