import { ALLOWED_EXTENSIONS, FileExtension } from './stakeholders.consts';

export const normalizePhone = (phone: string): string => {
  const cleaned = phone?.toString().replace(/\D/g, '');
  if (cleaned?.length === 10) return `+977${cleaned}`;
  if (cleaned?.startsWith('977') && cleaned?.length === 13)
    return `+${cleaned}`;
  return phone;
};

export const isPhoneHeader = (header: string): boolean => /phone/i.test(header);

export const isEmailHeader = (header: string): boolean => /email/i.test(header);

export const isValidExtension = (ext: string): ext is FileExtension =>
  Object.prototype.hasOwnProperty.call(ALLOWED_EXTENSIONS, ext);
