import ChartsCard from '../../components/chartsCard';
import DataCard from '../../components/dataCard';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Input } from '@rahat-ui/shadcn/components/input';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DashBoard',
};

export default function DashBoardPage() {
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
