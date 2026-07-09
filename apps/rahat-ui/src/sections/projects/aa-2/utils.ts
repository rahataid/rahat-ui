import { UUID } from 'crypto';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { getExplorerUrl } from 'apps/rahat-ui/src/utils';

export function useTxUrl(projectUUID: UUID) {
  const { settings } = useProjectSettingsStore((s) => ({ settings: s.settings }));
  return (hash?: string | null): string | null =>
    getExplorerUrl({
      chainSettings: settings?.[projectUUID]?.[PROJECT_SETTINGS_KEYS.CHAIN_SETTINGS],
      target: 'tx',
      value: hash || '',
    });
}
