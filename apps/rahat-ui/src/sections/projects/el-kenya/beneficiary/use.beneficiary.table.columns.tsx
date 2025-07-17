import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

interface BeneficiaryTableProps {
  handleViewClick: any;
}
export const useElkenyaBeneficiaryTableColumns = ({
  handleViewClick,
}: BeneficiaryTableProps) => {
  const { id } = useParams();
  const router = useRouter();

  function getDynamicColor(status: string) {
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

  const columns: ColumnDef<any>[] = [
    // {
    //   accessorKey: 'gender',
    //   header: 'Gender',
    //   cell: ({ row }) => <div>{row.getValue('gender')}</div>,
    // },
    {
      accessorKey: 'phone',
      header: 'Phone Number',
      cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    },
    {
      accessorKey: 'voucherType',
      header: 'Voucher Type',
      cell: ({ row }) => {
        const labelMap: Record<string, string> = {
          SINGLE_VISION: 'Ready to Clip (R2C)',
          READING_GLASSES: 'Reading Glasses',
        };

        const voucherType = row.getValue('voucherType');
        const colors = getDynamicColor(voucherType as string);
        return (
          <Badge className={colors}>
            {labelMap[voucherType as string] ||
              (voucherType as string) ||
              'N/A'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'type',
      header: 'Beneficiary Type',
      cell: ({ row }) => {
        const beneficiaryType = row.getValue('type');
        const colors = getDynamicColor(beneficiaryType as string);
        return (
          <div>
            <Badge className={colors}>
              {(beneficiaryType as string) || 'N/A'}
            </Badge>
            {row?.original?.extras?.serialNumber && (
              <p className="text-gray-400">Physical Voucher</p>
            )}
            {!!row?.original?.graphData?.otpAddeds?.length && (
              <p className="text-gray-400">Offline</p>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'eyeCheckupStatus',
      header: 'Eye Checkup Status',
      cell: ({ row }) => (
        <Badge>{row.getValue('eyeCheckupStatus') || 'N/A'}</Badge>
      ),
    },
    {
      accessorKey: 'glassesStatus',
      header: 'Glasses Status',
      cell: ({ row }) => (
        <Badge>{row.getValue('glassesStatus') || 'N/A'}</Badge>
      ),
    },
    {
      accessorKey: 'voucherStatus',
      header: 'Voucher Status',
      cell: ({ row }) => {
        const voucherStatus = row.getValue('voucherStatus');
        const colors = getDynamicColor(voucherStatus as string);
        return (
          <Badge className={colors}>{(voucherStatus as string) || 'N/A'}</Badge>
        );
      },
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => {
        return (
          <div>
            {row?.original?.extras?.location ||
              row?.original?.projectData?.location ||
              'N/A'}
          </div>
        );
      },
    },
    {
      accessorKey: 'tokenAssigned',
      header: 'Voucher Assignment Status',
      cell: ({ row }) => {
        const assignmentStatus =
          row?.original?.graphData?.tokensAllocateds?.length ||
          row?.original?.graphData?.walkInBeneficiaryAddeds?.length
            ? 'Assigned'
            : 'Not Assigned';
        const timestamp =
          row?.original?.graphData?.tokensAllocateds?.[0]?.blockTimestamp ||
          row?.original?.graphData?.walkInBeneficiaryAddeds?.[0]
            ?.blockTimestamp;
        const tokenAssignedDate = timestamp
          ? new Date(timestamp * 1000).toLocaleString()
          : '';

        return (
          <div>
            {assignmentStatus} <br />
            <span className="text-sm text-muted-foreground">
              {tokenAssignedDate}
            </span>
          </div>
        );
      },
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
