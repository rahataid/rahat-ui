'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { cn } from '@rahat-ui/shadcn/src';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { getStatusBg } from 'apps/rahat-ui/src/utils/get-status-bg';
import { RefreshCw, User } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import TooltipChildren from 'apps/rahat-ui/src/components/tooltip.children';

interface PhaseCardProps {
  id: string;
  status: string;
  title: string;
  location: string;
  leadTime: string;
  responsibility: string;
  onUpdateStatus: () => void;
  className?: string;
}

export default function PhaseCard({
  status,
  id,
  title,
  location,
  leadTime,
  responsibility,
  onUpdateStatus,
  className,
}: PhaseCardProps) {
  const router = useRouter();
  const { id: ProjectId } = useParams();

  // const getStatusBg = (status: string) => {
  //   if (status === 'NOT_STARTED') {
  //     return 'bg-red-200';
  //   }

  //   if (status === 'WORK_IN_PROGRESS') {
  //     return 'bg-orange-200';
  //   }

  //   if (status === 'COMPLETED') {
  //     return 'bg-green-200';
  //   }

  //   if (status === 'DELAYED') {
  //     return 'bg-gray-200';
  //   }

  //   return '';
  // };
  return (
    <Card
      className={(cn(' border-gray-300 shadow-sm p-4 rounded-xl '), className)}
      onClick={() => router.push(`/projects/aa/${ProjectId}/activities/${id}`)}
    >
      <CardContent className="space-y-2 p-2">
        <div className="flex items-center justify-between ">
          <TooltipChildren
            tip={`Activity Status: ${status
              .toLowerCase()
              .split('_')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}`}
          >
            <Badge className={getStatusBg(status)}>
              {status
                .toLowerCase()
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </Badge>
          </TooltipChildren>
          <RoleAuth
            roles={[AARoles.ADMIN, AARoles.MANAGER, AARoles.Municipality]}
            hasContent={false}
          >
            <TooltipChildren tip="Update Activity Status">
              <div
                className="flex items-center gap-2 text-blue-500 text-xs hover:cursor-pointer hover:rounded-sm hover:bg-gray-50 hover:p-1 hover:text-sm "
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateStatus();
                }}
              >
                Update Status <RefreshCw className="w-4 h-4" />
              </div>
            </TooltipChildren>
          </RoleAuth>
        </div>
        <TooltipChildren tip={`Activity Title: ${title}`}>
          <h3 className="text-sm font-medium text-gray-900 truncate w-[320px]">
            {title}
          </h3>
        </TooltipChildren>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <TooltipChildren tip={`Responsible Station: ${location ?? ''}`}>
            <span>{location ?? ''}</span>
          </TooltipChildren>
          <span>•</span>
          <TooltipChildren tip={`Lead Time: ${leadTime}`}>
            <span>{leadTime}</span>
          </TooltipChildren>
        </div>
      </CardContent>
      <CardFooter className="p-2 pt-0">
        <TooltipChildren tip={`Responsibility: ${responsibility ?? ''}`}>
          <div className="flex items-center gap-2 p-0">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">
              {responsibility ?? ''}
            </span>
          </div>
        </TooltipChildren>
      </CardFooter>
    </Card>
  );
}
