'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
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
      onClick={() =>
        router.push(
          `/projects/aa/${ProjectId}/activities/${id}?from="mainPage"`,
        )
      }
    >
      <CardContent className="space-y-2 p-2">
        <div className="flex items-center justify-between ">
          <Badge className={getStatusBg(status)}>
            {status
              .toLowerCase()
              .split('_')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </Badge>
          <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER]} hasContent={false}>
            <div
              className="flex items-center gap-2 text-blue-500 text-xs hover:cursor-pointer hover:rounded-sm hover:bg-gray-50 hover:p-1 hover:text-sm "
              onClick={(e) => {
                e.stopPropagation();
                onUpdateStatus();
              }}
            >
              Update Status <RefreshCw className="w-4 h-4" />
            </div>
          </RoleAuth>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <h3 className="text-sm font-medium text-gray-900 truncate w-52  xxl:w-96 cursor-default">
                {title}
              </h3>
            </TooltipTrigger>
            <TooltipContent className="z-50" side="top">
              <p>{title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <p className="text-sm text-gray-500">
          {location ?? ''} • {leadTime}
        </p>
      </CardContent>
      <CardFooter className="p-2 pt-0">
        <div className="flex items-center gap-2 p-0">
          <User className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-500">{responsibility ?? ''}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
