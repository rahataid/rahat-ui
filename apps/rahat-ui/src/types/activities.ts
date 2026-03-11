// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.

import { UUID } from 'crypto';
import { GroupType } from './communication';

// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
export interface IActivitiesItem {
  id: number;
  campaignId: string;
  title: string;
  responsibility: string;
  source: string;
  phase: string;
  category: string;
  description: string;
  responsibleStation: string;
  // hazardType: string;
  status: string;
  activityType: string;
  activtiyComm: Record<string, any>;
  activityDocuments: {
    mediaURL: string;
    fileName: string;
  }[];
  activityCommunication: {
    groupId: string;
    message: string;
    groupType: string;
    transportId: string;
    communicationId: string;
    communicationTitle: string;
  }[];
}
export interface CommunicationDetails {
  message: string | { mediaURL: string; fileName: string };
  communicationTitle?: string;
  groupType: GroupType;
  groupId?: string;
  transportId?: string;
  subject?: string;
  audioURL?: { mediaURL: string; fileName: string };
  sessionId?: string;
  communicationId?: string;
}
export interface Template {
  uuid: UUID;
  title: string;
  description: string;
  managerId: UUID;
  phase: {
    uuid: UUID;
    name: string;
  };
  responsibleStation: string;
  category?: {
    uuid: UUID;
    name: string;
  };
  notes: string;
  manager: {
    uuid: UUID;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  completedAt: string;
  status: string;
  leadTime: string;
  activityDocuments: any;
  activityCommunication: CommunicationDetails[];
  isAutomated: boolean;
  completedBy: string;
  hasCommunication: boolean;
}
