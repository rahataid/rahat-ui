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
    | 'CUSTOMERS_BY_MONTH';
  data: number;
  group: 'VENDOR';
  createdAt: Date;
  updatedAt: Date;
}
