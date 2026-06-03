export type SmsVoucherStat = {
  name: string;
  data: any;
};

export type VoucherTypeEntry = {
  id: string;
  count: number;
};

export type ConsentEntry = {
  id: 'Yes' | 'No';
  count: number;
};

export type GlassStatusEntry = {
  id: string;
  count: number;
};

// Source B — platform beneficiary stats (GET /projects/:uuid/stats)
// Returns Array<{ name: string; data: any }> where names are suffixed with "_ID_<uuid>"
export type PlatformStat = {
  name: string;
  data: any;
};

export type AgeRangeEntry = {
  id: string;
  count: number;
};

export type GenderEntry = {
  id: string;
  count: number;
};

/** Look up a platform stat by name prefix (names are suffixed with _ID_<uuid>) */
export function getPlatformStat<T = any>(
  stats: PlatformStat[] | undefined,
  prefix: string,
): T | undefined {
  return stats?.find((s) => s.name.startsWith(prefix))?.data as T | undefined;
}

export const PLATFORM_STAT_PREFIXES = {
  VENDOR_TOTAL: 'VENDOR_TOTAL_ID_',
  BENEFICIARY_AGE_RANGE: 'BENEFICIARY_AGE_RANGE_ID_',
  BENEFICIARY_GENDER: 'BENEFICIARY_GENDER_ID_',
} as const;

export const SMS_VOUCHER_STAT_NAMES = {
  BENEFICIARY_TOTAL: 'BENEFICIARY_TOTAL',
  NOT_REDEEM_STATS: 'NOT_REDEEM_STATS',
  VOUCHER_USAGE_TYPE_STATS: 'VOUCHER_USAGE_TYPE_STATS',
  REDEMPTION_STATS: 'REDEMPTION_STATS',
  CONSENT: 'CONSENT',
} as const;

export function getSmsVoucherStat<T = any>(
  stats: SmsVoucherStat[] | undefined,
  name: string,
): T | undefined {
  return stats?.find((s) => s.name === name)?.data as T | undefined;
}
