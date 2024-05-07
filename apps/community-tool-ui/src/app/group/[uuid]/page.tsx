'use client';
import GroupDetail from 'apps/community-tool-ui/src/sections/group/groupdetails';
import { useParams } from 'next/navigation';

// export const columns: ColumnDef<GroupResponseById[]>[] = [
//   {
//     accessorKey: 'beneficiary',
//     header: 'FullName',
//     cell: ({ row }) => {
//       if (row && row.getValue && typeof row.getValue === 'function') {
//         const beneficiary = row.getValue('beneficiary') as Beneficiary;
//         if (beneficiary && beneficiary.firstName && beneficiary.lastName) {
//           return beneficiary.firstName + beneficiary.lastName;
//         }
//       }
//       return '';
//     },
//   },
//   {
//     accessorKey: 'beneficiary',
//     header: 'WalletAddress',
//     cell: ({ row }) => {
//       if (row && row.getValue && typeof row.getValue === 'function') {
//         const beneficiary = row.getValue('beneficiary') as Beneficiary;
//         if (beneficiary && beneficiary.walletAddress) {
//           return beneficiary.walletAddress;
//         }
//       }
//       return '';
//     },
//   },
//   {
//     accessorKey: 'beneficiary',
//     header: 'customID',
//     cell: ({ row }) => {
//       if (row && row.getValue && typeof row.getValue === 'function') {
//         const beneficiary = row.getValue('beneficiary') as Beneficiary;
//         if (beneficiary && beneficiary.customId) {
//           return beneficiary.customId;
//         }
//       }
//       return '';
//     },
//   },
//   {
//     accessorKey: 'beneficiaryId',
//     header: 'id',
//     cell: ({ row }) => <div>{row.getValue('beneficiaryId')}</div>,
//   },
// ];

export default function GroupDetailPage() {
  const { uuid } = useParams();

  return <GroupDetail uuid={uuid as string} />;
}
