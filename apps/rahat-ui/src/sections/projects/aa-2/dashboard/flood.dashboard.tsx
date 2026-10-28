'use client';

import BeneficiaryDemographics from './component/beneficiaryDemographics';
import CommunicationAnalytics from './component/communicationAnalytics';
import MapView from './component/mapView';
import ResilienceOverview from './component/resilienceOverview';
import SocialProtectionBenefits from './component/socialProtectionBenefits';
import DigitalAccessOverview from './component/digitalAccessOverview';
import AccessAndResilienceOverview from './component/accessPieAndBar';
import TokenStatsCard from './component/tokenStats.card';

type Props = {
  benefStats: any[];
  triggeersStats: any[];
  tokenStats: any;
  projectId: string;
};

export default function FloodDashboard({ benefStats, triggeersStats, tokenStats, projectId }: Props) {
  return (
    <div className="space-y-3">
      <TokenStatsCard tokenStats={tokenStats} />
      <ResilienceOverview
        benefStats={benefStats}
        triggeersStats={triggeersStats}
        projectId={projectId}
      />
      <BeneficiaryDemographics
        benefStats={benefStats}
        triggeersStats={triggeersStats}
        projectId={projectId}
      />
      <SocialProtectionBenefits
        benefStats={benefStats}
        triggeersStats={triggeersStats}
        projectId={projectId}
      />
      <DigitalAccessOverview stats={benefStats} />
      <AccessAndResilienceOverview data={benefStats} />
      <CommunicationAnalytics
        benefStats={benefStats}
        triggeersStats={triggeersStats}
        projectId={projectId}
      />
      <div className="mb-2 h-full w-full">
        <MapView projectId={projectId} benefStats={benefStats} />
      </div>
    </div>
  );
}
