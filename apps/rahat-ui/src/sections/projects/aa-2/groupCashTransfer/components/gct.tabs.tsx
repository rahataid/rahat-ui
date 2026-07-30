'use client';

import { ComponentType, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'libs/shadcn/src/components/ui/tabs';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';
import GctList from './gct.list';
import GctManagementList from './gct.management.list';
import GctOverview from './gct.overview';

// ─── Tab registry ─────────────────────────────────────────────────────────────

const GCT_TABS = [
  { value: 'overview', labelKey: 'OVERVIEW' },
  { value: 'gctGroupList', labelKey: 'GCT_GROUP_LIST' },
  { value: 'gctManagementList', labelKey: 'GCT_MANAGEMENT' },
] as const;

type GctTabValue = (typeof GCT_TABS)[number]['value'];

const componentMap: Record<GctTabValue, ComponentType> = {
  overview: GctOverview,
  gctGroupList: GctList,
  gctManagementList: GctManagementList,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function GctTabs() {
  const t = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const { activeTab, setActiveTab } = useActiveTab('overview');

  useEffect(() => {
    if (!activeTab) setActiveTab('overview');
  }, [activeTab, setActiveTab]);

  return (
    <div className="rounded-md border overflow-hidden">
      <Tabs
        value={activeTab || 'overview'}
        defaultValue={activeTab || 'overview'}
        onValueChange={setActiveTab}
      >
        <div className="px-4 pt-3">
          <TabsList className="border bg-secondary rounded mb-2">
            {GCT_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="w-full data-[state=active]:bg-white data-[state=active]:text-gray-700"
              >
                {t(tab.labelKey)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {GCT_TABS.map((tab) => {
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
