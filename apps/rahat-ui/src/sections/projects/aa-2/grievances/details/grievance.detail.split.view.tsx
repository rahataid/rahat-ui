'use client';

import { useGrievanceEditStatus } from '@rahat-ui/query';
import { GrievanceStatus } from '@rahat-ui/query/lib/grievance/types/grievance';
import { Button } from '@rahat-ui/shadcn/components/button';
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
import { Expand, X } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { PriorityChip, TypeChip } from '../components';

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
  };
  closeSecondPanel: VoidFunction;
};

export default function GrievanceDetailSplitView({
  grievance,
  closeSecondPanel,
}: IProps) {
  const router = useRouter();
  const { id: projectId } = useParams() as { id: UUID };
  const searchParams = useSearchParams();
  const redirectToHomeTab = searchParams.get('tab') || 'list';
  console.log('split view redirectToHomeTab', redirectToHomeTab);

  const [currentStatus, setCurrentStatus] = useState<string>(
    grievance?.status || 'CLOSED',
  );

  const editStatusMutation = useGrievanceEditStatus();

  useEffect(() => {
    setCurrentStatus(grievance?.status || 'CLOSED');
  }, [grievance?.status]);

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
        <Button variant="ghost" size="sm" onClick={handleViewFull}>
          <Expand className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="sm" onClick={closeSecondPanel}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      <Separator />

      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="flex flex-col gap-[0px]">
          {/* Title and Reporter */}
          <div className="flex flex-col gap-[16px] py-[24px] px-[24px]">
            <div className="flex flex-col gap-[4px]">
              <div className="font-inter font-semibold text-[18px] leading-[100%] tracking-[-0.02em] text-[#3D3D5A]">
                {grievance?.title || 'Title demo goes here'}
              </div>
              <div className="font-inter font-normal text-[14px] leading-[24px] tracking-[0]  text-[#667085]">
                Reported By: {grievance?.reportedBy || 'Tiana Lubin'}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <label className="font-inter font-normal text-[14px] leading-[24px] tracking-[0] text-[#667085]">
                Status
              </label>
              <Select
                value={currentStatus}
                onValueChange={handleStatusChange}
                disabled={editStatusMutation.isPending}
              >
                <SelectTrigger className="w-32">
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
                {grievance?.reporterContact || 'N/A'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-inter font-medium text-[14px] leading-[24px] tracking-[0] text-[#3D3D51]">
                Grievance ID
              </span>
              <span className="font-inter font-normal text-[14px] leading-[24px] tracking-[0] text-right text-[#334155]">
                {grievance?.id || 'N/A'}
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
                Aadarsha Lamichhane
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
                Closed at
              </span>
              <span className="font-inter font-normal text-[14px] leading-[24px] tracking-[0] text-right text-[#334155]">
                {grievance?.updatedAt
                  ? formatDateFull(grievance?.updatedAt)
                  : 'N/A'}
              </span>
            </div>

            {/* Description */}
            <div className="font-inter font-medium text-[14px] leading-[24px] tracking-[0] text-[#3D3D51]">
              Description
            </div>
            <div className="font-inter font-normal text-[14px] leading-[24px] tracking-[0] text-[#334155]">
              {grievance?.description ||
                'This grievance requires attention and proper resolution. Please review the details and take appropriate action based on the type of and severity of the issue reported.'}
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
