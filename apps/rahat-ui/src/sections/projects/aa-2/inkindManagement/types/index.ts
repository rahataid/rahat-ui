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
