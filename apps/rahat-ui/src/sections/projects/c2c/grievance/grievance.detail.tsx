'use client';
import { useGrievanceChangeStatus } from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { Grievance } from '@rahataid/sdk/grievance';
import { formatdbDate } from 'apps/rahat-ui/src/utils';
import { Minus, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import EditGrievance from './grievance.edit';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { UUID } from 'crypto';

type IProps = {
  details: Grievance & { uuid: UUID };
  closeSecondPanel: VoidFunction;
};

export default function GrievanceDetail({ details, closeSecondPanel }: IProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'edit'>('details');
  const changeStatus = useGrievanceChangeStatus();
  const handleTabChange = (tab: 'details' | 'edit') => {
    setActiveTab(tab);
  };

  const GrievanceStatus = [
    { key: 'New', value: 'NEW' },
    { key: 'Under Review', value: 'UNDER_REVIEW' },
    { key: 'Resolved', value: 'RESOLVED' },
    { key: 'Closed', value: 'CLOSED' },
  ];
  return (
    <>
      <div className="flex justify-between p-4 pt-5 bg-secondary border-b">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger onClick={closeSecondPanel}>
              <Minus size={20} strokeWidth={1.5} />
            </TooltipTrigger>
            <TooltipContent className="bg-secondary ">
              <p className="text-xs font-medium">Close</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical
                className="cursor-pointer"
                size={20}
                strokeWidth={1.5}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {activeTab === 'details' ? (
                <DropdownMenuItem onClick={() => handleTabChange('edit')}>
                  Edit
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => handleTabChange('details')}>
                  Details
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="p-4 bg-card flex gap-2 justify-between items-center flex-wrap">
        <div className="flex items-center gap-2">
          <Image
            className="rounded-full"
            src="/profile.png"
            alt="cat"
            height={80}
            width={80}
          />
          <div>
            <div className="flex flex-col items-start justify-start gap-2 mb-1 w-full">
              <Badge>{details?.status}</Badge>
              <h1 className="font-semibold text-xl">{details?.title}</h1>
            </div>
          </div>
        </div>
        <div>
          <Select
            onValueChange={(value) => {
              changeStatus.mutateAsync({
                uuid: details.uuid,
                data: { status: value },
              });
            }}
            defaultValue={''}
          >
            <SelectTrigger className="text-muted-foreground">
              <SelectValue placeholder="Change status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {GrievanceStatus?.map((status) => {
                  return (
                    <SelectItem value={status.value}>{status.key}</SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Separator className="my-2" />
      {activeTab === 'details' && (
        <>
          <Card className="shadow rounded m-2">
            <CardContent className="pt-6">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <p className="font-light text-base">
                    {details?.title || 'N/A'}
                  </p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Title
                  </p>
                </div>
                <div>
                  <p className="font-light text-base">
                    {details?.type || 'N/A'}
                  </p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Type
                  </p>
                </div>
                <div>
                  <p className="font-light text-base">
                    {details?.reportedBy || 'N/A'}
                  </p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Reported By
                  </p>
                </div>
                <div className="text-left">
                  <p className="font-light text-base">
                    {details?.createdAt
                      ? formatdbDate(details?.createdAt)
                      : 'N/A'}
                  </p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Created On
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="text-left">
                  <p className="font-light text-base">
                    {details?.description || 'N/A'}
                  </p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Description
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
      {activeTab === 'edit' && <EditGrievance details={details} />}
    </>
  );
}
