import {
  PROJECT_SETTINGS_KEYS,
  useEntities,
  useTabConfiguration,
} from '@rahat-ui/query';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import Loader from 'apps/community-tool-ui/src/components/Loader';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';
import { UUID } from 'crypto';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'libs/shadcn/src/components/ui/tabs';
import { useParams } from 'next/navigation';
import FundManagementList from '../tables/fm.table';
import { CashTracker } from './cashTracker/cash.tracker';
import Counselling from './counselling';
import InKind from './inKind';
import { InKindTracker } from './inKindTracker';
import { MultiSigWalletView } from './multisig';
import TokensOverview from './token.overview';
import { defaultFundManagementTab } from 'apps/rahat-ui/src/constants/aa.tabValues.constants';
import { useEffect } from 'react';

const componentMap = {
  tokenOverview: TokensOverview,
  fundManagementList: FundManagementList,
  inKind: InKind,
  counselling: Counselling,
  cashTracker: CashTracker,
  inKindTracker: InKindTracker,
  multisigWallet: MultiSigWalletView,
};

interface BackendTab {
  value: ComponentKey;
  label: string;
}
type ComponentKey = keyof typeof componentMap;

export default function FundManagementTabs() {
  const { activeTab, setActiveTab } = useActiveTab('');
  const { id: projectID } = useParams();

  const { data, isLoading } = useTabConfiguration(
    projectID as UUID,
    PROJECT_SETTINGS_KEYS.FUNDMANAGEMENT_TAB_CONFIG,
  );
  const hasCashTracker = data?.value?.tabs?.some(
    (tab: any) => tab.value === 'cashTracker',
  );

  const hasInkindTracker = data?.value?.tabs?.some(
    (tab: any) => tab.value === 'inkindTracker',
  );
  const { isSuccess: isEntitiesFetched } = useEntities(
    projectID as UUID,
    PROJECT_SETTINGS_KEYS.ENTITIES,
    {
      enabled: hasCashTracker ? hasCashTracker : false,
    },
  );

  const { isSuccess: isInkindEntitiesFetched } = useEntities(
    projectID as UUID,
    PROJECT_SETTINGS_KEYS.ENTITIES,
    {
      enabled: isEntitiesFetched && hasInkindTracker,
    },
  );

  const backendTabs: BackendTab[] =
    data?.value?.tabs?.length > 0 ? data.value?.tabs : defaultFundManagementTab;

  const availableTabsConfig = backendTabs
    .filter((tab) => componentMap[tab.value])
    .map((tab) => ({
      ...tab,
      component: componentMap[tab.value],
    }));

  useEffect(() => {
    if (!activeTab && !isLoading) {
      const defaultTab = backendTabs[0].value;
      setActiveTab(defaultTab);
    }
  }, [backendTabs, activeTab, isLoading, setActiveTab]);

  if (isLoading) {
    return (
      <>
        <Skeleton className="h-10 w-96 rounded-sm" />
        <div className="h-[70vh] flex items-center justify-center">
          <Loader />
        </div>
      </>
    );
  }

  return (
    <div className="rounded-md p-4 border">
      <Tabs
        value={activeTab}
        defaultValue={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="border bg-secondary rounded mb-2">
          {availableTabsConfig.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="w-full data-[state=active]:bg-white data-[state=active]:text-gray-700"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {availableTabsConfig.map((tab) => {
          const Component = tab.component;
          return (
            <TabsContent key={tab.value} value={tab.value}>
              <Component />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
