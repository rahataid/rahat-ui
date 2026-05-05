import { mapStatus } from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronDown, ChevronRight, Eye } from 'lucide-react';

export function getDynamicColor(status: string) {
  if (status === 'LENSES') {
    return 'bg-teal-50 text-teal-500';
  }

  if (status === 'FRAMES') {
    return 'bg-violet-50 text-violet-500';
  }

  if (status === 'READING_GLASSES' || status === 'WALK_IN') {
    return 'bg-blue-50 text-blue-500';
  }

  if (status === 'SINGLE_VISION') {
    return 'bg-orange-50 text-orange-500';
  }

  if (status === 'PRE_DETERMINED' || status === 'REDEEMED') {
    return 'bg-green-50 text-green-500';
  }

  if (status === 'NOT_REDEEMED') {
    return 'bg-red-50 text-red-500';
  }

  return '';
}

interface BeneficiaryTableProps {
  handleViewClick: any;
}
export const useElkenyaBeneficiaryTableColumns = ({
  handleViewClick,
}: BeneficiaryTableProps) => {
  const columns: ColumnDef<any>[] = [
    {
      id: 'expander',
      enableHiding: false,
      header: () => null,
      cell: ({ row }) => {
        const Icon = row.getIsExpanded() ? ChevronDown : ChevronRight;
        const count = row.subRows?.length ?? 0;
        return (
          <div
            style={{ paddingLeft: row.depth * 16 }}
            className="flex items-center gap-1"
          >
            {row.getCanExpand() ? (
              <>
                <button
                  type="button"
                  onClick={row.getToggleExpandedHandler()}
                  className="hover:text-primary cursor-pointer"
                  aria-label={
                    row.getIsExpanded() ? 'Collapse row' : 'Expand row'
                  }
                >
                  <Icon size={16} strokeWidth={1.5} />
                </button>
                <Badge variant="secondary" className="px-1.5 py-0 text-xs">
                  {count}
                </Badge>
              </>
            ) : (
              <span className="inline-block" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'phone',
      header: 'Phone Number',
      cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => <div>{row.getValue('gender')}</div>,
    },
    {
      accessorKey: 'consentStatus',
      header: 'Consent Status',
      cell: ({ row }) => <div>{mapStatus(row.original.extras?.consent)}</div>,
    },
    {
      accessorKey: 'voucherStatus',
      header: 'Voucher Status',
      cell: ({ row }) => <div>{mapStatus(row.getValue('voucherStatus'))}</div>,
    },
    {
      accessorKey: 'eyeCheckupStatus',
      header: 'Voucher Usage',
      cell: ({ row }) => (
        <Badge>
          {row.original.eyeCheckupStatus === 'NOT_CHECKED'
            ? '-'
            : mapStatus(row.original.eyeCheckupStatus)}
        </Badge>
      ),
    },
    {
      accessorKey: 'isReferrer',
      header: 'Is Referrer',
      cell: ({ row }) => <div>{row.original.isReferrer ? 'Yes' : 'No'}</div>,
    },
    {
      accessorKey: 'voucherType',
      header: 'Glass Purchase Type',
      cell: ({ row }) => {
        const voucherType = row.getValue('voucherType');
        const colors = getDynamicColor(voucherType as string);
        return (
          <Badge className={colors}>
            {mapStatus(voucherType as string) || '-'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'vendor',
      header: 'Vendor',
      cell: ({ row }) => (
        <div
          style={{
            maxWidth: '200px',
          }}
        >
          {row.original.extras?.vendorName}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Eye
              className="hover:text-primary cursor-pointer"
              size={16}
              strokeWidth={1.5}
              onClick={() => handleViewClick(row.original)}
            />
          </div>
        );
      },
    },
  ];
  return columns;
};
