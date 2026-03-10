'use client';
import { Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import {
  useFetchTokenStatsStellar,
  usePayouts,
  usePayoutStats,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useMemo } from 'react';
import { AARoles, RoleAuth } from '@rahat-ui/auth';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';
import PayoutTransactionList from './table/payoutTransactionList';
import PayoutOverview from './component/payout-overview';

export default function PayoutView() {
  const params = useParams();
  const projectID = params.id as UUID;
  const route = useRouter();
  const { activeTab, setActiveTab } = useActiveTab('payoutOverview');

  const { data: payouts } = usePayouts(projectID, {
    page: 1,
    perPage: 999,
  });
  const { data: statsPayout } = usePayoutStats(projectID);
  useFetchTokenStatsStellar({
    projectUUID: projectID,
  });

  const payoutStats = useMemo(() => {
    return [
      {
        label: 'No. of Beneficiaries Recieving Cash',
        value: statsPayout?.payoutStats?.beneficiaries || 'N/A',
        infoIcon: true,
        infoTooltip: 'Total number of beneficiaries recieving cash',
      },
      {
        label: 'Total Cash Distribution',
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
      <div className="flex justify-between items-center space-x-4 ">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="border bg-secondary rounded">
            <TabsTrigger
              className="w-full data-[state=active]:bg-white"
              value="payoutOverview"
            >
              Payout Overview
            </TabsTrigger>
            <TabsTrigger
              className="w-full data-[state=active]:bg-white"
              value="payoutList"
            >
              Payout List
            </TabsTrigger>
          </TabsList>
          <TabsContent value="payoutOverview">
            <PayoutOverview
              payoutStats={payoutStats}
              statsPayout={statsPayout}
              payouts={payouts || { data: [] }}
            />
          </TabsContent>
          <TabsContent value="payoutList">
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
