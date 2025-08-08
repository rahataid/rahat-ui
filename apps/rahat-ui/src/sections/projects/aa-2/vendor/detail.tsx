import {
  useGetVendorRedemptionStats,
  useGetVendorStellarStats,
} from '@rahat-ui/query/lib/aa';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { useParams } from 'next/navigation';
import { Back, Heading } from '../../../../common';
import { OverviewCard, ProfileCard, TransactionCard } from './components';
import VendorsBeneficiaryList from './tables/beneficiary.table';
import RedemptionRequestTable from './tables/redemption.request';
import VendorsTransactionsHistory from './tables/transactions.history';
import { useActiveTabDynamicKey } from 'apps/rahat-ui/src/utils/useActiveTabDynamicKey';

export default function Detail() {
  const { id, vendorId } = useParams();
  const { activeTab, setActiveTab } = useActiveTabDynamicKey(
    'tab',
    'vendorOverview',
  );

  const { data, isLoading } = useGetVendorStellarStats({
    projectUUID: id,
    uuid: vendorId,
    take: 10,
  });

  const { data: redemptionStats, isLoading: redemptionStatsLoading } =
    useGetVendorRedemptionStats({
      projectUUID: id,
      vendorUuid: vendorId,
    });

  return (
    <div className="p-4">
      <Back path="" />
      <Heading
        title="Vendor Details"
        description="Detailed view of the selected vendor"
      />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border bg-secondary rounded">
          <TabsTrigger
            value="vendorOverview"
            className="w-full data-[state=active]:bg-white"
          >
            Vendor Overview
          </TabsTrigger>
          <TabsTrigger
            value="transactionHistory"
            className="w-full data-[state=active]:bg-white"
          >
            Transaction History
          </TabsTrigger>
          <TabsTrigger
            value="beneficiaryList"
            className="w-full data-[state=active]:bg-white"
          >
            Beneficiary List
          </TabsTrigger>
          <TabsTrigger
            value="redemptionRequest"
            className="w-full data-[state=active]:bg-white"
          >
            Redemption Request
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vendorOverview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <ProfileCard />
            <OverviewCard
              data={data?.data}
              loading={isLoading}
              redemptionStats={redemptionStats?.data}
              redemptionStatsLoading={redemptionStatsLoading}
            />
            <TransactionCard
              transaction={data?.data?.transactions}
              loading={isLoading}
            />
          </div>
        </TabsContent>

        <TabsContent value="transactionHistory">
          <VendorsTransactionsHistory />
        </TabsContent>

        <TabsContent value="beneficiaryList">
          <VendorsBeneficiaryList />
        </TabsContent>

        <TabsContent value="redemptionRequest">
          <RedemptionRequestTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
