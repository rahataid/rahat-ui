import { useTranslations } from 'next-intl';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Heading } from 'apps/rahat-ui/src/common';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { VendorList } from './tabs/vendor.list';
import { VendorRedemptionList } from './tabs/vendor.redemption.list';
import { InkindRedemptionList } from './tabs/inkind.redemption.list';
import { PROJECT_SETTINGS_KEYS, useTabConfiguration } from '@rahat-ui/query';
import { useEffect } from 'react';
import { getEnabledVendorModules, resolveVendorTab } from './vendor-tabs';

export default function VendorsView() {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const { id } = useParams() as { id: UUID };
  const { activeTab, setActiveTab } = useActiveTab('vendorList');

  const { data: navTabsConfig, isLoading: isNavLoading } = useTabConfiguration(
    id as UUID,
    PROJECT_SETTINGS_KEYS.PROJECT_NAV_CONFIG,
  );

  const VendorsTabs = [
    { title: t('VENDOR_LIST'), value: 'vendorList', module: 'all' },
    {
      title: t('VENDOR_REDEMPTION_LIST'),
      value: 'vendorRedemptionList',
      module: 'fund',
    },
    {
      title: t('INKIND_REDEMPTION_LIST'),
      value: 'inkindRedemptionList',
      module: 'inkind',
    },
  ];

  const modules = getEnabledVendorModules(navTabsConfig);
  const visibleTabs = VendorsTabs.filter(
    (tab) =>
      tab.module === 'all' ||
      (tab.module === 'fund' && modules.fund) ||
      (tab.module === 'inkind' && modules.inkind),
  );
  const resolvedTab = resolveVendorTab(
    activeTab,
    visibleTabs,
    'vendorList',
    isNavLoading,
  );
  useEffect(() => {
    if (resolvedTab !== activeTab) setActiveTab(resolvedTab);
  }, [activeTab, resolvedTab, setActiveTab]);

  return (
    <>
      <div className="p-4">
        <Heading
          title={tg('VENDORS')}
          description={t('TRACK_ALL_THE_VENDOR_REPORTS_HERE')}
        />

        <Tabs value={resolvedTab} onValueChange={setActiveTab}>
          <TabsList className="border bg-secondary rounded">
            {visibleTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="w-full data-[state=active]:bg-white"
              >
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="vendorList">
            <VendorList id={id} />
          </TabsContent>
          {modules.fund && (
            <TabsContent value="vendorRedemptionList">
              <VendorRedemptionList id={id} />
            </TabsContent>
          )}
          {modules.inkind && (
            <TabsContent value="inkindRedemptionList">
              <InkindRedemptionList id={id} showActions={true} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </>
  );
}
