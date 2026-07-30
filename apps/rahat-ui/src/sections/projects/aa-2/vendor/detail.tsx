import {
  useGetVendorRedemptionStats,
  useGetVendorStellarStats,
  useLogsDetailsByVendor,
} from '@rahat-ui/query/lib/aa';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Back, Heading } from '../../../../common';
import { OverviewCard, PROFILECard, TransactionCard } from './components';
import VendorsBeneficiaryList from './tables/beneficiary.table';
import InKindBeneficiaryList from './tables/inkind.beneficiary.list';
import InKindLogs from './tables/inkind.logs';
import RedemptionRequestTable from './tables/redemption.request';
import VendorsTRANSACTIONSHistory from './tables/transactions.history';
import { useActiveTabDynamicKey } from 'apps/rahat-ui/src/utils/useActiveTabDynamicKey';
import { getVendorRedirectRoute } from 'apps/rahat-ui/src/utils/navigation';
import {
  useGetVendor,
  PROJECT_SETTINGS_KEYS,
  useTabConfiguration,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useMemo } from 'react';
import { InkindRedemptionList } from './tabs/inkind.redemption.list';

const TabsTriggerStats = (t: any) => [
  { title: t('VENDOR_OVERVIEW'), value: 'vendorOverview', module: 'all' },
  { title: t('TRANSACTION_HISTORY'), value: 'transactionHistory', module: 'fund' },
  { title: t('BENEFICIARY_LIST'), value: 'beneficiaryList', module: 'fund' },
  { title: t('REDEMPTION_REQUEST'), value: 'redemptionRequest', module: 'fund' },
  {
    title: t('IN_KIND_BENEFICIARY_LIST'),
    value: 'inKindBeneficiaryList',
    module: 'inkind',
  },
  { title: t('IN_KIND_LOGS'), value: 'inKindLogs', module: 'inkind' },
  {
    title: t('INKIND_REDEMPTION_LIST'),
    value: 'inkindRedemptionList',
    module: 'inkind',
  },
];

export default function Detail() {
  const { id, vendorId }: { id: UUID; vendorId: UUID } = useParams();
  const t = useTranslations('AA_PROJECT');
  const { activeTab, setActiveTab } = useActiveTabDynamicKey(
    'tab',
    'vendorOverview',
  );

  // Get nav tabs configuration to check which modules are enabled
  const { data: navTabsConfig } = useTabConfiguration(
    id as UUID,
    PROJECT_SETTINGS_KEYS.PROJECT_NAV_CONFIG,
  );

  // Check which modules are enabled in the nav configuration
  const hasFundManagement = useMemo(() => {
    return navTabsConfig?.value?.navsettings?.some(
      (tab: { title: string }) => tab.title === 'Fund Management',
    );
  }, [navTabsConfig]);

  const hasInkindManagement = useMemo(() => {
    return navTabsConfig?.value?.navsettings?.some(
      (tab: { title: string }) => tab.title === 'Inkind Management',
    );
  }, [navTabsConfig]);

  // Filter tabs based on enabled modules
  const visibleTabs = useMemo(() => {
    return TabsTriggerStats(t).filter((tab) => {
      if (tab.module === 'all') return true;
      if (tab.module === 'fund') return hasFundManagement;
      if (tab.module === 'inkind') return hasInkindManagement;
      return false;
    });
  }, [hasFundManagement, hasInkindManagement]);

  // Helper to check if tab should be rendered
  const shouldRenderTab = (tabValue: string) =>
    visibleTabs.some((tab) => tab.value === tabValue);

  const { data: vendorsDetail } = useGetVendor(vendorId as UUID);
  const vendor = vendorsDetail?.data?.find((v: any) => v.projectId === id);

  const { data, isLoading } = useGetVendorStellarStats({
    projectUUID: id,
    uuid: vendorId,
    take: 10,
  });

  const { data: logsData, isLoading: isLogsLoading } = useLogsDetailsByVendor({
    projectUuid: id,
    vendorId: vendorId,
    page: 1,
    perPage: 5,
    order: 'desc',
    sort: 'redeemedAt',
  });

  const slicedData = logsData?.data?.slice(0, 5) || [];

  const { data: redemptionStats, isLoading: redemptionStatsLoading } =
    useGetVendorRedemptionStats({
      projectUUID: id,
      vendorUuid: vendorId,
    });

  const searchParams = useSearchParams();
  const pagination = searchParams.get('pagination') as string;
  const navRoute = getVendorRedirectRoute(id, {
    pagination: JSON.stringify(pagination),
  });

  return (
    <div className="p-4">
      <Back path={navRoute} />
      <Heading
        title={t('VENDOR_DETAILS')}
        description={t('VENDOR_DETAIL_DESC', { name: vendor?.User?.name })}
      />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
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

        <TabsContent value="vendorOverview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <PROFILECard data={vendor?.User} />
            <OverviewCard
              data={data?.data}
              loading={isLoading}
              redemptionStats={redemptionStats?.data}
              redemptionStatsLoading={redemptionStatsLoading}
            />
            <TransactionCard
              transaction={data?.data?.transactions}
              inkindTRANSACTIONS={slicedData}
              loading={isLoading || isLogsLoading}
            />
          </div>
        </TabsContent>

        {shouldRenderTab('transactionHistory') && (
          <TabsContent value="transactionHistory">
            <VendorsTRANSACTIONSHistory />
          </TabsContent>
        )}

        {shouldRenderTab('beneficiaryList') && (
          <TabsContent value="beneficiaryList">
            <VendorsBeneficiaryList />
          </TabsContent>
        )}

        {shouldRenderTab('redemptionRequest') && (
          <TabsContent value="redemptionRequest">
            <RedemptionRequestTable />
          </TabsContent>
        )}

        {shouldRenderTab('inKindBeneficiaryList') && (
          <TabsContent value="inKindBeneficiaryList">
            <InKindBeneficiaryList />
          </TabsContent>
        )}

        {shouldRenderTab('inKindLogs') && (
          <TabsContent value="inKindLogs">
            <InKindLogs />
          </TabsContent>
        )}
        {shouldRenderTab('inkindRedemptionList') && (
          <TabsContent value="inkindRedemptionList">
            <InkindRedemptionList
              id={id}
              vendorId={vendorId}
              showActions={false}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
