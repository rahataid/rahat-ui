import { UUID } from 'crypto';
import { CustomerCategory, CustomerSource } from './crm.constants';

export interface Customer {
  id: string;
  uuid: UUID;
  customerCode: string;
  name: string;
  phone?: string;
  lastPurchaseDate?: Date;
  category: CustomerCategory;
  source: CustomerSource;
  walletAddress?: string;
  location?: string;
  bde?: string;
  bdm?: string;
  extras?: {
    email?: string;
    channel?: string;
    lastMessageSent?: Date;
  };
}

export type StatName =
  | 'TOTAL_CUSTOMER'
  | 'ACTIVE_CUSTOMER'
  | 'INACTIVE_CUSTOMER'
  | 'NEWLY_INACTIVE_CUSTOMER'
  | 'CUSTOMERS_BY_MONTH'
  | 'COMMUNICATION_STATS'
  | 'AUTOMATION_HEALTH'
  | 'FAILED_BATCH_COUNT'
  | 'RECENT_CAMPAIGNS'
  | 'RECENT_IMPORTS'
  | 'TOTAL_MESSAGES_SENT'
  | 'TOTAL_MESSAGES_SUCCESS'
  | 'TOTAL_MESSAGES_FAILED'
  | 'MESSAGES_TO_CONSUMERS'
  | 'MESSAGES_TO_CUSTOMERS';

export interface Stat {
  name: StatName;
  data: any;
  group: 'VENDOR' | 'COMMUNICATION';
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunicationStats {
  sent: number;
  failed: number;
  skipped: number;
  totalMessages: number;
  deliveryRate: number;
}

export interface AutomationHealth {
  totalRules: number;
  enabledRules: number;
  lastTriggeredAt: string | null;
}

export interface RecentCampaign {
  uuid: string;
  name: string;
  recipientCount: number;
  createdAt: string;
  sessionId: string | null;
  isAutomatic: boolean;
}

export interface RecentImport {
  uuid: string;
  status: string;
  createdAt: string;
  failedVendors: any;
  successVendors: any;
}

export interface CustomersByMonthEntry {
  month: string;
  ACTIVE: number;
  INACTIVE: number;
  NEWLY_INACTIVE: number;
}

/**
 * Category a customer was in when messaged (from their last purchase before the
 * SMS). UNKNOWN = no purchase on record before the SMS.
 */
export type SmsConversionCategory =
  'ACTIVE' | 'NEWLY_INACTIVE' | 'INACTIVE' | 'UNKNOWN';

export interface SmsConversionCounts {
  messaged: number;
  converted: number;
  rate: number;
}

/** SMS-attributed conversion: of customers messaged, how many purchased in-window. */
export interface SmsConversion extends SmsConversionCounts {
  /**
   * Per category-at-send cohort. A customer messaged in more than one category
   * counts in each, so these can sum to more than the overall totals.
   * Absent on stats saved before the breakdown existed.
   */
  byCategory?: Record<SmsConversionCategory, SmsConversionCounts>;
  windowDays: number;
}

/** One month of SMS-attributed conversion, bucketed by month messaged. */
export interface SmsConversionByMonthEntry extends SmsConversionCounts {
  month: string;
  /** Same cohort rules as SmsConversion.byCategory, within the month. */
  byCategory?: Record<SmsConversionCategory, SmsConversionCounts>;
}
