import { z } from 'zod';
import { buildBroadcastSchema } from '../schemas/communication.schemas';

export type BroadcastChannel = 'sms' | 'voice' | 'email';

export type BroadcastFormValues = z.infer<
  ReturnType<typeof buildBroadcastSchema>
> & {
  channel: BroadcastChannel;
};
