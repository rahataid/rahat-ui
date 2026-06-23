export const CHANNELS = {
  WHATSAPP: 'Whatsapp Messaging Service',
  PLASGATE: 'Plasgate SMS',
};

export const targetTypeMap = {
  BENEFICIARY: 'Consumer',
  VENDOR: 'Customer',
};

// ─── Plasgate SMS helpers ────────────────────────────────────────────────────

export const PLASGATE_GSM7_LIMIT = 160;
export const PLASGATE_UNICODE_LIMIT = 70;

// GSM 03.38 default 7-bit alphabet (basic + extension table).
// Extension characters technically count as 2 septets, but for a single-SMS
// hard cap we treat any text that uses only these characters as GSM-7.
const GSM7_BASIC =
  '@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà';
const GSM7_EXTENSION = '\f^{}\\[~]|€';
const GSM7_CHARS = new Set([...GSM7_BASIC, ...GSM7_EXTENSION]);

export const isPlasgateChannel = (name?: string | null) =>
  !!name && name.toLowerCase().includes('plasgate');

export const isGsm7Message = (text: string) => {
  for (const ch of text) {
    if (!GSM7_CHARS.has(ch)) return false;
  }
  return true;
};

export type SmsEncoding = 'GSM-7' | 'Unicode';

export type PlasgateSmsInfo = {
  encoding: SmsEncoding;
  limit: number;
  length: number;
  remaining: number;
  exceeded: boolean;
};

export const getPlasgateSmsInfo = (text: string): PlasgateSmsInfo => {
  const gsm = isGsm7Message(text);
  const limit = gsm ? PLASGATE_GSM7_LIMIT : PLASGATE_UNICODE_LIMIT;
  const length = [...text].length;
  return {
    encoding: gsm ? 'GSM-7' : 'Unicode',
    limit,
    length,
    remaining: limit - length,
    exceeded: length > limit,
  };
};

// Strips the `whatsapp:` scheme prefix Twilio uses for WhatsApp addresses,
// e.g. "whatsapp:+6282253523295" -> "+6282253523295".
export const normalizePhoneAddress = (address?: string | null) =>
  (address ?? '').replace(/^whatsapp:/i, '').trim();

// `computeRate` returns the raw percentage as a float — useful for threshold
// comparisons (e.g. >= 80 → green). `formatRate` formats either a precomputed
// raw rate or the part/total pair into a display string.

export const computeRate = (part: number, total: number): number => {
  if (!Number.isFinite(part) || !Number.isFinite(total) || total <= 0) return 0;
  return (part / total) * 100;
};

export const formatRate = (partOrRate: number, total?: number): string => {
  const rate =
    typeof total === 'number' ? computeRate(partOrRate, total) : partOrRate;
  if (!Number.isFinite(rate) || rate <= 0) return '0%';
  if (rate >= 100) return '100%';
  if (rate < 1) return '<1%';
  if (rate > 99) return '>99%';
  return `${Math.round(rate)}%`;
};
