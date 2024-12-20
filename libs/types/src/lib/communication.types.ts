export interface CreateCampaignPayload {
  name: string;
  type: string;
  startTime: any;
  status: string;
  details: any;
  audienceIds: number[];
  transportId: number;
}

export interface EditCampaignPayload {
  id: string;
  name?: string;
  type?: string;
  startTime?: any;
  status?: string;
  details?: any;
  audienceIds?: number[];
  transportId?: number;
}

export interface DeleteCampaignPayload {
  id: string;
}

export type IApiResponseError = {
  group: string;
  meta?: Record<string, string[]> | null;
  message: string;
  name: string;
  success: boolean;
  timestamp: number;
};

export type ICampaignFilterOptions = string[];

export enum CAMPAIGN_TYPES {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
  IVR = 'IVR',
  PHONE = 'PHONE',
}

export enum CAMPAIGN_STATUS {
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  SCHEDULED = 'SCHEDULED',
}

export enum CAMPAIGN_PATH {
  TEXT = 'text',
  VOICE = 'voice',
}

export enum COMMUNICATION_DELIVERY_STATUS {
  QUEUED = 'QUEUED',
  COMPLETED = 'COMPLETED',
  NO_ANSWER = 'NO_ANSWER',
  BUSY = 'BUSY',
  FAILED = 'FAILED',
}

export type ICampaignItem = {
  name: string;
  createdAt: string;
  id: number;
  transport: string;
  type: CAMPAIGN_TYPES;
  status: CAMPAIGN_STATUS;
  totalAudiences: number;
};

export type ICampaignCreateItem = {
  name: string;
  startTime: string | Date | null;
  details: string;
  transportId: number | null;
  type: CAMPAIGN_TYPES | null;
  audienceIds: number[] | null;
  file?: File | null;
  message?: string | null;
};

export type ICampaigns = ICampaignItem[];

export type ICampaignsTableFilterValue = string | string[];

export type ICampaignPagination = {
  currentPage?: number;
  total?: number;
  perPage: number;
  lastPage?: number;
};

export type ICampaignsListApiResponse = {
  meta: ICampaignPagination;
  rows: ICampaignItem[];
};

export interface CampaignsListHookReturn {
  campaigns: ICampaignsListApiResponse['rows'];
  isLoading: boolean;
  error: any;
  meta: ICampaignsListApiResponse['meta'];
}

export type IFilterOptions = string[];

interface IVR {
  url: string;
  method: string;
}

interface Audio {
  url: string;
  method: string;
}

interface TwiML {
  ivr: IVR;
  audio: Audio;
}

interface AudienceDetails {
  name: string;
  email: string;
  phone: string;
  discordId: string;
  discordToken: string;
}

export interface Audience {
  id: number;
  details: AudienceDetails;
  appId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
}

interface TransportDetails {
  api: string;
  sid: string;
  token: string;
}

export interface Transport {
  id: number;
  name: string;
  details: TransportDetails;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
}

export interface ICampaignItemApiResponse {
  id: number;
  appId: string;
  name: string;
  startTime: string;
  type: string;
  details: {
    from: string;
    twiml: TwiML;
    callbackUrl: string;
    countryCode: string;
    body?: string;
    message?: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
  transportId: number;
  deletedAt: null | string;
  transport: Transport;
  audiences: Audience[];
  campaigns: number[];
  totalAudiences: number;
  communicationLogs: any[];
}

export type ICampaignList = ICampaign[];
export interface ICampaign {
  id: number;
  uuid: string;
  name: string;
  message: string;
  transportId: string;
  sessionId: any;
  groupUID: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  addresses: string[];
}

export interface ITransportItemApiResponse {
  map(
    arg0: (transport: any) => import('react').JSX.Element,
  ): import('react').ReactNode;
  id: number;
  name: string;
  details: {
    auth: {
      user: string;
      password: string;
    };
    host: string;
    pool: boolean;
    port: number;
    secure: boolean;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
}

export type ICampaignLogItem = {
  id: number;
  status: COMMUNICATION_DELIVERY_STATUS;
  details: null;
  createdAt: string;
  audience: Audience;
  totalFailure: number;
  totalSuccessfulAnswer: number;
};

export type ICampaignLogsApiResponse = {
  meta: ICampaignPagination;
  rows: ICampaignLogItem[];
};

export type ICampaignDetailsHookReturn = {
  campaign: ICampaignItemApiResponse;
  isLoading: boolean;
  error: IApiResponseError;
};

export type ITransportDetailsHookReturn = {
  transports: ITransportItemApiResponse;
  isLoading: boolean;
  error: any;
};

export type ICampaignLogsHookReturn = {
  logs: ICampaignLogsApiResponse;
  isLoading: boolean;
  error: IApiResponseError;
};

export type MenuOptions = {
  title: string;
  onClick: () => void;
  show: boolean;
  icon?: string;
}[];
