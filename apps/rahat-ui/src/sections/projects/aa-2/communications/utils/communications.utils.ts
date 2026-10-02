import { Transport } from '@rumsan/connect/src/types';
import { normalizeTransportName } from 'apps/rahat-ui/src/utils/string';
import { BroadcastChannel } from '../types';

export const CHANNEL_TO_TRANSPORT_NAME: Record<BroadcastChannel, string> = {
  sms: 'SMS',
  voice: 'VOICE',
  email: 'EMAIL',
};

const CHANNEL_TRANSPORT_ALIASES: Record<BroadcastChannel, string[]> = {
  sms: ['SMS', 'API', 'SES', 'ECHO'],
  voice: ['VOICE'],
  email: ['EMAIL', 'SMTP'],
};

export const resolveTransportByChannel = (
  transports: Transport[] | undefined,
  channel: BroadcastChannel,
): Transport | undefined =>
  transports?.find((transport) =>
    CHANNEL_TRANSPORT_ALIASES[channel].includes(
      normalizeTransportName(transport?.name),
    ),
  );

export const resolveChannelByTransportId = (
  transports: Transport[] | undefined,
  transportId?: string | null,
  audioURL?: { mediaURL?: string } | string | null,
): 'SMS' | 'VOICE' | 'EMAIL' => {
  const name = transports
    ?.find((transport) => transport?.cuid === transportId)
    ?.name?.toUpperCase();
  if (name === 'VOICE') return 'VOICE';
  if (name === 'EMAIL' || name === 'SMTP') return 'EMAIL';
  if (name === 'SMS') return 'SMS';
  if (typeof audioURL === 'object' && audioURL?.mediaURL) return 'VOICE';
  return 'SMS';
};

export type TargetAggregateStatus = 'DELIVERED' | 'IN_PROGRESS' | 'FAILED' | 'PENDING';

export const aggregateTargetStatus = (
  targets: { status?: string }[] | undefined,
): TargetAggregateStatus => {
  if (!targets || targets.length === 0) return 'PENDING';
  if (targets.every((target) => target?.status === 'SENT')) return 'DELIVERED';
  if (targets.every((target) => target?.status === 'PENDING')) return 'PENDING';
  if (
    targets.some(
      (target) =>
        target?.status === 'PENDING' || target?.status === 'PROCESSING',
    )
  )
    return 'IN_PROGRESS';
  return 'FAILED';
};

