import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import getIcon from 'apps/rahat-ui/src/utils/getIcon';
import { Plus, Ticket } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import {
  ChartColumnStacked,
  ChartDonut,
} from '@rahat-ui/shadcn/src/components/charts';
import { useFindAllKenyaStats } from '@rahat-ui/query';
import { UUID } from 'crypto';

export default function VouchersView() {
  const { id } = useParams();
  const router = useRouter();
  const kenyaStats = useFindAllKenyaStats(id as UUID);

  const REIMBURSEMENT_STATS = kenyaStats?.data?.find(
    (i: any) => i.name === 'REIMBURSEMENT_STATS',
  )?.data;

  const REDEMPTION_STATS = kenyaStats?.data?.find(
    (i: any) => i.name === 'REDEMPTION_STATS',
  )?.data;

  const voucherReimbursedCount = REIMBURSEMENT_STATS?.find(
    (i: any) => i.status === 'APPROVED',
  )?.count;

  const singleVisionCount = REDEMPTION_STATS?.find(
    (i: any) => i.voucherType === 'SINGLE_VISION',
  )?.count;
  const readingGlassesCount = REDEMPTION_STATS?.find(
    (i: any) => i.voucherType === 'READING_GLASSES',
  )?.count;

  const voucherRedeemedCount = singleVisionCount + readingGlassesCount;

  const cardData = [
    { title: 'Total Voucher', icon: 'Ticket', total: '-' },
    {
      title: 'Voucher Redeemed',
      icon: 'Ticket',
      total: voucherRedeemedCount ?? '-',
    },
    {
      title: 'Voucher Reimbursed',
      icon: 'Ticket',
      total: voucherReimbursedCount ?? '-',
    },
    {
      title: 'Voucher Assigned',
      icon: 'Ticket',
      total: '-',
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
          >
            <Plus size={18} className="mr-1" />
            Manage Voucher
          </Button>
        </div>
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
              />
            );
          })}
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-card border rounded-md p-4 shadow">
            <p className="text-md font-medium mb-4">Total Vouchers</p>
            <div className="flex justify-center">
              <ChartDonut
                series={[voucherRedeemedCount, 0]}
                labels={['Redeeemed', 'Not Redeemed']}
                donutSize="70%"
                width={300}
                height={320}
              />
            </div>
          </div>
          <div className="col-span-2 border rounded-md bg-card p-4 shadow">
            <p className="text-md font-medium mb-4">Total Vouchers</p>
            <div className="flex justify-center">
              <ChartColumnStacked
                series={[
                  { name: 'Single Vision', data: [15, 19, 27, 44] },
                  { name: 'Reading Glass', data: [7, 16, 40, 11] },
                ]}
                categories={['Week 1', 'Week 2', 'Week 3', 'Week 4']}
                stacked
                custom
              />
            </div>
          </div>
          <div className="border rounded-md bg-card p-4">
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
          </div>
        </div>
      </div>
    </>
  );
}
