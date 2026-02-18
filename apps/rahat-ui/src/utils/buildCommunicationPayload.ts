import {
  Transport,
  ValidationAddress,
  ValidationContent,
} from '@rumsan/connect/src/types';
import { CommunicationData } from '../types/communication';

export interface CommunicationPayload {
  communicationTitle?: string;
  groupType: string;
  groupId: string;
  transportId: string;
  message?: string | { fileName?: string; mediaURL?: string };
  subject?: string;
  sessionId?: string;
  communicationId?: string;
}

export const buildCommunicationPayload = (
  communication: CommunicationData,
  transports: Transport[] | undefined,
) => {
  const selectedTransport = transports?.find(
    (t) => t.cuid === communication.transportId,
  );

  if (!selectedTransport) {
    return [];
  }

  // Base payload with required fields
  const basePayload: CommunicationPayload = {
    communicationTitle: communication.communicationTitle,
    groupType: communication.groupType,
    groupId: communication.groupId,
    transportId: communication.transportId,
  };

  // Add optional fields if they exist
  if (communication.sessionId) {
    basePayload.sessionId = communication.sessionId;
  }

  if (communication.communicationId) {
    basePayload.communicationId = communication.communicationId;
  }

  // Build payload based on transport type
  if (selectedTransport.validationContent === ValidationContent.URL) {
    // For URL-based transports (e.g., VOICE), use audioURL as message
    return {
      ...basePayload,
      message: communication.audioURL,
    };
  }

  if (selectedTransport.validationAddress === ValidationAddress.EMAIL) {
    // For EMAIL transports, include subject and message
    return {
      ...basePayload,
      subject: communication.subject,
      message: communication.message,
    };
  }

  // For other transports (e.g., SMS), just use message
  return {
    ...basePayload,
    message: communication.message,
  };
};

export const buildCommunicationPayloads = (
  communications: CommunicationData[],
  transports: Transport[] | undefined,
) => {
  if (!communications || communications.length === 0) {
    return [];
  }

  return communications.map((communication) =>
    buildCommunicationPayload(communication, transports),
  );
};
