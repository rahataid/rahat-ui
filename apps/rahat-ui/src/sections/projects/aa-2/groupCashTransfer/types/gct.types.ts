import { Tag } from 'emblor';

// ─── Domain ───────────────────────────────────────────────────────────────────

export type GctExtras = {
  district?: string;
  municipality?: string;
  ward?: string;
  email?: string;
  supportArea?: string[];
  isBankValidated?: boolean;
};

export type GctBankDetails = {
  bankName?: string;
  bankBranchName?: string;
  accountName?: string;
  accountNumber?: string;
};

export type GctItem = {
  uuid: string;
  name: string;
  phone?: string;
  extras?: GctExtras;
  bankDetails?: GctBankDetails;
  totalAssignedAmount?: number;
  groupCashTransferRecords?: GctFundRecord[];
};

export type GctFundRecord = {
  uuid: string;
  title?: string;
  amount: number;
  status: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  disbursedAt?: string;
  payoutProcessorId?: string;
  txHash?: string;
  groupCashTransfer?: {
    uuid: string;
    name: string;
    phone?: string;
    bankDetails?: GctBankDetails;
    extras?: GctExtras;
  };
  disbursementInfo?: {
    result?: {
      offrampRequest?: {
        id?: string;
        status?: string;
        createdAt?: string;
        updatedAt?: string;
        tokenAmount?: string;
        fiatAmount?: number | null;
        senderAddress?: string;
        transactionHash?: string;
        paymentProviderId?: string;
        settlementDate?: string;
        paymentDetails?: {
          amount?: number;
          endToEndId?: string;
          creditorName?: string;
          creditorAccount?: string;
          creditorAgent?: string;
          creditorBranch?: string;
          debtorAccount?: string;
          debtorName?: string;
        };
      };
      transaction?: {
        cipsBatchResponse?: {
          id?: number;
          batchId?: string;
          debitStatus?: string;
          responseCode?: string;
          responseMessage?: string;
        };
        cipsTxnResponseList?: {
          id?: number;
          creditStatus?: string;
          responseCode?: string;
          instructionId?: string;
          responseMessage?: string;
        }[];
      };
    };
    error?: string;
    disbursedBy?: string;
  };
};

export type GctRecordStatus =
  | 'NOT_STARTED'
  | 'PENDING'
  | 'STARTED'
  | 'COMPLETED';

// ─── Status styling ───────────────────────────────────────────────────────────

export const GCT_STATUS_STYLE: Record<string, string> = {
  NOT_STARTED: 'bg-gray-100 text-gray-600',
  PENDING: 'bg-yellow-100 text-yellow-700',
  STARTED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  SUCCESS: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-600',
};

export const GCT_RECORD_STATUSES = [
  'NOT_STARTED',
  'PENDING',
  'STARTED',
  'COMPLETED',
] as const;

// ─── Form value types (inferred from schemas — re-exported for consumers) ─────

export type { Tag };
