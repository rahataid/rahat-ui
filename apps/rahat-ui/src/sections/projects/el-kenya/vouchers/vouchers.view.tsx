import {
  PROJECT_SETTINGS_KEYS,
  useFindAllKenyaStats,
  useProjectSettingsStore,
  useProjectStore,
} from '@rahat-ui/query';
import {
  ChartColumnStacked,
  ChartDonut,
} from '@rahat-ui/shadcn/src/components/charts';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import getIcon from 'apps/rahat-ui/src/utils/getIcon';
import { UUID } from 'crypto';
import {
  useReadRahatCvaKenyaBeneficiaryCount,
  useReadRahatTokenTotalSupply,
} from 'libs/query/src/lib/el-kenya/contracts/generated-hooks';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

export default function VouchersView() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
  const kenyaStats = useFindAllKenyaStats(id as UUID);

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );
  const { data: tokenAllocated } = useReadRahatCvaKenyaBeneficiaryCount({
    address: contractSettings?.rahatcvakenya?.address as `0x${string}`,
  });

  const { data: tokenBalance } = useReadRahatTokenTotalSupply({
    address: contractSettings?.rahattoken?.address as `0x${string}`,
  });

  const projectClosed = useProjectStore(
    (state) => state.singleProject?.projectClosed,
  );

  const REIMBURSEMENT_STATS = kenyaStats?.data?.find(
    (i: any) => i.name === 'REIMBURSEMENT_STATS',
  )?.data;

  const REDEMPTION_RATE = kenyaStats?.data?.find(
    (i: any) => i.name === 'REDEMPTION_RATE',
  )?.data;
  const notRedeemStats =
    kenyaStats?.data?.find((i: any) => i.name === 'NOT_REDEEM_STATS')?.data ||
    [];

  const glassRequired =
    notRedeemStats.find((item: any) => item.id === 'REQUIRED')?.count || 0;
  const glassNotRequired =
    notRedeemStats.find((item: any) => item.id === 'NOT_REQUIRED')?.count || 0;

  const REDEMPTION_STATS = kenyaStats?.data?.find(
    (i: any) => i.name === 'REDEMPTION_STATS',
  )?.data;

  const voucherReimbursedCount = REIMBURSEMENT_STATS?.find(
    (i: any) => i.id === 'APPROVED',
  )?.count;

  const singleVisionCount = REDEMPTION_STATS?.find(
    (i: any) => i.id === 'SINGLE_VISION',
  )?.count;

  console.log('REDEMPTION_STATS', REDEMPTION_STATS);

  const readingGlassesCount =
    REDEMPTION_STATS?.find((i: any) => i.id === 'READING_GLASSES')?.count || 0;

  const voucherRedeemedCount =
    Number(singleVisionCount ?? 0) + Number(readingGlassesCount ?? 0);
  const voucherNotRedeemedCount = tokenAllocated
    ? Number(tokenAllocated) - voucherRedeemedCount
    : 0;

  console.log('voucherRedeemedCount', {
    voucherRedeemedCount,
    singleVisionCount,
    readingGlassesCount,
    tokenAllocated,
  });

  const weeklyRedemptionsStats = kenyaStats?.data
    ?.find((i: any) => i.name === 'WEEKLY_REDEMPTION_STATS')
    ?.data?.filter(
      (i: any) =>
        i.voucherType === 'SINGLE_VISION' ||
        i.voucherType === 'READING_GLASSES',
    );

  function transformData(data: any) {
    const categories = [...new Set(data?.map((item) => item.week))];

    const series = data.reduce((acc, item) => {
      const { voucherType, count, week } = item;

      // Find or create a series entry for the current voucher type
      let seriesEntry = acc.find((s) => s.name === voucherType);
      if (!seriesEntry) {
        seriesEntry = {
          name: voucherType,
          data: Array(categories.length).fill(0),
        };
        acc.push(seriesEntry);
      }

      // Populate the count at the correct index matching the week
      const weekIndex = categories.indexOf(week);
      seriesEntry.data[weekIndex] = parseInt(count);

      return acc;
    }, []);

    return { categories, series };
  }

  const stackedColumnData = React.useMemo(() => {
    if (!weeklyRedemptionsStats)
      return { categories: ['demo'], series: [{ name: 'demo', data: [0] }] };
    if (weeklyRedemptionsStats?.length > 0)
      return transformData(weeklyRedemptionsStats);
  }, [weeklyRedemptionsStats]);

  const cardData = [
    // {
    //   title: 'Total Voucher',
    //   icon: 'Ticket',
    //   total: tokenBalance?.toString() ?? '-',
    // },
    {
      title: 'Voucher Assigned',
      icon: 'Ticket',
      total: tokenAllocated?.toString() ?? '-',
      subtitle: 'Total vouchers to all beneficiaries (Walk-in + Predetermined)',
    },
    {
      title: 'Beneficiary Voucher Redeemed',
      icon: 'Ticket',
      subtitle: 'Total vouchers redeemed by beneficiaries',
      total: voucherRedeemedCount ?? '-',
    },
    {
      title: 'Vendor Voucher Claimed',
      icon: 'Ticket',
      subtitle: 'Total vouchers claimed by beneficiaries',
      total: voucherReimbursedCount ?? '-',
    },
    {
      title: 'Voucher Redeemption Rate',
      icon: 'Ticket',
      total: REDEMPTION_RATE ?? '-',
      // subtitle: 'Per 100 vouchers',
    },
  ];

  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="font-semibold text-[28px]">Voucher Management</h1>
            <p className="text-muted-foreground text-base">
              Track all the voucher reports here.
            </p>
          </div>
          <Button
            onClick={() =>
              router.push(`/projects/el-kenya/${id}/vouchers/manage`)
            }
            disabled={projectClosed}
          >
            <Plus size={18} className="mr-1" />
            Manage Voucher
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-170px)]">
          <div className="grid grid-cols-4 gap-2 mb-4">
            {cardData?.map((item, index) => {
              const Icon = getIcon(item.icon as any);
              return (
                <DataCard
                  className="border-solid rounded-sm"
                  iconStyle="bg-white text-muted-foreground"
                  key={index}
                  title={item.title}
                  Icon={Icon}
                  number={item.total}
                  subtitle={item.subtitle}
                />
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-card border rounded-md p-4 shadow">
              <p className="text-md font-medium mb-4">Total Vouchers</p>
              <div className="flex justify-center">
                <ChartDonut
                  series={[voucherRedeemedCount, voucherNotRedeemedCount]}
                  labels={['Redeeemed', 'Not Redeemed']}
                  donutSize="70%"
                  width={300}
                  height={320}
                />
              </div>
            </div>
            <div className="bg-card border rounded-md p-4 shadow">
              <p className="text-md font-medium mb-4">Not Reedemed Vouchers</p>
              <div className="flex justify-center">
                <ChartDonut
                  series={[glassRequired, glassNotRequired]}
                  labels={['Glasses Required', 'Glasses Not Required']}
                  donutSize="70%"
                  width={300}
                  height={320}
                />
              </div>
            </div>
            {/* <div className="border rounded-md bg-card p-4">
              <h1 className="font-medium text-md mb-2">Recent Deposits</h1>
              <div className="flex space-x-4 items-center">
                <div className="p-2 rounded-full bg-secondary text-muted-foreground">
                  <Ticket size={18} strokeWidth={2} />
                </div>
                <div>
                  <h1 className="font-medium text-md">Voucher Redeem</h1>
                  <p className="text-muted-foreground text-sm">0x0012Bchsju</p>
                </div>
              </div>
            </div> */}
          </div>
          <div>
            <div className="col-span-3 border rounded-md bg-card p-4 shadow">
              <p className="text-md font-medium mb-4">Total Vouchers</p>
              <div className="flex justify-center">
                <ChartColumnStacked
                  series={stackedColumnData?.series}
                  categories={stackedColumnData?.categories as string[]}
                  stacked
                  custom
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
