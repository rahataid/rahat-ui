import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

type IProps = {
  phase: string;
  type: string;
  isTriggered: boolean;
  title: string;
  dataSource: string;
  riverBasin: string;
  time: string;
};

export default function TriggerCard({
  phase,
  type,
  isTriggered,
  title,
  dataSource,
  riverBasin,
  time,
}: IProps) {
  const renderBadgeColor = (phase: string) => {
    switch (phase) {
      case 'Readiness':
        return 'bg-green-50 text-green-500';
      case 'Activation':
        return 'bg-red-50 text-red-500';
      default:
        return 'bg-gray-50 text-gray-500';
    }
  };
  return (
    <div className="p-4 rounded-md border shadow">
      <div className="flex justify-between items-center space-x-4 mb-2">
        <div className="flex items-center space-x-4">
          <Badge className={`font-medium ${renderBadgeColor(phase)}`}>
            {phase}
          </Badge>
          <Badge className="font-medium">{type}</Badge>
        </div>
        <Badge
          className={`font-medium ${
            isTriggered ? 'bg-red-50 text-red-500' : ''
          }`}
        >
          {isTriggered ? 'Triggered' : 'Not Triggered'}
        </Badge>
      </div>
      <p className="text-sm/6 font-medium mb-2">{title}</p>
      <p className="text-muted-foreground text-sm/4 mb-1">
        {`${dataSource} . ${riverBasin}`}
      </p>
      <p className="text-muted-foreground text-sm/4">{time}</p>
    </div>
  );
}
