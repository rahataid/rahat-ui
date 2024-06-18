import * as React from 'react';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { Info, Text, SignalHigh, Gauge, Pencil, Book } from 'lucide-react';
import { useUpdateActivityStatus } from '@rahat-ui/query';
import { UUID } from 'crypto';

type IProps = {
  activityDetail: any;
  projectId: UUID;
  activityId: UUID;
};

const statusList = ['NOT_STARTED', 'WORK_IN_PROGRESS', 'COMPLETED', 'DELAYED'];

function getStatusBg(status: string){
  if (status === 'NOT_STARTED') {
    return 'bg-gray-200';
  }

  if (status === 'WORK_IN_PROGRESS') {
    return 'bg-orange-200';
  }

  if (status === 'COMPLETED') {
    return 'bg-green-200';
  }

  if (status === 'DELAYED') {
    return 'bg-red-200';
  }

  return '';
}

export default function ActivityDetailCards({
  activityDetail,
  projectId,
  activityId,
}: IProps) {
  const updateStatus = useUpdateActivityStatus();

  const [status, setStatus] = React.useState(activityDetail?.status);

  const updateActivityStatus = async (statusValue: string) => {
    try {
      await updateStatus.mutateAsync({
        projectUUID: projectId,
        activityStatusPayload: {
          uuid: activityId,
          status: statusValue,
        },
      });
    } catch (e) {
      console.error('Update Status Error::', e);
    }
  };

  const handleValueChange = (value: string) => {
    setStatus(value);
    updateActivityStatus(value);
  };

  const renderStatusDropdown = (
    <div className="ml-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'link'} className="h-6">
            <Pencil className="w-3 h-3 mr-1" /> update
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup
            value={status}
            onValueChange={handleValueChange}
          >
            {statusList.map((status) => (
              <DropdownMenuRadioItem value={status}>
                {status}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <div className="grid grid-cols-4 gap-4 mt-4">
      <div className="p-4 rounded bg-card flex items-center gap-4">
        <div className="p-3 bg-secondary text-primary rounded">
          <Info size={25} />
        </div>
        <div className="w-full">
          <div className="flex justify-between items-center">
            <h1 className="font-medium">Status</h1>
            {renderStatusDropdown}
          </div>
          <Badge className={`${getStatusBg(activityDetail?.status)}`}>
            {activityDetail?.status}
          </Badge>
        </div>
      </div>
      <div className="p-4 rounded bg-card flex items-center gap-4">
        <div className="p-3 bg-secondary text-primary rounded">
          <Text size={25} />
        </div>
        <div>
          <h1 className="font-medium">Source</h1>
          <p className="text-xl text-primary font-semibold">
            {activityDetail?.source}
          </p>
        </div>
      </div>
      <div className="p-4 rounded bg-card flex items-center gap-4">
        <div className="p-3 bg-secondary text-primary rounded">
          <SignalHigh size={25} />
        </div>
        <div>
          <h1 className="font-medium">Phase</h1>
          <p className="text-xl text-primary font-semibold">
            {activityDetail?.phase?.name}
          </p>
        </div>
      </div>
      <div className="p-4 rounded bg-card flex items-center gap-4">
        <div className="p-3 bg-secondary text-primary rounded">
          <Book size={25} />
        </div>
        <div>
          <h1 className="font-medium">Activity Type</h1>
          <p className="text-xl text-primary font-semibold">
            {activityDetail?.isAutomated ? 'Automated' : 'Manual'}
          </p>
        </div>
      </div>
      {/* <div className="p-4 rounded bg-card flex items-center gap-4">
        <div className="p-3 bg-secondary text-primary rounded">
          <Gauge size={25} />
        </div>
        <div>
          <h1 className="font-medium">Lead Time</h1>
          <p className="text-xl text-primary font-semibold">
            {activityDetail?.leadTime}
          </p>
        </div>
      </div> */}
    </div>
  );
}
