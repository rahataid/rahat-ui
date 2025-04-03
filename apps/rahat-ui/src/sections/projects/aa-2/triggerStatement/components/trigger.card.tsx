import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useRouter } from 'next/navigation';

type IProps = {
  projectId: string;
  triggerId: string;
  phase: string;
  type: string;
  isTriggered: boolean;
  title: string;
  dataSource: string;
  riverBasin: string;
  time: string;
};

export default function TriggerCard({
  projectId,
  triggerId,
  phase,
  type,
  isTriggered,
  title,
  dataSource,
  riverBasin,
  time,
}: IProps) {
  const router = useRouter();
  const renderBadgeColor = (phase: string) => {
    switch (phase) {
      case 'READINESS':
        return 'bg-green-50 text-green-500';
      case 'ACTIVATION':
        return 'bg-red-50 text-red-500';
      default:
        return 'bg-gray-50 text-gray-500';
    }
  };
  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  return (
    <div
      className="p-4 rounded border shadow cursor-pointer"
      onClick={() => {
        router.push(
          `/projects/aa/${projectId}/trigger-statements/${triggerId}`,
        );
      }}
    >
      <div className="flex justify-between items-center space-x-4 mb-2">
        <div className="flex items-center space-x-4">
          <Badge className={`font-medium ${renderBadgeColor(phase)}`}>
            {phase}
          </Badge>
          <Badge className="font-medium">{capitalizeFirstLetter(type)}</Badge>
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
        {`${dataSource} . ${capitalizeFirstLetter(riverBasin)}`}
      </p>
      <p className="text-muted-foreground text-sm/4">{time}</p>
    </div>
  );
}
