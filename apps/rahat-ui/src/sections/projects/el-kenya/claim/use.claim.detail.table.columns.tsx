import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';

export default function useClaimDetailTableColumn() {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'walletAddress',
      header: 'Wallet Address',
      cell: ({ row }) => <div>{row.getValue('walletAddress')}</div>,
    },
    {
      accessorKey: 'voucherStatus',
      header: 'Voucher Status',
      cell: ({ row }) => <Badge>{row.getValue('voucherStatus')}</Badge>,
    },
  ];

  return columns;
}
