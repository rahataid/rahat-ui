import { Transport, ValidationContent } from '@rumsan/connect/src/types';
import {
  CommunicationData,
  CommunicationFetchData,
  AudioFile,
} from '../types/communication';

export const transformCommunicationData = (
  communications: CommunicationFetchData[],
  transports?: Transport[],
): CommunicationData[] => {
  if (!communications || communications.length === 0) {
    return [];
  }

  return communications.map((communication) => {
    const selectedTransport = transports?.find(
      (t) => t.cuid === communication?.transportId,
    );

    // For URL-based transports (VOICE/IVR), message comes as an object
    // Need to convert it to audioURL format
    if (selectedTransport?.validationContent === ValidationContent.URL) {
      const messageObj = communication.message as AudioFile | undefined;

      return {
        ...communication,
        message: '',
        groupId: communication.groupId ? [communication.groupId] : [],
        audioURL: messageObj
          ? {
              fileName: messageObj.fileName || '',
              mediaURL: messageObj.mediaURL || '',
            }
          : undefined,
      };
    }

    // For other transports (SMS/EMAIL), message is a string
    return {
      ...communication,
      groupId: communication.groupId ? [communication.groupId] : [],
      message:
        typeof communication.message === 'string' ? communication.message : '',
      audioURL: undefined, // Clear audioURL for non-URL transports
    };
  });
};
