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
