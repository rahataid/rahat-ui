'use client';
import {
  useCambodiaHealthWorkerByUUIDStats,
  useCHWGet,
} from '@rahat-ui/query';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/components/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Copy, CopyCheck, ShoppingBag, UserCheck, Users } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import {
  VillageDoctorDetailChrome,
  VillageDoctorField,
  VillageDoctorSectionHeading,
} from '../page-shell';

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
    <VillageDoctorDetailChrome
      title={data?.data?.name}
      subtitle="Referral performance and identity for this Village Doctor."
      backHref={`/projects/el-village-doctor/${id}/chw`}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <DataCard
          title="Successful referrals"
          number={String(stats?.data?.sales ?? '—')}
          Icon={UserCheck}
          className="rounded-xl border-border/80 shadow-sm"
        />
        <DataCard
          title="Villagers referred"
          number={String(stats?.data?.leads ?? '—')}
          Icon={Users}
          className="rounded-xl border-border/80 shadow-sm"
        />
        <DataCard
          title="Eye checkups"
          number={String(stats?.data?.leads_converted ?? '—')}
          Icon={ShoppingBag}
          className="rounded-xl border-border/80 shadow-sm"
        />
      </div>

      <Card className="border-border/80 shadow-sm">
        <CardHeader className="border-b border-border/60 pb-4">
          <VillageDoctorSectionHeading
            title="Account"
            description="Wallet and data-collection identifiers."
          />
        </CardHeader>
        <CardContent className="pt-6">
          <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <VillageDoctorField label="Wallet address">
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="flex cursor-pointer items-center gap-2 text-left"
                      onClick={() =>
                        clickToCopy(data?.data?.walletAddress ?? '')
                      }
                    >
                      <span>
                        {truncateEthAddress(data?.data?.walletAddress)}
                      </span>
                      {copyAction ? (
                        <CopyCheck size={18} strokeWidth={1.5} />
                      ) : (
                        <Copy size={18} strokeWidth={1.5} />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs font-medium">
                      {copyAction ? 'Copied' : 'Click to copy'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </VillageDoctorField>
            <VillageDoctorField label="Phone number">
              {data?.data?.phone ?? '—'}
            </VillageDoctorField>
            <VillageDoctorField label="Kobo username">
              {data?.data?.koboUsername ?? '—'}
            </VillageDoctorField>
          </dl>
        </CardContent>
      </Card>
    </VillageDoctorDetailChrome>
  );
}
