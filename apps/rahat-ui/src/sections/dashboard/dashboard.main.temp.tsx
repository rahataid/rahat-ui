import { useGetStatsCore } from '@rahat-ui/query';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Heading } from '../../common';
import AccessAndResilienceOverview from './component/accessAndResilienceOverview';
import BeneficiaryDemographics from './component/beneficiaryDemographics';
import DashboardSkeleton from './component/dasboardSkeleton';
import DigitalAccessOverview from './component/digitalAccessOverview';
import SocialProtectionOverview from './component/socialProtectionOverview';

const DashboardMain = () => {
  const { data, isLoading } = useGetStatsCore();

  if (isLoading) return <DashboardSkeleton />;
  return (
    <div className=" p-2">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-4 mx-4">
        <Heading title="Dashboard" description="Overview of your system" />
      </div>

      <ScrollArea className="p-4 h-[calc(100vh-150px)]">
        <BeneficiaryDemographics benefStats={data} />
        <DigitalAccessOverview statsData={data} />
        <SocialProtectionOverview statsData={data} />
        <AccessAndResilienceOverview statsData={data} />
      </ScrollArea>
    </div>
  );
};

export default DashboardMain;
