
export type GroupType = 'STAKEHOLDERS' | 'BENEFICIARY';

export type TransportName = 'EMAIL' | 'SMS' | 'VOICE' | 'IVR';

export interface AudioFile {
  fileName: string;
  mediaURL: string;
}

export interface CommunicationData {
  communicationTitle?: string;
  groupType: GroupType;
  groupId: string[];
  transportId: string;
  message?: string;
  subject?: string;
  audioURL?: AudioFile;
  sessionId?: string;
  communicationId?: string;
}

export interface CommunicationFetchData
  extends Omit<CommunicationData, 'message' | 'groupId'> {
  message?: string | AudioFile;
  groupId?: string;
}

export interface DocumentFile {
  id: number;
  name: string;
}

export interface UploadedFile {
  mediaURL: string;
  fileName: string;
}

export interface EmptyAudioFile {
  fileName: '';
  mediaURL: '';
}
