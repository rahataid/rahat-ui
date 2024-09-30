import * as React from 'react';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Info, Text, SignalHigh, Book } from 'lucide-react';
import UpdateActivityStatusDialog from './update.activity.status.dialog';

type IProps = {
  activityDetail: any;
  loading: boolean;
};

function getStatusBg(status: string) {
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
  loading,
}: IProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mt-4">
      <div className="p-4 rounded bg-card flex items-center gap-4">
        <div className="p-3 bg-secondary text-primary rounded">
          <Info size={25} />
        </div>
        <div className="w-full">
          <div className="flex justify-between items-center">
            <h1 className="font-medium">Status</h1>
            <UpdateActivityStatusDialog
              activityDetail={activityDetail}
              loading={loading}
              triggerTitle="update"
              iconStyle="mr-1 h-3 w-3"
            />
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
          <h1 className="font-medium">Responsible Station</h1>
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
    </div>
  );
}
