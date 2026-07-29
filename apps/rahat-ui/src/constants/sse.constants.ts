import { PHASE_QUERY_KEYS } from '@rahat-ui/query';
import { UUID } from 'crypto';

export type EVENT =
  | 'phase.updated'
  | 'phase.created'
  | 'phase.deleted'
  | 'beneficiaries.updated'
  | 'trigger.updated'
  | 'trigger.created';

export const EVENT_QUERY_MAP: Record<string, (string | UUID)[][]> = {
  'beneficiaries.updated': [['beneficiaries']],
  'phase.updated': [[PHASE_QUERY_KEYS.PHASE], [PHASE_QUERY_KEYS.PHASES]],
  'phase.created': [[PHASE_QUERY_KEYS.PHASES]],
  'phase.deleted': [[PHASE_QUERY_KEYS.PHASES]],
  'trigger.updated': [[PHASE_QUERY_KEYS.PHASE]],
  'trigger.created': [[PHASE_QUERY_KEYS.PHASE]],
};
