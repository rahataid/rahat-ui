'use client';

import { useGrievanceEditStatus, useGrievanceDetails } from '@rahat-ui/query';
import { GrievanceStatus } from '@rahat-ui/query/lib/grievance/types/grievance';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import { grievanceStatus } from 'apps/rahat-ui/src/constants/aa.grievances.constants';
import { formatDateFull } from 'apps/rahat-ui/src/utils/dateFormate';
import { UUID } from 'crypto';
import { Expand, Pencil, X } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { PriorityChip, TypeChip } from '../components';
import { TooltipText } from 'apps/rahat-ui/src/components/tootltip.text';
import TooltipComponent from 'apps/rahat-ui/src/components/tooltip';

type IProps = {
  grievance: {
    id?: string;
    uuid?: string;
    projectId?: string;
    title?: string;
    description?: string;
    type?: string;
    status?: string;
    priority?: string;
    reportedBy?: string;
    reporterContact?: string;
    createdAt?: string;
    updatedAt?: string;
    tags?: string[];
    createdByUser?: {
      name?: string;
      email?: string;
      id?: number;
    };
    closedAt?: string;
    resolvedAt?: string;
  };
  closeSecondPanel: VoidFunction;
};

export default function GrievanceDetailSplitView({
  grievance: initialGrievance,
  closeSecondPanel,
}: IProps) {
  const router = useRouter();
  const { id: projectId } = useParams() as { id: UUID };
  const searchParams = useSearchParams();
  const redirectToHomeTab = searchParams.get('tab') || 'list';

  // Fetch latest grievance details to ensure data is up-to-date
  const { data: grievanceDetails, refetch: refetchGrievanceDetails } =
    useGrievanceDetails({
      projectUUID: projectId,
      grievanceUUID: (initialGrievance?.uuid || '') as UUID,
    });

  // Merge fetched data with initial prop (fetched data takes precedence)
  // Use type assertion since API response has more fields than GrievanceFormData
  const grievance: IProps['grievance'] = {
    ...initialGrievance,
    ...(grievanceDetails?.data as IProps['grievance']),
  };

  const [currentStatus, setCurrentStatus] = useState<string>(
    grievance?.status || 'CLOSED',
  );

  const editStatusMutation = useGrievanceEditStatus();

  useEffect(() => {
    setCurrentStatus(grievance?.status || 'CLOSED');
  }, [grievance?.status]);

  const handleEdit = () => {
    router.push(
      `/projects/aa/${projectId}/grievances/${grievance?.uuid}/edit?from=split&tab=${redirectToHomeTab}`,
    );
    closeSecondPanel();
  };

  const handleViewFull = () => {
    router.push(
      `/projects/aa/${projectId}/grievances/${grievance?.uuid}?tab=${redirectToHomeTab}`,
    );
    closeSecondPanel();
  };

  const handleStatusChange = (value: string) => {
    if (grievance?.uuid && projectId) {
      const previousStatus = currentStatus;

      setCurrentStatus(value);

      editStatusMutation.mutate(
        {
          projectUUID: projectId,
          grievancePayload: {
            uuid: grievance.uuid,
            status: value as GrievanceStatus,
          },
        },
        {
          onSuccess: () => {
            // Refetch grievance details to get updated data after status change
            if (initialGrievance?.uuid) {
              refetchGrievanceDetails();
            }
          },
          onError: () => {
            setCurrentStatus(previousStatus);
          },
        },
      );
    }
  };

  return (
    <div className="h-full border-l bg-white">
      {/* Header */}
      <div className="flex justify-between items-center py-[12px] px-[12px]">
        <div className="flex space-x-2">
          <TooltipComponent
            handleOnClick={handleEdit}
            Icon={Pencil}
            tip="Edit"
          />
          <TooltipComponent
            handleOnClick={handleViewFull}
            Icon={Expand}
            tip="Expand"
          />
        </div>
        <TooltipComponent
          handleOnClick={closeSecondPanel}
          Icon={X}
          tip="Close"
        />
      </div>

      <Separator />

      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="flex flex-col gap-[0px]">
          {/* Title and Reporter */}
          <div className="flex flex-col gap-[16px] py-[24px] px-[24px]">
            <div className="flex flex-col gap-[4px]">
              <div className="font-inter font-semibold text-[18px] leading-[100%] tracking-[-0.02em] text-[#3D3D5A]">
                <TooltipText
                  title={grievance?.title || 'N/A'}
                  content={grievance?.title || 'N/A'}
                  titleClassName="line-clamp-1 !w-auto whitespace-normal hover:cursor-pointer"
                />
              </div>
              <div className="font-inter font-normal text-[14px] leading-[24px] tracking-[0]  text-[#667085]">
                <div className="flex items-center gap-1">
                  <span>Reported By:</span>
                  <TooltipText
                    title={grievance?.reportedBy || 'N/A'}
                    content={grievance?.reportedBy || 'N/A'}
                    titleClassName="inline-block max-w-[200px] line-clamp-1 !w-auto whitespace-normal hover:cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 w-full">
              <label className="font-inter font-normal text-[14px] leading-[24px] tracking-[0] text-[#667085]">
                Status
              </label>
              <Select
                value={currentStatus}
                onValueChange={handleStatusChange}
                disabled={editStatusMutation.isPending}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {grievanceStatus.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Key Details */}
          <div className="flex flex-col gap-[8px] py-[24px] px-[24px]">
            <div className="flex justify-between">
              <span className="font-inter font-medium text-[14px] leading-[24px] tracking-[0] text-[#3D3D51]">
                Reporter Contact
              </span>
              <span className="font-inter font-normal text-[14px] leading-[24px] tracking-[0] text-right text-[#334155]">
                <TooltipText
                  side="bottom"
                  title={grievance?.reporterContact || 'N/A'}
                  content={grievance?.reporterContact || 'N/A'}
                  contentClassName="w-68"
                />
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-inter font-medium text-[14px] leading-[24px] tracking-[0] text-[#3D3D51]">
                Grievance ID
              </span>
              <span className="font-inter font-normal text-[14px] leading-[24px] tracking-[0] text-right text-[#334155]">
                <TooltipText
                  side="bottom"
                  contentClassName="w-68"
                  title={grievance?.id || 'N/A'}
                  content={grievance?.id || 'N/A'}
                />
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-inter font-medium text-[14px] leading-[24px] tracking-[0] text-[#3D3D51]">
                Grievance Type
              </span>
              <TypeChip
                type={grievance?.type || 'NON_TECHNICAL'}
                showIcon={false}
              />
            </div>

            <div className="flex justify-between">
              <span className="font-inter font-medium text-[14px] leading-[24px] tracking-[0] text-[#3D3D51]">
                Priority
              </span>
              <PriorityChip
                priority={grievance?.priority || 'MEDIUM'}
                showIcon={false}
              />
            </div>

            <div className="flex justify-between">
              <span className="font-inter font-medium text-[14px] leading-[24px] tracking-[0] text-[#3D3D51]">
                Created by
              </span>
              <span className="font-inter font-normal text-[14px] leading-[24px] tracking-[0] text-right text-[#334155]">
                <TooltipText
                  side="bottom"
                  contentClassName="w-68"
                  title={grievance?.createdByUser?.name || 'N/A'}
                  content={grievance?.createdByUser?.name || 'N/A'}
                />
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-inter font-medium text-[14px] leading-[24px] tracking-[0] text-[#3D3D51]">
                Created at
              </span>
              <span className="font-inter font-normal text-[14px] leading-[24px] tracking-[0] text-right text-[#334155]">
                {grievance?.createdAt
                  ? formatDateFull(grievance?.createdAt)
                  : 'N/A'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-inter font-medium text-[14px] leading-[24px] tracking-[0] text-[#3D3D51]">
                {grievance?.status === GrievanceStatus.CLOSED
                  ? 'Closed at'
                  : 'Updated at'}
              </span>
              <span className="font-inter font-normal text-[14px] leading-[24px] tracking-[0] text-right text-[#334155]">
                {grievance?.status === GrievanceStatus.CLOSED
                  ? grievance?.closedAt
                    ? formatDateFull(grievance?.closedAt)
                    : 'N/A'
                  : grievance?.updatedAt
                  ? formatDateFull(grievance?.updatedAt)
                  : 'N/A'}
              </span>
            </div>

            {/* Description */}
            <div className="font-inter font-medium text-[14px] leading-[24px] tracking-[0] text-[#3D3D51]">
              Description
            </div>
            <div className="font-inter font-normal text-[14px] leading-[24px] tracking-[0] text-[#334155] break-words">
              <TooltipText
                contentClassName="w-68"
                title={grievance?.description || 'N/A'}
                content={grievance?.description || 'N/A'}
                titleClassName="line-clamp-2 !w-auto whitespace-normal hover:cursor-pointer"
              />
            </div>

            {/* Tags */}
            <div className="font-inter font-medium text-[14px] leading-[24px] tracking-[0] text-[#3D3D51]">
              Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {grievance?.tags && grievance.tags.length > 0 ? (
                grievance.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  No tags assigned
                </span>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
