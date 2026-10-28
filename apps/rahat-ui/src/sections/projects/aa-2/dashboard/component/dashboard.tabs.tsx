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
import { useTranslations } from 'next-intl';
import { UUID } from 'crypto';
import { PROJECT_SETTINGS_KEYS, useTabConfiguration } from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import Loader from 'apps/community-tool-ui/src/components/Loader';

type TabConfig = {
  value: string;
  label: string;
  content: React.ReactNode;
  // Matching `value` in DASHBOARD_TAB_CONFIG `value.tabs`.
  // Tabs without a configKey (i.e. `main`) are always shown.
  configKey?: string;
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
}: Props) {
  const t = useTranslations('AA_PROJECT');
  const { id: projectID } = useParams();

  const { data, isLoading } = useTabConfiguration(
    projectID as UUID,
    PROJECT_SETTINGS_KEYS.DASHNBOARD_TAB_CONFIG,
  );
  // `main` is always shown; every other tab is shown only if its
  // configKey appears in DASHBOARD_TAB_CONFIG `value.tabs`.
  const configuredValues: string[] = Array.isArray(data?.value?.tabs)
    ? data.value.tabs.map((tab: any) => tab?.value)
    : [];
  const isTabVisible = (tab: TabConfig) =>
    !tab.configKey ? true : configuredValues.includes(tab.configKey);

  if (isLoading) {
    return <Loader />;
  }

  const projectTabs: TabConfig[] = [
    {
      value: 'beneficiary',
      configKey: 'beneficiaryDemographics',
      label: t('BENEFICIARY_DEMOGRAPHICS'),
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
      value: 'flood',
      configKey: 'floodSurveyData',
      label: t('FLOOD_SURVEY_DATA'),
      content: <AccessAndResilienceOverview data={benefStats} />,
    },
    {
      value: 'heatwave',
      configKey: 'heatwaveSurveyData',
      label: t('HEATWAVE_SURVEY_DATA'),
      content: <HeatwaveSpecific benefStats={benefStats} />,
    },
    {
      value: 'tokens',
      configKey: 'tokenStats',
      label: t('TOKEN_STATS'),
      content: <TokenStatsCard tokenStats={tokenStats} />,
    },
    {
      value: 'access',
      configKey: 'accessInclusion',
      label: t('ACCESS_INCLUSION'),
      content: <DigitalAccessOverview stats={benefStats} />,
    },
    {
      value: 'communication',
      configKey: 'communicationOutreach',
      label: t('COMMUNICATION_OUTREACH'),
      content: (
        <CommunicationAnalytics
          benefStats={benefStats}
          triggeersStats={triggeersStats}
          projectId={projectId}
        />
      ),
    },
  ];

  const allTabs: TabConfig[] = [
    {
      value: 'main',
      label: t('MAIN'),
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
    ...projectTabs,
  ].filter(isTabVisible);

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
          <ScrollArea className="h-[calc(100vh-260px)] sm:h-[calc(100vh-220px)]">
            <div className="pr-4">{tab.content}</div>
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  );
}
