import { z } from 'zod';
import { Transport } from '@rumsan/connect/src/types';

const activityDocumentSchema = z.object({
  mediaURL: z.string(),
  fileName: z.string(),
});

const baseActivityFormSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 4 character' }),
  responsibility: z.string().min(2, { message: 'Please enter responsibility' }),
  source: z.string().min(2, { message: 'Please enter source' }),
  phaseId: z.string().min(1, { message: 'Please select phase' }),
  categoryId: z.string().min(1, { message: 'Please select category' }),
  leadTime: z.string().optional(),
  description: z
    .string()
    .optional()
    .refine((val) => !val || val.length > 4, {
      message: 'Must be at least 5 characters',
    }),
  isAutomated: z.boolean().optional(),
  activityDocuments: z.array(activityDocumentSchema).optional(),
});

export const createActivityFormSchema = (
  phases: Array<{ uuid: string; name: string }>,
) => {
  return baseActivityFormSchema.superRefine((data, ctx) => {
    const selectedPhase = phases.find((p) => p.uuid === data.phaseId);
    if (selectedPhase?.name !== 'PREPAREDNESS') {
      if (!data.leadTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Lead time is required for this phase',
          path: ['leadTime'],
        });
        return;
      }

      const parts = data.leadTime.split(' ');
      const valuePart = parts[0]?.trim();

      if (!valuePart) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Lead time is required for this phase',
          path: ['leadTime'],
        });
      }
    }
  });
};

const baseCommunicationFormSchema = z.object({
  communicationTitle: z
    .string()
    .min(1, { message: 'Communication title is required' })
    .min(2, {
      message: 'Communication title must be at least 2 characters',
    }),
  groupType: z.string().min(1, { message: 'Please select group type' }),
  groupId: z.string().min(1, { message: 'Please select group' }),
  transportId: z
    .string()
    .min(1, { message: 'Please select communication type' }),
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

export const createCommunicationFormSchema = (appTransports?: Transport[]) => {
  return baseCommunicationFormSchema.superRefine((data, ctx) => {
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
          message: 'Message is required',
          path: ['message'],
        });
      }
    }

    // Validate subject for EMAIL transport
    if (selectedTransport.name === 'EMAIL') {
      if (!data.subject || data.subject.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Subject is required for email',
          path: ['subject'],
        });
      }
    }

    // Validate audioURL for VOICE transport
    if (selectedTransport.name === 'VOICE') {
      if (!data.audioURL?.mediaURL || data.audioURL.mediaURL.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Audio is required for voice',
          path: ['audioURL'],
        });
      }
    }
  });
};
