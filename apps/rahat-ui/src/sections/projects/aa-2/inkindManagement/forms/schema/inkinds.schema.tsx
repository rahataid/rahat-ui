import z from 'zod';

export const AssignInkindSchema = z.object({
  inkindId: z.string().min(1, 'Please select an in-kind item'),
  groupId: z.string().min(1, 'Please select a beneficiary group'),
});

export type AssignInkindValues = z.infer<typeof AssignInkindSchema>;
