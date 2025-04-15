import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { capitalizeFirstLetter } from 'apps/rahat-ui/src/utils';
import { useRouter } from 'next/navigation';

type IProps = {
  projectId: string;
  triggerId: string;
  phase?: string;
  type: string;
  isTriggered: boolean;
  title: string;
  dataSource: string;
  riverBasin: string;
  time: string;
  triggerType?: string;
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
  triggerType,
}: IProps) {
  const router = useRouter();
  const renderPhaseBadgeColor = (phase: string) => {
    switch (phase) {
      case 'READINESS':
        return 'bg-yellow-50 text-yellow-500';
      case 'ACTIVATION':
        return 'bg-red-50 text-red-500';
      default:
        return 'bg-green-50 text-green-500';
    }
  };
  return (
    <div
      className="p-4 rounded border shadow cursor-pointer hover:shadow-md"
      onClick={() => {
        router.push(
          `/projects/aa/${projectId}/trigger-statements/${triggerId}`,
        );
      }}
    >
      <div className="flex justify-between items-center space-x-4 mb-2">
        <div className="flex items-center space-x-4">
          <Badge
            className={`font-medium ${phase && renderPhaseBadgeColor(phase)}`}
          >
            {phase ? phase : triggerType}
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
