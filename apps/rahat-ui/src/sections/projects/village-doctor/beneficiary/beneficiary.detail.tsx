'use client';
import { useCambodiaBeneficiary } from '@rahat-ui/query';
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
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { formatLocalDateTime } from 'apps/rahat-ui/src/utils';
import { Copy, CopyCheck } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import TransactionHistoryView from './transaction.history.view';
import {
  eyePartnerDisplayName,
  villageDoctorDisplayName,
} from './use.beneficiary.table.columns';
import {
  VillageDoctorDetailChrome,
  VillageDoctorField,
  VillageDoctorSectionHeading,
} from '../page-shell';

export default function BeneficiaryDetail() {
  const params = useParams() as { id?: string; benId?: string; vId?: string };
  const benId = params.vId ?? params.benId;

  const { data } = useCambodiaBeneficiary({
    projectUUID: params.id,
    uuid: benId,
  }) as any;

  const [copyAction, setCopyAction] = useState<boolean>(false);
  const clickToCopy = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopyAction(true);
    setTimeout(() => {
      setCopyAction(false);
    }, 2000);
  };

  const vdLine = villageDoctorDisplayName(data?.data);
  const epLine = eyePartnerDisplayName(data?.data);

  const recordCreatedLabel = data?.data?.createdAt
    ? formatLocalDateTime(data.data.createdAt)
    : '—';

  return (
    <VillageDoctorDetailChrome
      title="Villager details"
      subtitle="Identifiers, onboarding data, and on-chain wallet for this villager record."
      backHref={`/projects/el-village-doctor/${params.id}/villagers`}
    >
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="border-b border-border/60 pb-4">
          <VillageDoctorSectionHeading
            title="Profile"
            description="Personally identifiable fields as captured for the program."
          />
        </CardHeader>
        <CardContent className="pt-6">
          <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <VillageDoctorField label="Villager name">
              {data?.data?.piiData?.name ?? '—'}
            </VillageDoctorField>
            {/* <VillageDoctorField label="Gender">
              {data?.data?.gender ?? '—'}
            </VillageDoctorField> */}
            <VillageDoctorField label="Phone number">
              {data?.data?.piiData?.phone ?? '—'}
            </VillageDoctorField>
            <VillageDoctorField label="Record created">
              {recordCreatedLabel}
            </VillageDoctorField>
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
            {/* <VillageDoctorField label="Villager type">
              <Badge variant="secondary" className="font-medium">
                {data?.data?.type ?? 'UNKNOWN'}
              </Badge>
            </VillageDoctorField> */}
            <VillageDoctorField label="Referred by (Village Doctor)">
              {vdLine === '-' ? '—' : vdLine}
            </VillageDoctorField>

            <VillageDoctorField label="Eye Partner">
              {epLine === '-' ? '—' : epLine}
            </VillageDoctorField>
          </dl>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm">
        <CardHeader className="border-b border-border/60 pb-4">
          <VillageDoctorSectionHeading
            title="Transactions"
            description="On-chain activity tied to this villager wallet."
          />
        </CardHeader>
        <CardContent className="pt-6">
          <TransactionHistoryView walletAddress={data?.data?.walletAddress} />
        </CardContent>
      </Card>
    </VillageDoctorDetailChrome>
  );
}
