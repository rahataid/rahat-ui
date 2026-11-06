import {
  Transport,
  ValidationAddress,
  ValidationContent,
} from '@rumsan/connect/src/types';
import { CommunicationData } from '../types/communication';

const GSM_7_CHARS =
  '@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞ' +
  'ÆæßÉ !\\"#¤%&\'()*+,-./' +
  '0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§' +
  '¿abcdefghijklmnopqrstuvwxyzäöñüà';

export const isUnicode = (message: string): boolean => {
  return [...message].some((char) => !GSM_7_CHARS.includes(char));
};

export const getSmsInfo = (message: string) => {
  const unicode = isUnicode(message);
  const characterCount = [...message].length;
  const smsCredits = unicode
    ? Math.ceil(characterCount / 70)
    : Math.ceil(characterCount / 160);

  return {
    characterCount,
    encoding: unicode ? 'UNICODE' : 'NON-UNICODE',
    smsCredits,
  };
};

export interface CommunicationPayload {
  communicationTitle?: string;
  groupType: string;
  groupId: string;
  transportId: string;
  message?: string | { fileName?: string; mediaURL?: string };
  subject?: string;
  sessionId?: string;
  communicationId?: string;
  extras?: {
    characterCount: number;
    encoding: string;
    smsCredits: number;
  };
}

export const buildCommunicationPayload = (
  communication: CommunicationData,
  transports: Transport[] | undefined,
): CommunicationPayload[] => {
  const selectedTransport = transports?.find(
    (t) => t.cuid === communication.transportId,
  );

  if (!selectedTransport) {
    return [];
  }

  // Extract target groups from beneficiaries/stakeholders or fallback to legacy groupId
  const targetGroups: Array<{ groupId: string; groupType: string }> = [];

  const hasBeneficiaries =
    Array.isArray(communication.beneficiaries) &&
    communication.beneficiaries.length > 0;
  const hasStakeholders =
    Array.isArray(communication.stakeholders) &&
    communication.stakeholders.length > 0;

  if (hasBeneficiaries || hasStakeholders) {
    communication.beneficiaries?.forEach((b) => {
      if (b.id) targetGroups.push({ groupId: b.id, groupType: 'BENEFICIARY' });
    });
    communication.stakeholders?.forEach((s) => {
      if (s.id) targetGroups.push({ groupId: s.id, groupType: 'STAKEHOLDERS' });
    });
  } else if (
    Array.isArray(communication.groupId) &&
    communication.groupId.length > 0 &&
    communication.groupType
  ) {
    const groupType = communication.groupType;
    communication.groupId.forEach((id) => {
      targetGroups.push({ groupId: id, groupType });
    });
  }

  if (targetGroups.length === 0) {
    return [];
  }

  // Build message payload based on transport type
  const messagePayload: Partial<CommunicationPayload> = {};

  if (selectedTransport.validationContent === ValidationContent.URL) {
    // For URL-based transports (e.g., VOICE), use audioURL as message
    messagePayload.message = communication.audioURL;
  } else if (selectedTransport.validationAddress === ValidationAddress.EMAIL) {
    // For EMAIL transports, include subject and message
    messagePayload.subject = communication.subject;
    messagePayload.message = communication.message;
  } else {
    // For other transports (e.g., SMS), just use message
    messagePayload.message = communication.message;
  }

  // Create one payload per group
  return targetGroups.map(({ groupId, groupType }) => {
    const payload: CommunicationPayload = {
      communicationTitle: communication.communicationTitle,
      groupType,
      transportId: communication.transportId,
      groupId: groupId,
      ...messagePayload,
    };

    // Add optional fields if they exist
    if (communication.sessionId) {
      payload.sessionId = communication.sessionId;
    }

    if (communication.communicationId) {
      payload.communicationId = communication.communicationId;
    }

    if (
      selectedTransport.name === 'SMS' &&
      typeof communication.message === 'string'
    ) {
      payload.extras = getSmsInfo(communication.message);
    }

    return payload;
  });
};

export const buildCommunicationPayloads = (
  communications: CommunicationData[],
  transports: Transport[] | undefined,
): CommunicationPayload[] => {
  if (!communications || communications.length === 0) {
    return [];
  }

  // Flatten the array since buildCommunicationPayload now returns an array
  return communications.flatMap((communication) =>
    buildCommunicationPayload(communication, transports),
  );
};
