'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Copy, CopyCheck, Eye } from 'lucide-react';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { StatusChip, PriorityChip, TypeChip } from '../components';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';
import { UUID } from 'crypto';
import { useTranslations } from 'next-intl';
interface GrievanceTableRow {
  id: string;
  uuid: string;
  title: string;
  reportedBy: string;
  type: string;
  createdByUser: {
    name: string;
  };
  createdAt: string;
  priority: string;
  status: string;
}
export const useGrievancesTableColumns = () => {
  const formatDate = useDateFormat();
  const formatDigits = useLabelDigits();
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const router = useRouter();
  const { id: projectId } = useParams() as { id: UUID };
  const searchParams = useSearchParams();
  const redirectToHomeTab = searchParams.get('tab') || 'list';

  const columns: ColumnDef<GrievanceTableRow>[] = [
    {
      accessorKey: 'id',
      header: t('ID'),
      cell: ({ row }) => <div> {formatDigits(row.getValue('id'))}</div>,
    },
    {
      accessorKey: 'title',
      header: t('TITLE'),
      cell: ({ row }) => <TruncatedCell text={row.getValue('title')} />,
    },
    {
      accessorKey: 'reportedBy',
      header: t('REPORTED_BY'),
      cell: ({ row }) => <TruncatedCell text={row.getValue('reportedBy')} />,
    },
    {
      accessorKey: 'type',
      header: t('GRIEVANCE_TYPE'),
      cell: ({ row }) => (
        <div>
          <TypeChip type={row.getValue('type')} showIcon={false} />
        </div>
      ),
    },
    {
      accessorKey: 'createdBy',
      header: t('CREATED_BY'),
      cell: ({ row }) => (
        <TruncatedCell
          text={row.original?.createdByUser?.name}
          maxLength={30}
        />
      ),
    },
    {
      accessorKey: 'createdAt',
      header: t('CREATED_ON'),
      cell: ({ row }) => (
        <TruncatedCell text={formatDate(row.getValue('createdAt'), 'MMM d, yyyy, h:mm a')} />
      ),
    },
    {
      accessorKey: 'priority',
      header: t('PRIORITY'),
      cell: ({ row }) => (
        <div>
          <PriorityChip
            priority={row.getValue('priority')}
            showIcon={false}
            className="text-[10px]"
          />
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: tg('STATUS'),
      cell: ({ row }) => (
        <div>
          <StatusChip
            status={row.getValue('status')}
            showIcon={false}
            className="text-[10px]"
          />
        </div>
      ),
    },
    {
      id: 'action',
      header: tg('ACTION'),
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <TooltipComponent
              Icon={Eye}
              tip={tg('VIEW_DETAILS')}
              iconStyle="hover:text-primary cursor-pointer"
              handleOnClick={() =>
                router.push(
                  `/projects/aa/${projectId}/grievances/${row.original.uuid}?tab=${redirectToHomeTab}`,
                )
              }
            />
          </div>
        );
      },
    },
  ];

  return columns;
};

export const useProjectBeneficiaryGroupDetailsTableColumns = () => {
  const tg = useTranslations('GLOBAL');
  const router = useRouter();
  const { id, groupId } = useParams();

  const { clickToCopy, copyAction } = useCopy();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'walletAddress',
      header: tg('WALLET_ADDRESS'),
      cell: ({ row }) => (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger
              className="flex items-center gap-3 cursor-pointer"
              onClick={() =>
                clickToCopy(row?.original?.walletAddress, row?.original?.uuid)
              }
            >
              <p>{truncateEthAddress(row?.original?.walletAddress)}</p>
              {copyAction === row?.original?.uuid ? (
                <CopyCheck size={15} strokeWidth={1.5} />
              ) : (
                <Copy className="text-slate-500" size={15} strokeWidth={1.5} />
              )}
            </TooltipTrigger>
            <TooltipContent className="bg-secondary" side="bottom">
              <p className="text-xs font-medium">
                {copyAction === row?.original?.uuid
                  ? tg('COPIED')
                  : tg('CLICK_TO_COPY')}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },

    {
      id: 'actions',
      header: tg('ACTION'),
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <TooltipComponent
              Icon={Eye}
              tip={tg('VIEW_DETAILS')}
              iconStyle="hover:text-primary cursor-pointer"
              handleOnClick={() =>
                router.push(
                  `/projects/aa/${id}/beneficiary/${row?.original?.benefId}?groupId=${groupId}`,
                )
              }
            />
          </div>
        );
      },
    },
  ];

  return columns;
};
