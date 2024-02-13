import DataCard from '@/components/dataCard';
import { ResizablePanel } from '@/components/ui/resizable';
import { DashBoardCarousel } from '@/components/dashboardCarousel';
import ChartsCard from '@/components/chartsCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DashBoard',
};

export default function DashBoardPage() {
  return (
    // <ResizablePanel minSize={30}>
    <div className="max-h-mx">
      <div className="p-4 grid md:grid-cols-4 gap-4">
        <DataCard
          className=""
          title="Beneficiaries"
          number={12}
          subTitle="household"
        />
        <DataCard
          className=""
          title="Beneficiaries"
          number={12}
          subTitle="household"
        />
        {/* <div className="md:row-span-2 max-[779px]:order-last">
          <DashBoardCarousel />
        </div> */}
        <DataCard
          className=""
          title="Beneficiaries"
          number={12}
          subTitle="household"
        />
        <DataCard
          className=""
          title="Beneficiaries"
          number={12}
          subTitle="household"
        />
      </div>
      <div className="p-4 grid md:grid-cols-4 gap-4">
        <ChartsCard className="" title="Beneficiaries" image="/charts.png" />
        <ChartsCard className="" title="Beneficiaries" image="/charts.png" />

        <ChartsCard className="" title="Beneficiaries" image="/charts.png" />
        <ChartsCard className="" title="Beneficiaries" image="/charts.png" />
      </div>
      <div className="p-4 grid md:grid-cols-4 gap-4">
        <ChartsCard className="" title="Beneficiaries" image="/charts.png" />
        <ChartsCard className="" title="Beneficiaries" image="/charts.png" />

        <ChartsCard className="" title="Beneficiaries" image="/charts.png" />
        <ChartsCard className="" title="Beneficiaries" image="/charts.png" />
      </div>
      <div className="p-4 grid md:grid-cols-4 gap-4">
        <ChartsCard className="" title="Beneficiaries" image="/charts.png" />
        <ChartsCard className="" title="Beneficiaries" image="/charts.png" />

        <ChartsCard className="" title="Beneficiaries" image="/charts.png" />
        <ChartsCard className="" title="Beneficiaries" image="/charts.png" />
      </div>
      <div className="p-4 grid md:grid-cols-4 gap-4">
        <ChartsCard className="" title="Beneficiaries" image="/charts.png" />
        <ChartsCard className="" title="Beneficiaries" image="/charts.png" />

        <ChartsCard className="" title="Beneficiaries" image="/charts.png" />
        <ChartsCard className="" title="Beneficiaries" image="/charts.png" />
      </div>
    </div>
    // </ResizablePanel>
  );
}
