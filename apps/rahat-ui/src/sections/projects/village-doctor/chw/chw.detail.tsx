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
import {
  BadgeDollarSign,
  Copy,
  CopyCheck,
  ShoppingBag,
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
  return typeof v === 'string' ? v : (v[0] ?? '');
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
      title={data?.data?.name}
      subtitle="Referral totals for this village doctor only—not program-wide figures."
      backHref={`/projects/el-village-doctor/${projectUuid}/chw`}
    >
        <div
          className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-7 ${
            statsFetching ? 'opacity-70 transition-opacity' : ''
          }`}
        >
          <DataCard
            title="Total Eyewear Sold"
            number={String(s.healthWorkerEyewearSold ?? s.totalEyewearSold ?? 0)}
            Icon={BadgeDollarSign}
            className="rounded-lg border-solid"
          />
          <DataCard
            title="Villagers Referred"
            number={String(s.leadsRecieved ?? s.leads ?? 0)}
            Icon={Users}
            className="rounded-lg border-solid"
          />
          <DataCard
            title="Total Vouchers Redeemed"
            number={String(s.leadsConverted ?? s.leads_converted ?? 0)}
            Icon={ShoppingBag}
            className="rounded-lg border-solid"
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
