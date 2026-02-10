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
  extras?: {
    email?: string;
    channel?: string;
  };
}
