import { z } from 'zod';
import { buildBroadcastSchema } from '../schemas/communication.schemas';

export type CommunicationChannel = 'sms' | 'voice' | 'email';
export type BroadcastChannel = CommunicationChannel;

export type CommunicationFormValues = z.infer<
  ReturnType<typeof buildBroadcastSchema>
> & {
  channel: CommunicationChannel;
};
export type BroadcastFormValues = CommunicationFormValues;

