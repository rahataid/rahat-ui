type RedemptionLog = {
  quantity?: number | null;
  quantityDisbursed?: number | null;
  redeemedAt?: string | null;
  createdAt?: string | null;
  txHash?: string | null;
  walletAddress?: string | null;
  mode?: string | null;
  beneficiary?: {
    name?: string | null;
    walletAddress?: string | null;
    phone?: string | null;
  } | null;
  vendor?: { name?: string | null } | null;
};

function formatMode(mode?: string | null) {
  const normalized = mode?.toUpperCase();
  return normalized === 'ONLINE' || normalized === 'OFFLINE'
    ? normalized
    : 'N/A';
}

export function buildRedemptionLogSheet(
  logs: RedemptionLog[],
  allocationMode?: string | null,
) {
  return [
    [
      'quantity',
      'redeemedAt',
      'txHash',
      'beneficiary name',
      'beneficiary walletAddress',
      'beneficiary phone',
      'vendor name',
      'mode',
    ],
    ...logs.map((log) => [
      String(log.quantity ?? log.quantityDisbursed ?? 0),
      log.redeemedAt ?? log.createdAt ?? 'N/A',
      log.txHash ?? 'N/A',
      log.beneficiary?.name ?? 'N/A',
      log.beneficiary?.walletAddress ?? log.walletAddress ?? 'N/A',
      log.beneficiary?.phone ?? 'N/A',
      log.vendor?.name ?? 'N/A',
      formatMode(log.mode ?? allocationMode),
    ]),
  ];
}
