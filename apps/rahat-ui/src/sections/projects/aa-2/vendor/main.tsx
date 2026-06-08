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
import { useMemo } from 'react';

export default function VendorsView() {
  const { id } = useParams() as { id: UUID };
  const { activeTab, setActiveTab } = useActiveTab('vendorList');

  const { data: navTabsConfig } = useTabConfiguration(
    id as UUID,
    PROJECT_SETTINGS_KEYS.PROJECT_NAV_CONFIG,
  );

  const VendorsTabs = [
    { title: 'Vendor List', value: 'vendorList', module: 'all' },
    {
      title: 'Vendor Redemption List',
      value: 'vendorRedemptionList',
      module: 'fund',
    },
    {
      title: 'Inkind Redemption List',
      value: 'inkindRedemptionList',
      module: 'inkind',
    },
  ];

  const hasInkindManagement = useMemo(() => {
    return navTabsConfig?.value?.navsettings?.some(
      (tab: { title: string }) => tab.title === 'Inkind Management',
    );
  }, [navTabsConfig]);

  const hasFundManagement = useMemo(() => {
    return navTabsConfig?.value?.navsettings?.some(
      (tab: { title: string }) => tab.title === 'Fund Management',
    );
  }, [navTabsConfig]);

  const visibleTabs = useMemo(() => {
    return VendorsTabs.filter((tab) => {
      if (tab.module === 'all') return true;
      if (tab.module === 'inkind') return hasInkindManagement;
      if (tab.module === 'fund') return hasFundManagement;
      return false;
    });
  }, [hasInkindManagement]);

  return (
    <>
      <div className="p-4">
        <Heading
          title="Vendors"
          description="Track all the vendor reports here"
        />

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
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
          <TabsContent value="vendorRedemptionList">
            <VendorRedemptionList id={id} />
          </TabsContent>
          <TabsContent value="inkindRedemptionList">
            <InkindRedemptionList id={id} showActions={true} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
