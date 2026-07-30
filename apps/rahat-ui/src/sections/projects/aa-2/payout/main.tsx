'use client';
import { useTranslations } from 'next-intl';
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
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';
import PayoutTransactionList from './table/payoutTransactionList';
import PayoutOverview from './component/payout-overview';

export default function PayoutView() {
  const t = useTranslations('AA_PROJECT');
  const tv = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const formatNum = useNumberFormat();
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
        label: tv('NO_OF_BENEFICIARIES_RECEIVING_CASH'),
        value: statsPayout?.payoutStats?.beneficiaries || 'N/A',
        infoIcon: true,
        infoTooltip: tv('NO_OF_BENEFICIARIES_RECEIVING_CASH_TOOLTIP'),
      },
      {
        label: tv('TOTAL_CASH_DISTRIBUTION'),
        value:
          `Rs. ${formatNum(statsPayout?.payoutStats?.totalCashDistribution)}` || 'N/A',
        infoIcon: true,
        infoTooltip: tv('TOTAL_CASH_DISTRIBUTION_TOOLTIP'),
      },
    ];
  }, [statsPayout]);

  return (
    <div className="p-4 ">
      <div className="flex justify-between">
        <Heading
          title={t('PAYOUT2')}
          description={tv('TRACK_ALL_THE_PAYOUT_REPORTS_HERE')}
        />
        <div className="flex flex-end gap-2 items-center">
          <RoleAuth
            roles={[AARoles.ADMIN, AARoles.Municipality]}
            hasContent={false}
          >
            <IconLabelBtn
              Icon={Plus}
              handleClick={() => {
                route.push(
                  `/projects/aa/${projectID}/payout/initiate-payout?from=${activeTab}`,
                );
              }}
              name={tv('CREATE_PAYOUT')}
              variant="default"
              payout-main-bug-refactor
            />
          </RoleAuth>
        </div>
      </div>
      <div className="flex justify-between items-center space-x-4 ">
        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="border bg-secondary rounded">
            <TabsTrigger
              className="w-full data-[state=active]:bg-white"
              value="payoutOverview"
            >
              {tv('PAYOUT_OVERVIEW')}
            </TabsTrigger>
            <TabsTrigger
              className="w-full data-[state=active]:bg-white"
              value="payoutList"
            >
              {tv('PAYOUT_LIST')}
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
            <PayoutTransactionList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
