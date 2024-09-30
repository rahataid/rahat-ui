import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import getIcon from 'apps/rahat-ui/src/utils/getIcon';
import { Plus, Ticket } from 'lucide-react';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import DataCard from 'apps/rahat-ui/src/components/dataCard';

const cardData = [
  { title: 'Total Voucher', icon: 'Ticket', total: '1439' },
  { title: 'Voucher Redeemed', icon: 'Ticket', total: '1439' },
  {
    title: 'Voucher Reimbursed',
    icon: 'Ticket',
    total: '1439',
  },
  {
    title: 'Voucher Assigned',
    icon: 'Ticket',
    total: '1439',
  },
];

export default function VouchersView() {
  const { id } = useParams();
  const router = useRouter();
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
              // <div key={index} className="rounded-sm bg-card p-6 shadow-md">
              //   <div className="flex justify-between items-center">
              //     <h1 className="text-sm">{item.title}</h1>
              //     <div className="p-1 rounded-full bg-secondary text-primary">
              //       <Icon size={16} strokeWidth={2.5} />
              //     </div>
              //   </div>
              //   <p className="text-primary font-semibold text-xl">
              //     {item.total}
              //   </p>
              // </div>
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
          <div className="border rounded-md bg-card"></div>
          <div className="col-span-2 border rounded-md bg-card"></div>
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
