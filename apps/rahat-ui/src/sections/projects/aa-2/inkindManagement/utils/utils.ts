import { generateExcel } from 'apps/rahat-ui/src/utils';
import {
  Archive,
  ArchiveRestore,
  ArrowDown,
  ArrowUp,
  ShoppingBag,
} from 'lucide-react';

export function exportInkindSummary(summaryData: any) {
  const s = summaryData;
  if (!s) return;

  const rows = [
    {
      'Total Inkind Types': s?.totalInkindTypes ?? 0,
      'Total Stock': s?.totalStock ?? 0,
      'Total Available Stock': s?.totalAvailableStock ?? 0,
      'Total Assigned Stock': s?.totalAssignedStock ?? 0,
      'Total Redeemed Stock': s?.totalRedeemedStock ?? 0,
      'Total Unredeemed Stock': Math.max(0, (s?.totalAssignedStock ?? 0) - (s?.totalRedeemedStock ?? 0)),
      'Predefined Redemptions': s?.chartData?.redemptionType?.predefined ?? 0,
      'Walk-in Redemptions': s?.chartData?.redemptionType?.walkIn ?? 0,
    },
  ];

  generateExcel(rows, 'Inkind_Overview_Report', 8);
}

export function hasInkindData(summaryData: any) {
  const s = summaryData;
  return !!(
    s?.totalInkindTypes ||
    s?.totalStock ||
    s?.totalAvailableStock ||
    s?.totalAssignedStock ||
    s?.totalRedeemedStock
  );
}
export const MOVEMENT_CONFIG: Record<
  string,
  { labelKey: string; color: string; bgColor: string; Icon: React.ElementType }
> = {
  ADD: {
    labelKey: 'INKIND_ADDED',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    Icon: ArrowUp,
  },
  REMOVE: {
    labelKey: 'INKIND_REMOVED',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    Icon: ArrowDown,
  },
  LOCK: {
    labelKey: 'ASSIGNED_TO_GROUP',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    Icon: Archive,
  },
  UNLOCK: {
    labelKey: 'INKIND_UNLOCKED',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    Icon: ArchiveRestore,
  },
  REDEEM: {
    labelKey: 'DISTRIBUTED',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    Icon: ShoppingBag,
  },
};
