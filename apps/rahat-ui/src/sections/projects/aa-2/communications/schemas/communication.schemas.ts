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
      channel: z.enum(['sms', 'voice', 'email']).catch('sms'),
      subject: z.string().optional(),
      message: z.string().optional(),
      beneficiaries: z.array(audienceGroupSchema).default([]),
      stakeholders: z.array(audienceGroupSchema).default([]),
      targetAudience: z.any().optional(),
      audioFile: z.any().optional(),
      isScheduled: z.boolean().default(false),
      scheduleDate: z.date().optional(),
      scheduleTime: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      const getMsg = (key: string, fallback: string) => {
        try {
          const val = t(key);
          return val && !val.startsWith('AA_PROJECT.') ? val : fallback;
        } catch {
          return fallback;
        }
      };

      if (data.isScheduled) {
        if (!data.scheduleDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: getMsg(
              'SCHEDULE_DATE_REQUIRED',
              'Schedule date is required',
            ),
            path: ['scheduleDate'],
          });
        }
        if (!data.scheduleTime?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: getMsg(
              'SCHEDULE_TIME_REQUIRED',
              'Schedule time is required',
            ),
            path: ['scheduleTime'],
          });
        }
        if (data.scheduleDate && data.scheduleTime?.trim()) {
          const [hoursStr, minutesStr] = data.scheduleTime.split(':');
          const hours = parseInt(hoursStr, 10);
          const minutes = parseInt(minutesStr, 10);
          if (isNaN(hours) || isNaN(minutes)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: getMsg(
                'SCHEDULE_TIME_REQUIRED',
                'Schedule time is required',
              ),
              path: ['scheduleTime'],
            });
          } else {
            const scheduledDateTime = new Date(data.scheduleDate);
            scheduledDateTime.setHours(hours, minutes, 0, 0);
            if (scheduledDateTime.getTime() <= Date.now()) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: getMsg(
                  'SCHEDULE_DATE_MUST_BE_FUTURE',
                  'Scheduled date and time must be in the future',
                ),
                path: ['scheduleTime'],
              });
            }
          }
        }
      }
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
      if (data.channel === 'sms' && data.message) {
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

export const buildCommunicationSchema = buildBroadcastSchema;
