import {
  ACTIVITY_QUERY_KEYS,
  FUND_MANAGEMENT_QUERY_KEYS,
  PHASE_QUERY_KEYS,
} from '@rahat-ui/query';
import { UUID } from 'crypto';

export type EVENT =
  | 'phase.updated'
  | 'phase.created'
  | 'phase.deleted'
  | 'beneficiaries.updated'
  | 'trigger.updated'
  | 'trigger.created'
  | 'fund.event'
  | 'activity.created'
  | 'activity.updated';

export const EVENT_QUERY_MAP: Record<
  string,
  (projectUuid: UUID) => (string | UUID)[][]
> = {
  'beneficiaries.updated': (projectUuid) => [['beneficiaries', projectUuid]],

  'phase.updated': (projectUuid) => [
    [PHASE_QUERY_KEYS.PHASE, projectUuid],
    [PHASE_QUERY_KEYS.PHASES, projectUuid],
    [PHASE_QUERY_KEYS.TRIGGER_STATEMENTS, projectUuid],
    [PHASE_QUERY_KEYS.TRIGGER_STATEMENT, projectUuid],
  ],

  'phase.created': (projectUuid) => [[PHASE_QUERY_KEYS.PHASES, projectUuid]],

  'phase.deleted': (projectUuid) => [[PHASE_QUERY_KEYS.PHASES, projectUuid]],

  'trigger.updated': (projectUuid) => [[PHASE_QUERY_KEYS.PHASE, projectUuid]],

  'trigger.created': (projectUuid) => [[PHASE_QUERY_KEYS.PHASE, projectUuid]],

  'activity.created': (projectUuid) => [
    [ACTIVITY_QUERY_KEYS.ACTIVITIES, projectUuid],
  ],

  'activity.updated': (projectUuid) => [
    [ACTIVITY_QUERY_KEYS.ACTIVITIES, projectUuid],
    [ACTIVITY_QUERY_KEYS.ACTIVITY, projectUuid],
    [ACTIVITY_QUERY_KEYS.ACTIVITIES_HAVING_COMMS, projectUuid],
  ],
  'fund.event': (projectUuid) => [
    [FUND_MANAGEMENT_QUERY_KEYS.TOKEN_DETAILS, projectUuid],
    [FUND_MANAGEMENT_QUERY_KEYS.TRANSFER_LIST, projectUuid],
    [FUND_MANAGEMENT_QUERY_KEYS.SAFE_OWNERS, projectUuid],
    [FUND_MANAGEMENT_QUERY_KEYS.GROUPS_RESERVED_FUNDS, projectUuid],
  ],
  'token.disbursed': (projectUuid) => [
    [FUND_MANAGEMENT_QUERY_KEYS.GROUPS_RESERVED_FUNDS, projectUuid],
  ],
};
