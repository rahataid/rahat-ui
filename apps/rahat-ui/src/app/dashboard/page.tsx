'use client';

import { Button } from '@rahat-ui/shadcn/components/button';
import { Input } from '@rahat-ui/shadcn/components/input';
import { useAccount, useReadContract } from 'wagmi';
import ChartsCard from '../../components/chartsCard';
import DataCard from '../../components/dataCard';
import { abi } from './storage-abi';

// export const metadata: Metadata = {
//   title: 'DashBoard',
// };

export default function DashBoardPage() {
  const account = useAccount();
  const { data, error, isLoading } = useReadContract({
    abi,
    address: '0xDeB7d3EA2e3fA3bC5CA00c76997B907b800F83F6',
    functionName: 'dataExists',
    args: ['0xAC6bFaf10e89202c293dD795eCe180BBf1430d7B'],
    account: account.address,
  });

  console.log('{data,error,isLoading} ', { data, error, isLoading });

  return (
    <div className="max-h-mx">
      <div className="flex items-center justify-between mb-9 mt-8">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input disabled placeholder="21 Jan 2024, 07 Feb 2024" />
          <Button type="submit">Download</Button>
        </div>
      </div>
      <div className=" grid md:grid-cols-4 gap-4">
        <DataCard
          className=""
          title="Total No. Of Beneficiaries"
          number={'12'}
          subTitle="+20% from last month"
        />
        <DataCard
          className=""
          title="Total No. Of Community"
          number={'12'}
          subTitle="+60% from last month"
        />
        <DataCard
          className=""
          title="Area Covered"
          number={'12'}
          subTitle="+40% from last month"
        />
        <DataCard
          className=""
          title="Total Donations"
          number={'$' + 12}
          subTitle="$35% from last month"
        />
      </div>
      <div className=" grid md:grid-cols-4 gap-4 mt-4">
        <ChartsCard className="" title="Beneficiaries" image="/charts.png" />
        <ChartsCard className="" title="Beneficiaries" image="/charts.png" />

        <ChartsCard className="" title="Beneficiaries" image="/charts.png" />
        <ChartsCard className="" title="Beneficiaries" image="/charts.png" />
      </div>
    </div>
  );
}
