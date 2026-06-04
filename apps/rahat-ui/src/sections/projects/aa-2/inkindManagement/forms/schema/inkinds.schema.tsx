import z from 'zod';

export const AssignInkindSchema = z.object({
  inkindId: z.string().min(1, 'Please select an in-kind item'),
  groupId: z.string().min(1, 'Please select a beneficiary group'),
  vendorId: z.string().optional(),
});

export const AssignInkindOfflineSchema = AssignInkindSchema.extend({
  vendorId: z.string().min(1, 'Please select a vendor'),
});

export type AssignInkindValues = z.infer<typeof AssignInkindSchema>;
