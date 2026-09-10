import { useTranslations } from 'next-intl';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'libs/shadcn/src/components/ui/tabs';
import { useEffect, useMemo } from 'react';
import InkindList from './inkind.list';
import InkindOverview from './inkind.overview';
import InkindAllocationList from './inkind.allocation.list';

const componentMap: Record<string, React.ComponentType> = {
  inkindList: InkindList,
  inkindOverview: InkindOverview,
  inkindAllocation: InkindAllocationList,
};

export default function InkindTabs() {
  const tv = useTranslations('AA_PROJECT_WITH_GNOSIS');
  const { activeTab, setActiveTab } = useActiveTab('inkindOverview');

  const INKIND_TABS = useMemo(() => [
    { value: 'inkindOverview', label: tv('INKIND_OVERVIEW') },
    { value: 'inkindList', label: tv('IN_KIND_LIST') },
    { value: 'inkindAllocation', label: tv('ALLOCATION_LIST') },
  ] as const, [tv]);

  useEffect(() => {
    if (!activeTab) setActiveTab('inkindOverview');
  }, [activeTab, setActiveTab]);

  return (
    <div className="rounded-md border overflow-hidden">
      <Tabs
        value={activeTab || 'inkindOverview'}
        defaultValue={activeTab || 'inkindOverview'}
        onValueChange={setActiveTab}
      >
        <div className="px-4 pt-3">
          <TabsList className="border bg-secondary rounded mb-2">
            {INKIND_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="w-full data-[state=active]:bg-white data-[state=active]:text-gray-700"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {INKIND_TABS.map((tab) => {
          const TabComponent = componentMap[tab.value];
          return (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="px-4 pb-4 mt-0 overflow-auto"
            >
              <TabComponent />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
