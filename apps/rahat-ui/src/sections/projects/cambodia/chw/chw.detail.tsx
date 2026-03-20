'use client';
import { useCambodiaHealthWorkerByUUIDStats, useCHWGet } from '@rahat-ui/query';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { CoinsIcon, Copy, CopyCheck, Ticket, Users2Icon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import HeaderWithBack from '../../components/header.with.back';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
export default function ChwDetail() {
  const { id, chwId } = useParams();
  const { data } = useCHWGet({ projectUUID: id, uuid: chwId as string });
  const { data: stats } = useCambodiaHealthWorkerByUUIDStats({
    projectUUID: id,
    chwUid: chwId as string,
  }) as any;

  const [copyAction, setCopyAction] = useState<boolean>(false);
  const clickToCopy = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopyAction(true);
    setTimeout(() => {
      setCopyAction(false);
    }, 2000);
  };
  return (
    <div className="h-[calc(100vh-95px)] m-4">
      <div className="flex space-x-3 mb-10">
        <HeaderWithBack
          title={data?.data?.name}
          subtitle="Here is the detailed view of selected health worker"
          path={`/projects/el-cambodia/${id}/chw`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-7">
        <DataCard
          title="Sales by CHW"
          number={stats?.data?.sales}
          Icon={CoinsIcon}
          className="rounded-lg border-solid "
        />
        <DataCard
          title="Villagers Referred"
          number={stats?.data?.leads}
          Icon={Users2Icon}
          className="rounded-lg border-solid"
        />
        <DataCard
          title="Eye Checkup in VC"
          number={stats?.data?.leads_converted}
          Icon={Ticket}
          className="rounded-lg border-solid "
        />
      </div>

      <div className="p-5 rounded-md border grid grid-cols-4 gap-5">
        <div>
          <h1 className="text-md text-muted-foreground">Wallet Address</h1>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger
                className="flex gap-3 cursor-pointer"
                onClick={() => clickToCopy(data?.data?.walletAddress)}
              >
                <p>{truncateEthAddress(data?.data?.walletAddress)}</p>
                {copyAction ? (
                  <CopyCheck size={20} strokeWidth={1.5} />
                ) : (
                  <Copy size={20} strokeWidth={1.5} />
                )}
              </TooltipTrigger>
              <TooltipContent className="bg-secondary" side="bottom">
                <p className="text-xs font-medium">
                  {copyAction ? 'copied' : 'click to copy'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Phone Number</h1>
          <p className="font-medium">{data?.data?.phone}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">UserName</h1>
          <p className="font-medium">{data?.data?.koboUsername}</p>
        </div>

        {/* <div>
          <h1 className="text-md text-muted-foreground">Beneficiary Type</h1>
          <p className="font-medium">
            <Badge>-</Badge>
          </p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Eye Checkup Status</h1>
          <p className="font-medium">
            <Badge>-</Badge>
          </p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Glasses Status</h1>
          <p className="font-medium">
            <Badge>-</Badge>
          </p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Voucher Type</h1>
          <p className="font-medium">
            <Badge>-</Badge>
          </p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Voucher Status</h1>
          <p className="font-medium">
            <Badge>-</Badge>
          </p>
        </div> */}
      </div>
    </div>
  );
}
