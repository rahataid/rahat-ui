import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'libs/shadcn/src/components/ui/tabs';
import FundManagementList from '../tables/fm.table';
import TokensOverview from './token.overview';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';
import { PROJECT_SETTINGS_KEYS, useTabConfiguration } from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import InKind from './inKind';
import Counselling from './counselling';
import { CashTracker } from './cashTracker/cash.tracker';
import { InKindTracker } from './inKindTracker';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import Loader from 'apps/community-tool-ui/src/components/Loader';

const componentMap = {
  tokenOverview: TokensOverview,
  fundManagementList: FundManagementList,
  inKind: InKind,
  counselling: Counselling,
  cashTracker: CashTracker,
  inKindTracker: InKindTracker,
};

interface BackendTab {
  value: ComponentKey;
  label: string;
}
type ComponentKey = keyof typeof componentMap;

export default function FundManagementTabs() {
  const { activeTab, setActiveTab } = useActiveTab('tokenOverview');
  const { id: projectID } = useParams();

  const { data, isLoading } = useTabConfiguration(
    projectID as UUID,
    PROJECT_SETTINGS_KEYS.FUNDMANAGEMENT_TAB_CONFIG,
  );

  const backendTabs: BackendTab[] =
    data?.value?.tabs.length > 0
      ? data.value?.tabs
      : [
          { value: 'tokenOverview', label: 'TokensOverview' },
          { value: 'fundManagementList', label: 'FundManagementList' },
        ];

  const availableTabsConfig = backendTabs
    .filter((tab) => componentMap[tab.value])
    .map((tab) => ({
      ...tab,
      component: componentMap[tab.value],
    }));

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
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
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
