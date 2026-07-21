'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import BeneficiaryDemographics from './beneficiaryDemographics';
import DigitalAccessOverview from './digitalAccessOverview';
import CommunicationAnalytics from './communicationAnalytics';
import MapView from './mapView';
import HeatwaveSpecific from './heatwave.specific';
import AccessAndResilienceOverview from './accessPieAndBar';
import SocialProtectionBenefits from './socialProtectionBenefits';
import TokenStatsCard from './tokenStats.card';
import ResilienceOverview from './resilienceOverview';
import { UUID } from 'crypto';

type TabConfig = {
  value: string;
  label: string;
  content: React.ReactNode;
};

type Props = {
  benefStats: any[];
  triggeersStats: any[];
  tokenStats: any;
  projectId: UUID;
  projectType: string;
};

export default function DashboardTabs({
  benefStats,
  triggeersStats,
  tokenStats,
  projectId,
  projectType,
}: Props) {
  const commonTabs: TabConfig[] = [
    {
      value: 'beneficiary',
      label: 'Beneficiary Demographics',
      content: (
        <div className="space-y-4">
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
        </div>
      ),
    },
    {
      value: 'tokens',
      label: 'Token Stats',
      content: <TokenStatsCard tokenStats={tokenStats} />,
    },
    {
      value: 'access',
      label: 'Access & Inclusion',
      content: <DigitalAccessOverview stats={benefStats} />,
    },
    {
      value: 'communication',
      label: 'Communication & Outreach',
      content: (
        <CommunicationAnalytics
          benefStats={benefStats}
          triggeersStats={triggeersStats}
          projectId={projectId}
        />
      ),
    },
  ];

  const dynamicTabs: TabConfig[] = [];
  if (projectType?.toUpperCase() === 'HEAT_WAVE') {
    dynamicTabs.push({
      value: 'heatwave',
      label: 'Heatwave Survey Data',
      content: <HeatwaveSpecific benefStats={benefStats} />,
    });
  }
  if (projectType?.toUpperCase() === 'FLOOD') {
    dynamicTabs.push({
      value: 'flood',
      label: 'Flood Survey Data',
      content: <AccessAndResilienceOverview data={benefStats} />,
    });
  }

  const allTabs: TabConfig[] = [
    {
      value: 'main',
      label: 'Main',
      content: (
        <div className="space-y-4">
          <ResilienceOverview
            benefStats={benefStats}
            triggeersStats={triggeersStats}
            projectId={projectId}
          />
          <MapView projectId={projectId} benefStats={benefStats} />
        </div>
      ),
    },
    ...dynamicTabs,
    ...commonTabs,
  ];

  return (
    <Tabs defaultValue="main" className="w-full">
      <TabsList className="border bg-secondary rounded p-1 inline-flex flex-wrap h-auto gap-1 justify-start">
        {allTabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="data-[state=active]:bg-primary data-[state=active]:text-white text-xs px-3 py-1.5"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {allTabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-4">
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="pr-4">{tab.content}</div>
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  );
}
