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
): CommunicationPayload[] => {
  const selectedTransport = transports?.find(
    (t) => t.cuid === communication.transportId,
  );

  if (!selectedTransport) {
    return [];
  }

  // If no group IDs, return empty array
  if (!communication.groupId || communication.groupId.length === 0) {
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

  // Create one payload per group ID
  return communication.groupId.map((groupId) => {
    const payload: CommunicationPayload = {
      communicationTitle: communication.communicationTitle,
      groupType: communication.groupType,
      transportId: communication.transportId,
      groupId: groupId, // Each payload has a single group ID as a string
      ...messagePayload,
    };

    // Add optional fields if they exist
    if (communication.sessionId) {
      payload.sessionId = communication.sessionId;
    }

    if (communication.communicationId) {
      payload.communicationId = communication.communicationId;
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
