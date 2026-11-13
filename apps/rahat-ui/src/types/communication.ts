export type GroupType = 'STAKEHOLDERS' | 'BENEFICIARY';

export type TransportName = 'EMAIL' | 'SMS' | 'VOICE' | 'IVR';

export interface AudioFile {
  fileName: string;
  mediaURL: string;
}

export type AudienceOption = {
  id: string;
  name: string;
  count?: number;
};

export interface CommunicationData {
  communicationTitle?: string;
  groupType?: GroupType;
  groupId?: string[];
  beneficiaries?: AudienceOption[];
  stakeholders?: AudienceOption[];
  transportId: string;
  message?: string | AudioFile;
  subject?: string;
  audioURL?: AudioFile | string;
  sessionId?: string;
  communicationId?: string;
}

export interface CommunicationFetchData
  extends Omit<CommunicationData, 'message' | 'groupId'> {
  message?: string | AudioFile;
  groupId?: string[];
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
