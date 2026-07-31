import React from 'react';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronDown, Eye, TriangleAlert } from 'lucide-react';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@rahat-ui/shadcn/src/components/ui/hover-card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@rahat-ui/shadcn/src/components/ui/collapsible';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';

export enum FundStatus {
  NOT_DISBURSED = 'NOT_DISBURSED',
  DISBURSED = 'DISBURSED',
  STARTED = 'STARTED',
  FAILED = 'FAILED',
  ERROR = 'ERROR',
}

export const useFundManagementTableColumns = () => {
  const { id } = useParams();
  const router = useRouter();
  const t = useTranslations('AA_PROJECT');
  const tv = useTranslations('AA_PROJECT_WITH_CASH_TRACKER');
  const tg = useTranslations('GLOBAL');
  const formatNum = useNumberFormat();

  const handleViewClick = (fmId: string) => {
    router.push(`/projects/aa/${id}/fund-management/${fmId}`);
  };

  function fundStatusLabel(status: string) {
    const map: Record<string, string> = {
      NOT_DISBURSED: t('NOT_DISBURSED'),
      DISBURSED: tv('DISBURSED'),
      STARTED: tv('STARTED'),
      FAILED: tg('FAILED'),
      ERROR: tg('ERROR'),
    };
    return map[status] ?? status.replace(/_/g, ' ');
  }

  function renderBadgeStyle(status: FundStatus) {
    if (status === FundStatus.FAILED || status === FundStatus.ERROR) {
      return 'bg-red-100 text-red-500';
    }
    if (status === FundStatus.DISBURSED) {
      return 'bg-green-100 text-green-500';
    }
    if (status === FundStatus.STARTED) {
      return 'bg-blue-100 text-blue-500';
    }
    return 'bg-gray-200';
  }

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      accessorFn: (row) => row?.title,
      header: tv('FUND_TITLE'),
      cell: ({ row }) => (
        <TruncatedCell text={row?.original?.title || tg('N_A')} maxLength={10} />
      ),
    },
    {
      accessorKey: 'beneficiaryGroup',
      header: tv('BENEFICIARY_GROUP'),
      cell: ({ row }) => {
        return (
          <TruncatedCell
            text={row.original?.group?.name || tg('N_A')}
            maxLength={15}
          />
        );
      },
    },
    {
      accessorKey: 'tokens',
      header: tv('TOTAL_TOKENS'),
      cell: ({ row }) => <div>{formatNum(row?.original?.numberOfTokens)}</div>,
    },
    {
      accessorKey: 'tokensperBenef',
      header: t('TOKEN_PER_BENEFICIARY'),
      cell: ({ row }) => (
        <div>
          {formatNum(
            row?.original?.numberOfTokens /
              row.original.group.groupedBeneficiaries.length,
          )}
        </div>
      ),
    },
    {
      accessorKey: 'createdBy',
      header: t('CREATED_BY'),
      cell: ({ row }) => (
        <TruncatedCell
          text={row.getValue('createdBy') || tg('N_A')}
          maxLength={15}
        />
      ),
    },
    {
      accessorKey: 'status',
      header: tg('STATUS'),
      cell: ({ row }) => {
        const status = row.getValue('status') as FundStatus;

        return (
          <Badge className={renderBadgeStyle(status)}>
            {fundStatusLabel(status) || tg('N_A')}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: tg('ACTIONS'),
      enableHiding: false,
      cell: ({ row }) => {
        const status = row.getValue('status') as FundStatus;
        return (
          <div className="flex items-center gap-2">
            <TooltipComponent
              Icon={Eye}
              tip={tg('VIEW_DETAILS')}
              iconStyle="hover:text-primary cursor-pointer"
              handleOnClick={() => handleViewClick(row.original.uuid)}
            />
            {(status === FundStatus.FAILED || status === FundStatus.ERROR) && (
              <HoverCard openDelay={100}>
                <HoverCardTrigger asChild>
                  <button type="button" aria-label={tg('VIEW_FAILURE_DETAILS')}>
                    <TriangleAlert size={16} strokeWidth={1.5} color="red" />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent side="left" className="rounded-sm w-72">
                  <div className="flex space-x-2 items-center">
                    <TriangleAlert size={16} strokeWidth={1.5} color="red" />
                    <span className="font-semibold text-sm/6">
                      {t('TOKEN_DISBURSEMENT_FAILED')}
                    </span>
                  </div>
                  <Collapsible className="mt-2">
                    <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                      <ChevronDown size={12} />
                      {t('VIEW_TECHNICAL_DETAILS')}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <p className="text-gray-500 text-xs mt-2 break-words">
                        {row.original?.info?.error ?? t('SOMETHING_WENT_WRONG')}
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
        );
      },
    },
  ];
  return columns;
};
