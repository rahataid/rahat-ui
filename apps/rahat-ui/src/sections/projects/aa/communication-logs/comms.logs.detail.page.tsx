import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Component,
  Download,
  LucideIcon,
  MessageSquareMore,
  Timer,
  UserRound,
  UsersRound,
} from 'lucide-react';
import CommsLogsTable from './comms.logs.table';

type IHeadCardProps = {
  title: string;
  icon: LucideIcon;
  content: string;
};

export default function CommsLogsDetailPage() {
  const headCardFields = [
    {
      title: 'Total Audience',
      icon: UsersRound,
      content: 'N/A',
    },
    {
      title: 'Time Stamp',
      icon: Timer,
      content: 'N/A',
    },
    {
      title: 'User Stamp',
      icon: Timer,
      content: 'N/A',
    },
    {
      title: 'Group Type',
      icon: Component,
      content: 'N/A',
    },
  ];

  return (
    <div className="p-4 h-[calc(100vh-65px)] bg-secondary">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-semibold text-xl">Communication Details</h1>
        <Button type="button">
          <Download className="mr-2" size={16} strokeWidth={2} />
          <span className="font-normal">Failed Exports</span>
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {headCardFields?.map((d: IHeadCardProps) => {
          const Icon = d?.icon;
          return (
            <div className="bg-card p-4 rounded-sm border">
              <div className="flex justify-between mb-2">
                <h1 className="font-medium text-sm">{d?.title}</h1>
                <Icon
                  className="text-muted-foreground"
                  size={20}
                  strokeWidth={1.5}
                />
              </div>
              {d?.title === 'Group Type' ? (
                <Badge>{d?.content}</Badge>
              ) : (
                <p className="text-primary font-semibold text-xl">
                  {d?.content}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-2 p-4 border border-primary rounded-sm">
        <div className="flex justify-between space-x-8">
          <div className="flex space-x-4">
            <div className="h-10 w-10 rounded-full border border-muted-foreground grid place-items-center">
              <MessageSquareMore
                className="text-muted-foreground"
                size={20}
                strokeWidth={1.8}
              />
            </div>
            <div>
              <p className="text-sm font-medium">Message</p>
              <p className="text-muted-foreground text-sm">SMS</p>
            </div>
          </div>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ab placeat
            ducimus nulla, inventore earum esse architecto. Molestias esse non
            corrupti possimus rerum doloribus, quis adipisci natus vitae numquam
            architecto maxime reiciendis. Animi sit dolor recusandae?
          </p>
        </div>
      </div>

      <CommsLogsTable />
    </div>
  );
}
