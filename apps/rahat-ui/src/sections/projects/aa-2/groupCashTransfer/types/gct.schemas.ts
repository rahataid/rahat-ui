import { z } from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input';

// ─── Shared primitives ────────────────────────────────────────────────────────

const phoneRequired = z
  .string()
  .min(1, 'Phone number is required')
  .refine((v) => v !== '+977' && isValidPhoneNumber(v), {
    message: 'Invalid phone number',
  });

const emailOptional = z
  .string()
  .optional()
  .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
    message: 'Invalid email address',
  });

const supportAreaField = z
  .array(z.object({ id: z.string(), text: z.string() }))
  .optional();

// ─── Create / Edit GCT group ──────────────────────────────────────────────────

export const GctGroupSchema = z.object({
  name: z.string().min(1, 'GCT Group Name is required'),
  phone: phoneRequired,
  district: z.string().min(1, 'District is required'),
  municipality: z.string().min(1, 'Municipality is required'),
  ward: z.string().min(1, 'Ward is required'),
  bankName: z.string().min(1, 'Bank name is required'),
  bankBranchName: z.string().min(1, 'Branch name is required'),
  accountName: z.string().min(1, 'Account holder name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  email: emailOptional,
  supportArea: supportAreaField,
});

export type GctGroupValues = z.infer<typeof GctGroupSchema>;

// ─── Assign cash ──────────────────────────────────────────────────────────────

export const AssignCashSchema = z.object({
  title: z.string().min(1, 'Fund title is required'),
  groupCashTransferId: z.string().min(1, 'Please select a GCT group'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, {
      message: 'Amount must be a positive number',
    }),
});

export type AssignCashValues = z.infer<typeof AssignCashSchema>;

// ─── Duplicate-error handler (shared between create / edit / sheet) ───────────

export function applyDuplicateErrors(
  msg: string,
  setError: (field: string, err: { message: string }) => void,
) {
  if (/\bname\b/i.test(msg)) setError('name', { message: 'Group name already exists' });
  if (/phone/i.test(msg)) setError('phone', { message: 'Phone number already exists' });
  if (/email/i.test(msg)) setError('email', { message: 'Email already exists' });
  if (/account.?number/i.test(msg) || /account/i.test(msg))
    setError('accountNumber', { message: 'Account number already exists' });
}
