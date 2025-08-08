import { PROJECT_SETTINGS_KEYS } from '@rahat-ui/query';

export const getStellarTxUrl = (
  settings: any,
  id: string,
  txHash: string,
): string => {
  const network =
    settings?.[id]?.[PROJECT_SETTINGS_KEYS.STELLAR_SETTINGS]?.['network'] ===
    'mainnet'
      ? 'public'
      : 'testnet';

  return `https://stellar.expert/explorer/${network}/tx/${txHash}`;
};
