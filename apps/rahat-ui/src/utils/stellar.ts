import { PROJECT_SETTINGS_KEYS } from '@rahat-ui/query';

export const getStellarTxUrl = (
  settings: any,
  id: string,
  txHash: string,
): string => {
  if (!settings || !id || !txHash) return 'N/A';
  const network =
    settings?.[id]?.[PROJECT_SETTINGS_KEYS.STELLAR_SETTINGS]?.['network'] ===
    'mainnet'
      ? 'public'
      : 'testnet';

  return `https://stellar.expert/explorer/${network}/tx/${txHash}`;
};

export const formatTokenAmount = (
  value: number | string | null | undefined,
  settings: any,
  id: string,
): string => {
  if (!value || !settings || !id) return 'N/A';

  const assetCode =
    settings?.[id]?.[PROJECT_SETTINGS_KEYS.STELLAR_SETTINGS]?.assetcode || '';

  return `${value} ${assetCode}`;
};
