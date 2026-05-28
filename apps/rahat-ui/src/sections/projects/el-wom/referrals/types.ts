export type ReferralStat = {
  name: string;
  data: any;
};

export type RedeemedRefereesStat = {
  redeemed: number;
  total: number;
  rate: number;
};

export type LimitReachedStat = {
  count: number;
  threshold: number;
};

export type TopReferrer = {
  phone: string | null;
  walletAddress: string | null;
  total: number;
  redeemed: number;
};

export type ReferralWeekly = {
  week: string;
  count: number;
};

export type RefereeVoucherTypeEntry = {
  id: string;
  count: number;
};

export type HistogramEntry = {
  id: string;
  count: number;
};

export const REFERRAL_STAT_NAMES = {
  TOTAL_REFERRERS: 'REFERRAL_TOTAL_REFERRERS',
  TOTAL_REFEREES: 'REFERRAL_TOTAL_REFEREES',
  REDEEMED_REFEREES: 'REFERRAL_REDEEMED_REFEREES',
  AVG_PER_REFERRER: 'REFERRAL_AVG_PER_REFERRER',
  HISTOGRAM: 'REFERRAL_HISTOGRAM',
  LIMIT_REACHED: 'REFERRAL_LIMIT_REACHED',
  TOP_REFERRERS: 'REFERRAL_TOP_REFERRERS',
  WEEKLY: 'REFERRAL_WEEKLY',
  REFEREE_VOUCHER_TYPE: 'REFERRAL_REFEREE_VOUCHER_TYPE',
  TOTAL_NEW_CONSUMERS: 'REFERRAL_TOTAL_NEW_CONSUMERS',
  TOTAL_NON_REDEEMED_NEW_CONSUMERS: 'REFERRAL_TOTAL_NON_REDEEMED_NEW_CONSUMERS',
  REFEREE_VOUCHER_USAGE: 'REFERRAL_REFEREE_VOUCHER_USAGE',
} as const;

export function getReferralStat<T = any>(
  stats: ReferralStat[] | undefined,
  name: string,
): T | undefined {
  return stats?.find((s) => s.name === name)?.data as T | undefined;
}
