import React from 'react';
import FundManagementDetailTable from './tables/fm.detail.table';
import { useParams } from 'next/navigation';
import { useSingleGroupReservedFunds } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { DataCard, HeaderWithBack } from 'apps/rahat-ui/src/common';
import { ONE_TOKEN_VALUE } from 'apps/rahat-ui/src/constants/aa.constants';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';

export default function FundManagementDetail() {
  const { id: projectID, fundId } = useParams();
  const t = useTranslations('AA_PROJECT');
  const tv = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const tg = useTranslations('GLOBAL');
  const fundStatusLabel = (status?: string) => {
    if (!status) return status;
    const map: Record<string, string> = {
      NOT_DISBURSED: t('NOT_DISBURSED'),
      DISBURSED: tv('DISBURSED'),
      STARTED: tv('STARTED'),
      FAILED: tg('FAILED'),
      ERROR: tg('ERROR'),
    };
    return map[status] ?? status.replace(/_/g, ' ');
  };

  const { data, isLoading } = useSingleGroupReservedFunds(
    projectID as UUID,
    fundId,
  );

  const formatNum = useNumberFormat();

  const FMTokensData = [
    {
      name: t('TOKENS'),
      amount: data?.numberOfTokens ?? 'N/A',
    },
    {
      name: t('TOTAL_BENEFICIARIES'),
      amount: data?.groupedBeneficiaries?.length ?? 0,
    },
    {
      name: t('CREATED_BY'),
      amount: data?.createdBy ?? 'N/A',
    },
    {
      name: t('N1_TOKEN_VALUE'),
      amount: `${t('RS')} ${formatNum(ONE_TOKEN_VALUE)}`,
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <HeaderWithBack
          path={`/projects/aa/${projectID}/fund-management?tab=fundManagementList`}
          title={isLoading ? <Skeleton className="h-7 w-56" /> : data?.title}
          subtitle={t('DETAILED_VIEW_OF_RESERVED_FUND')}
          status={isLoading ? undefined : fundStatusLabel(data?.status)}
          badgeClassName={
            data?.status === 'DISBURSED'
              ? 'bg-green-100 text-green-500'
              : data?.status === 'STARTED'
              ? 'bg-blue-100 text-blue-500'
              : ['FAILED', 'ERROR'].includes(data?.status ?? '')
              ? 'bg-red-100 text-red-500'
              : 'bg-gray-200'
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <DataCardSkeleton key={index} />
            ))
          : FMTokensData.map((item) => (
              <DataCard
                key={item.name}
                title={item.name}
                number={formatNum(item.amount)}
                className="border-solid rounded-md"
                iconStyle="bg-white text-secondary-muted"
              />
            ))}
      </div>

      <FundManagementDetailTable
        title={data?.name}
        group={data?.groupedBeneficiaries}
        loading={isLoading}
        status={data?.status}
        numberOfTokens={data?.numberOfTokens}
      />
    </div>
  );
}

function DataCardSkeleton() {
  return (
    <Card className="flex flex-col rounded-lg border justify-center">
      <CardHeader className="pb-2 p-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-2 h-4 w-20" />
      </CardHeader>

      <CardContent>
        <Skeleton className="h-8 w-24" />
      </CardContent>
    </Card>
  );
}
