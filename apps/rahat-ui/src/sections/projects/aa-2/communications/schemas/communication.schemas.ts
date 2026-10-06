import { z } from 'zod';

const audienceGroupSchema = z
  .object({
    id: z.string().min(1),
    name: z.string(),
    count: z.number(),
  })
  .passthrough();

export const buildBroadcastSchema = (t: (key: string) => string) =>
  z
    .object({
      title: z.string().min(1, t('BROADCAST_TITLE_REQUIRED')),
      channel: z.enum(['sms', 'voice', 'email']),
      subject: z.string().optional(),
      message: z.string().optional(),
      beneficiaries: z.array(audienceGroupSchema).default([]),
      stakeholders: z.array(audienceGroupSchema).default([]),
      audioFile: z.any().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.channel === 'email' && !data.subject?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('EMAIL_SUBJECT_REQUIRED'),
          path: ['subject'],
        });
      }
      if (data.channel === 'voice') {
        const audio = data.audioFile;
        const hasMedia =
          audio instanceof Blob || typeof audio?.mediaURL === 'string';
        if (!hasMedia) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('AUDIO_FILE_REQUIRED'),
            path: ['audioFile'],
          });
        }
      }
      if (data.channel !== 'voice' && !data.message?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('MESSAGE_REQUIRED'),
          path: ['message'],
        });
      }
      if (data.channel !== 'voice' && data.message) {
        const isUni = /[\u0900-\u097F]/.test(data.message);
        const max = isUni ? 350 : 700;
        if (data.message.length > max) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('MAX_CHARS_EXCEEDED'),
            path: ['message'],
          });
        }
      }
      if (data.beneficiaries.length === 0 && data.stakeholders.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('TARGET_AUDIENCE_REQUIRED'),
          path: ['targetAudience'],
        });
      }
    });
