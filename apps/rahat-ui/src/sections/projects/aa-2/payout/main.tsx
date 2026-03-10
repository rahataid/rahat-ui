'use client';
import { DataCard, Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import RecentPayout from './component/recent.payout';
import {
  useFetchTokenStatsStellar,
  useFundAssignmentStore,
  usePayouts,
  usePayoutStats,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useMemo } from 'react';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import DynamicPieChart from '../../components/dynamicPieChart';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';
import PayoutTransactionList from './table/payoutTransactionList';

export default function PayoutView() {
  const params = useParams();
  const projectID = params.id as UUID;
  const route = useRouter();
  const { activeTab, setActiveTab } = useActiveTab('payout');

  const { data: payouts } = usePayouts(projectID, {
    page: 1,
    perPage: 999,
  });
  const { data: statsPayout, isLoading } = usePayoutStats(projectID);
  useFetchTokenStatsStellar({
    projectUUID: projectID,
  });

  const payoutStats = useMemo(() => {
    return [
      {
        label: 'No. of Beneficiaries Recieving Cash',
        // subtitle: '',
        value: statsPayout?.payoutStats?.beneficiaries || 'N/A',
        infoIcon: true,
        infoTooltip: 'Total number of beneficiaries recieving cash',
      },
      {
        label: 'Total Cash Distribution',
        // subtitle: ' ',
        value:
          `Rs. ${statsPayout?.payoutStats?.totalCashDistribution}` || 'N/A',
        infoIcon: true,
        infoTooltip: 'Total amount of cash distributed to the beneficiaries',
      },
    ];
  }, [statsPayout]);

  return (
    <div className="p-4 ">
      <div className="flex justify-between">
        <Heading
          title="Payout"
          description="Track all the payout reports here"
        />
        <div className="flex flex-end gap-2 items-center">
          <RoleAuth
            roles={[AARoles.ADMIN, AARoles.Municipality]}
            hasContent={false}
          >
            <IconLabelBtn
              Icon={Plus}
              handleClick={() => {
                route.push(`/projects/aa/${projectID}/payout/initiate-payout`);
              }}
              name="Create Payout"
              variant="default"
              payout-main-bug-refactor
            />
          </RoleAuth>
        </div>
      </div>
      <div className="flex justify-between items-center space-x-4 rounded-md p-4 border">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="border bg-secondary rounded">
            <TabsTrigger
              className="w-full data-[state=active]:bg-white"
              value="payout"
            >
              Payout
            </TabsTrigger>
            <TabsTrigger
              className="w-full data-[state=active]:bg-white"
              value="payoutList"
            >
              Payout List
            </TabsTrigger>
          </TabsList>
          <TabsContent value="payout">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
              {payoutStats.map((stat) => {
                return (
                  <DataCard
                    key={stat.label}
                    title={stat.label}
                    number={stat.value as string}
                    className="rounded-sm h-32"
                    infoIcon={stat.infoIcon}
                    infoTooltip={stat.infoTooltip}
                  />
                );
              })}
            </div>
            <div className="flex flex-wrap mt-4 gap-4">
              <div className="flex-1 border rounded-sm p-4">
                <h1 className="text-lg font-medium mb-4">Payout Type</h1>
                <div className="w-full aspect-square">
                  <DynamicPieChart
                    pieData={[
                      {
                        label: 'FSP',
                        value:
                          statsPayout?.payoutOverview?.payoutTypes?.FSP || 0,
                      },
                      {
                        label: 'CVA',
                        value:
                          statsPayout?.payoutOverview?.payoutTypes?.VENDOR || 0,
                      },
                    ]}
                    colors={['#F4A462', '#2A9D90']}
                  />
                </div>
              </div>

              <div className="flex-1 border rounded-sm p-4">
                <h1 className="text-lg font-medium mb-4">Payout Status</h1>
                <div className="w-full aspect-square">
                  <DynamicPieChart
                    pieData={[
                      {
                        label: 'Success',
                        value:
                          statsPayout?.payoutOverview?.payoutStatus?.SUCCESS ||
                          0,
                      },
                      {
                        label: 'Failed',
                        value:
                          statsPayout?.payoutOverview?.payoutStatus?.FAILED ||
                          0,
                      },
                    ]}
                    colors={['#2A9D90', '#DC3545']}
                  />
                </div>
              </div>

              <div className="flex-[2] border rounded-sm p-4">
                <RecentPayout payouts={payouts?.data} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="payoutList">
            {/* <VendorRedemptionList id={id} /> */}
            <RoleAuth
              roles={[
                AARoles.ADMIN,
                AARoles.MANAGER,
                AARoles.Municipality,
                AARoles.UNICEFNepalCO,
              ]}
            >
              <PayoutTransactionList />
            </RoleAuth>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
