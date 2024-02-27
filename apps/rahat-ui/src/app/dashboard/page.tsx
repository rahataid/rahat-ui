'use client';

import { useAccount, useReadContract } from 'wagmi';
import {
  DashboardCharts,
  DashboardHeader,
  DashboardSummary,
} from '../sections/dashboard';
import { abi } from './storage-abi';

// export const metadata: Metadata = {
//   title: 'DashBoard',
// };

export default function DashBoardPage() {
  const account = useAccount();
  const { data, error, isLoading, isPending } = useReadContract({
    abi,
    address: '0xDeB7d3EA2e3fA3bC5CA00c76997B907b800F83F6',
    functionName: 'getRoleAdmin',
    args: ['0xAC6bFaf10e89202c293dD795eCe180BBf1430d7B'],
    account: account.address,
  });

  console.log('{data,error,isLoading} ', { data, error, isLoading, isPending });

  return (
    <div className="max-h-mx">
      <DashboardHeader />
      <DashboardSummary />
      <DashboardCharts />
    </div>
  );
}
