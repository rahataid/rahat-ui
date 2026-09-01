import { InkindType } from '../schemas/inkind.validation';

export type InkindItem = {
  uuid: string;
  name: string;
  description?: string;
  type: InkindType;
  availableStock?: number;
};

export type StockDialogState = {
  open: boolean;
  mode: 'add' | 'remove';
  item: InkindItem | null;
  quantity: string;
  error: string;
};

export type UpdateDialogState = {
  open: boolean;
  item: InkindItem | null;
  name: string;
  description: string;
  type: InkindType;
};

export type ConfirmDialogState = {
  open: boolean;
  item: InkindItem | null;
  name: string;
  description: string;
  type: InkindType;
};

export type ActionButtonProps = {
  label: string;
  icon: React.ReactNode;
  hoverClass: string;
  onClick: () => void;
  disabled?: boolean;
};
export interface Movement {
  id: number;
  uuid: string;
  inkindId: string;
  quantity: number;
  type: string;
  groupInkindId: string | null;
  redemptionId: string | null;
  createdAt: string;
  inkind: {
    id: number;
    uuid: string;
    name: string;
    type: string;
    description: string;
    availableStock: number;
    createdAt: string;
  } | null;
  groupInkind: {
    id: number;
    uuid: string;
    group: {
      name: string;
    };
    groupId: string;
    inkindId: string;
    quantityAllocated: number;
    quantityRedeemed: number;
    createdAt: string;
    updatedAt: string;
  } | null;
  redemption: unknown | null;
}
export interface InkindSummary {
  totalInkindTypes: number;
  totalStock: number;
  totalAvailableStock: number;
  totalAssignedStock: number;
  totalRedeemedStock: number;
  chartData: {
    redemptionType: {
      predefined: number;
      walkIn: number;
    };
  };
}
