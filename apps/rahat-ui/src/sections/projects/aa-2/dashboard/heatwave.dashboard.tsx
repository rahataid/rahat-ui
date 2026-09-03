'use client';

import BeneficiaryDemographics from './component/beneficiaryDemographics';
import CommunicationAnalytics from './component/communicationAnalytics';
import MapView from './component/mapView';
import ResilienceOverview from './component/resilienceOverview';
import DigitalAccessOverview from './component/digitalAccessOverview';
import TokenStatsCard from './component/tokenStats.card';
import HeatwaveSpecific from './component/heatwave.specific';

type Props = {
  benefStats: any[];
  triggeersStats: any[];
  tokenStats: any;
  projectId: string;
};

export default function HeatwaveDashboard({ benefStats, triggeersStats, tokenStats, projectId }: Props) {
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
      <DigitalAccessOverview stats={benefStats} />
      <HeatwaveSpecific benefStats={benefStats} />
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
