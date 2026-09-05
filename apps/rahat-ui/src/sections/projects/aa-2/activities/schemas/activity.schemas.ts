import { z } from 'zod';
import { Transport } from '@rumsan/connect/src/types';

type Translator = (key: string, values?: Record<string, any>) => string;

const activityDocumentSchema = z.object({
  mediaURL: z.string(),
  fileName: z.string(),
});

export const buildActivityFormSchema = (t: Translator) =>
  z.object({
    title: z.string().min(2, { message: t('TITLE_MUST_BE_AT_LEAST_4_CHARACTER') }),
    responsibility: z.string().min(2, { message: t('PLEASE_ENTER_RESPONSIBILITY') }),
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


const buildBaseCommunicationFormSchema = (t: Translator) =>
  z.object({
    communicationTitle: z
      .string()
      .min(1, { message: t('COMMUNICATION_TITLE_IS_REQUIRED') })
      .min(2, {
        message: t('COMMUNICATION_TITLE_MIN_2_CHARACTERS'),
      }),
    groupType: z
      .string()
      .min(1, { message: t('PLEASE_SELECT_GROUP_AT_LEAST_ONE') }),
    groupId: z
      .array(z.string())
      .min(1, { message: t('PLEASE_SELECT_GROUP_AT_LEAST_ONE') }),
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
  });

export const createCommunicationFormSchema = (
  t: Translator,
  appTransports?: Transport[],
) => {
  return buildBaseCommunicationFormSchema(t).superRefine((data, ctx) => {
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
  });
};
