import { z } from 'zod';
import { Transport } from '@rumsan/connect/src/types';

type Translator = (key: string, values?: Record<string, any>) => string;

const activityDocumentSchema = z.object({
  mediaURL: z.string(),
  fileName: z.string(),
});

export const buildActivityFormSchema = (t: Translator) =>
  z.object({
    title: z
      .string()
      .min(2, { message: t('TITLE_MUST_BE_AT_LEAST_4_CHARACTER') }),
    responsibility: z
      .string()
      .min(2, { message: t('PLEASE_ENTER_RESPONSIBILITY') }),
    responsibleStation: z
      .string()
      .min(2, { message: t('PLEASE_ENTER_RESPONSIBLE_STATION') }),
    phaseId: z.string().min(1, { message: t('PLEASE_SELECT_PHASE') }),
    categoryId: z.string().min(1, { message: t('PLEASE_SELECT_CATEGORY') }),
    leadTime: z.string().optional(),
    description: z
      .string()
      .optional()
      .refine((val) => !val || val.length > 4, {
        message: t('MUST_BE_AT_LEAST_5_CHARACTERS'),
      }),
    isTemplate: z.boolean().optional(),
    isAutomated: z.boolean().optional(),
    activityDocuments: z.array(activityDocumentSchema).optional(),
  });

const audienceGroupSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  count: z.number().optional(),
});

const buildBaseCommunicationFormSchema = (t: Translator) =>
  z.object({
    communicationTitle: z
      .string()
      .min(1, { message: t('COMMUNICATION_TITLE_IS_REQUIRED') })
      .min(2, {
        message: t('COMMUNICATION_TITLE_MIN_2_CHARACTERS'),
      }),
    groupType: z.string().optional(),
    groupId: z.array(z.string()).optional(),
    beneficiaries: z.array(audienceGroupSchema).default([]),
    stakeholders: z.array(audienceGroupSchema).default([]),
    targetAudience: z.any().optional(),
    transportId: z
      .string()
      .min(1, { message: t('PLEASE_SELECT_COMMUNICATION_TYPE') }),
    message: z.string().optional(),
    subject: z.string().optional(),
    audioURL: z
      .object({
        mediaURL: z.string().optional(),
        fileName: z.string().optional(),
      })
      .optional(),
    sessionId: z.string().optional(),
    communicationId: z.string().optional(),
    isScheduled: z.boolean().default(false),
    scheduleDate: z.date().optional(),
    scheduleTime: z.string().optional(),
  });

export const createCommunicationFormSchema = (
  t: Translator,
  appTransports?: Transport[],
) => {
  return buildBaseCommunicationFormSchema(t).superRefine((data, ctx) => {
    const hasBeneficiaries =
      Array.isArray(data.beneficiaries) && data.beneficiaries.length > 0;
    const hasStakeholders =
      Array.isArray(data.stakeholders) && data.stakeholders.length > 0;
    const hasLegacyGroup =
      Array.isArray(data.groupId) && data.groupId.length > 0;

    if (!hasBeneficiaries && !hasStakeholders && !hasLegacyGroup) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          t('TARGET_AUDIENCE_REQUIRED') ||
          t('PLEASE_SELECT_GROUP_AT_LEAST_ONE'),
        path: ['targetAudience'],
      });
    }

    // Skip validation if transportId is not provided
    if (!data.transportId) {
      return;
    }

    // Skip validation if transports are not available
    if (!appTransports || appTransports.length === 0) {
      return;
    }

    const selectedTransport = appTransports.find(
      (t) => t.cuid === data.transportId,
    );

    // Skip validation if transport is not found
    if (!selectedTransport) {
      return;
    }

    // Validate message for SMS and EMAIL transports
    if (
      selectedTransport.name === 'SMS' ||
      selectedTransport.name === 'EMAIL'
    ) {
      if (!data.message || data.message.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('MESSAGE_IS_REQUIRED'),
          path: ['message'],
        });
      }
    }

    // Validate subject for EMAIL transport
    if (selectedTransport.name === 'EMAIL') {
      if (!data.subject || data.subject.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('SUBJECT_IS_REQUIRED_FOR_EMAIL'),
          path: ['subject'],
        });
      }
    }

    // Validate audioURL for VOICE transport
    if (selectedTransport.name === 'VOICE') {
      if (!data.audioURL?.mediaURL || data.audioURL.mediaURL.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('AUDIO_IS_REQUIRED_FOR_VOICE'),
          path: ['audioURL'],
        });
      }
    }

    if (data.isScheduled) {
      const getMsg = (key: string, fallback: string) => {
        try {
          const val = t(key);
          return val && !val.startsWith('AA_PROJECT.') ? val : fallback;
        } catch {
          return fallback;
        }
      };

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
  });
};
