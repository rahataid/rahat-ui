import { useGetStatsCore } from '@rahat-ui/query';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Heading } from '../../common';
import BeneficiaryDemographics from './component/beneficiaryDemographics';
import DashboardSkeleton from './component/dasboardSkeleton';
import DigitalAccessOverview from './component/accessAndInclusion';
import SocialProtectionOverview from './component/vulnerableAndSocialProtectionOverview';
import DisasterImpactAndEarlyWarning from './component/disasterImpactAndEarlyWarning';
import AccessAndInclusion from './component/accessAndInclusion';
import VulnerableAndSocialProtectionOverview from './component/vulnerableAndSocialProtectionOverview';
import CommunicationsAndOutreach from './component/communicationsAndOutreach';

const DashboardMain = () => {
  const { data, isLoading } = useGetStatsCore();

  console.log(data);
  if (isLoading) return <DashboardSkeleton />;
  return (
    <div className=" p-2">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-4 mx-4">
        <Heading title="Dashboard" description="Overview of your system" />
      </div>

      <ScrollArea className="p-4 h-[calc(100vh-150px)]">
        <BeneficiaryDemographics benefStats={data} />
        <VulnerableAndSocialProtectionOverview statsData={data} />
        <AccessAndInclusion statsData={data} />
        <DisasterImpactAndEarlyWarning statsData={data} />
        <CommunicationsAndOutreach />
      </ScrollArea>
    </div>
  );
};

export default DashboardMain;
