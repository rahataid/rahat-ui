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
  };
}

export interface Stat {
  name:
    | 'TOTAL_CUSTOMER'
    | 'ACTIVE_CUSTOMER'
    | 'INACTIVE_CUSTOMER'
    | 'NEWLY_INACTIVE_CUSTOMER'
    | 'CUSTOMERS_BY_MONTH'
    | 'TOTAL_MESSAGES_SENT'
    | 'TOTAL_MESSAGES_SUCCESS'
    | 'TOTAL_MESSAGES_FAILED'
    | 'MESSAGES_TO_CONSUMERS'
    | 'MESSAGES_TO_CUSTOMERS';
  data: number | unknown;
  group: 'VENDOR' | 'COMMUNICATION';
  createdAt: Date;
  updatedAt: Date;
}
