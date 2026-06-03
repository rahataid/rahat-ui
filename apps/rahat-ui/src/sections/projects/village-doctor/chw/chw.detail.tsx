'use client';
import { useCambodiaHealthWorkerByUUIDStats, useCHWGet } from '@rahat-ui/query';
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
import {
  BadgeDollarSign,
  Coins,
  Copy,
  CopyCheck,
  ShoppingBag,
  UserCheck,
  Users,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import {
  VillageDoctorDetailChrome,
  VillageDoctorField,
  VillageDoctorSectionHeading,
} from '../page-shell';

/** Next.js dynamic segment may be `string | string[]`. */
function routeSegment(v: string | string[] | undefined): string {
  if (v == null) return '';
  return typeof v === 'string' ? v : v[0] ?? '';
}

export default function ChwDetail() {
  const { id, chwId } = useParams();
  const projectUuid = routeSegment(id as string | string[] | undefined);
  const chwSlug = routeSegment(chwId as string | string[] | undefined);

  const { data } = useCHWGet({
    projectUUID: projectUuid,
    uuid: chwSlug,
  });

  /** Prefer canonical `uuid` from GET so stats always align with this row */
  const canonicalChwUid =
    typeof data?.data?.uuid === 'string' && data.data.uuid.trim().length > 0
      ? data.data.uuid.trim()
      : chwSlug;

  const { data: stats, isFetching: statsFetching } =
    useCambodiaHealthWorkerByUUIDStats({
      projectUUID: projectUuid,
      chwUid: canonicalChwUid,
    }) as any;

  const [copyAction, setCopyAction] = useState<boolean>(false);
  const clickToCopy = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopyAction(true);
    setTimeout(() => {
      setCopyAction(false);
    }, 2000);
  };

  const s = stats?.data ?? {};

  return (
    <VillageDoctorDetailChrome
      title={`Village Doctor - ${data?.data?.name}`}
      subtitle="Referral totals for this village doctor only—not program-wide figures."
      backHref={`/projects/el-village-doctor/${projectUuid}/chw`}
    >
      <div
        className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-7 ${
          statsFetching ? 'opacity-70 transition-opacity duration-200' : ''
        }`}
      >
        <DataCard
          title="Total Eyewear Sold"
          number={String(s.healthWorkerEyewearSold ?? s.totalEyewearSold ?? 0)}
          Icon={BadgeDollarSign}
          className="rounded-xl border border-border/80 shadow-sm shadow-black/[0.03]"
          titleClassName="text-sm font-medium text-muted-foreground"
          cardHeaderClassName="px-5 pb-2 pt-5"
          cardContentClassName="px-5 pb-5 pt-0"
          numberClassName="text-2xl font-semibold tracking-tight text-foreground"
        />
        <DataCard
          title="Total Villagers Referred"
          number={String(s.leadsRecieved ?? s.leads ?? 0)}
          Icon={Users}
          className="rounded-xl border border-border/80 shadow-sm shadow-black/[0.03]"
          titleClassName="text-sm font-medium text-muted-foreground"
          cardHeaderClassName="px-5 pb-2 pt-5"
          cardContentClassName="px-5 pb-5 pt-0"
          numberClassName="text-2xl font-semibold tracking-tight text-foreground"
        />
        <DataCard
          title="Total Successful Referrals"
          number={String(s.leadsConverted ?? s.leads_converted ?? 0)}
          Icon={UserCheck}
          className="rounded-xl border border-border/80 shadow-sm shadow-black/[0.03]"
          titleClassName="text-sm font-medium text-muted-foreground"
          cardHeaderClassName="px-5 pb-2 pt-5"
          cardContentClassName="px-5 pb-5 pt-0"
          numberClassName="text-2xl font-semibold tracking-tight text-foreground"
        />
        <DataCard
          title={
            <>
              Total Sales Amount by Village Doctor{' '}
              <span className="text-[#229b27]">(RMB)</span>
            </>
          }
          number={Number(s.totalPurchaseAmountRmb ?? s.totalPurchaseAmount ?? 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
          Icon={Coins}
          className="rounded-xl border border-border/80 shadow-sm shadow-black/[0.03]"
          titleClassName="text-sm font-medium text-muted-foreground"
          cardHeaderClassName="px-5 pb-2 pt-5"
          cardContentClassName="px-5 pb-5 pt-0"
          numberClassName="text-2xl font-semibold tracking-tight text-foreground"
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
