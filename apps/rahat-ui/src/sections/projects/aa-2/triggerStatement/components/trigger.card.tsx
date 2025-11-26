import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { capitalizeFirstLetter } from 'apps/rahat-ui/src/utils';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { toLabel, TriggerStatement } from '../utils';
import { SOURCE_CONFIG } from '../trigger.statement.schema';
type IProps = {
  projectId: string;
  triggerId: string;
  phase?: string;
  type: string;
  isTriggered: boolean;
  title: string;
  dataSource: string;
  riverBasin: string;
  createdAt: string;
  triggeredAt?: string;
  triggerType?: string;
  version?: number;
  id?: number;
  triggerStatement: TriggerStatement;
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
  createdAt,
  triggeredAt,
  triggerType,
  version,
  id,
  triggerStatement: tgSt,
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
  const handleRoute = () => {
    if (version) {
      router.push(
        `/projects/aa/${projectId}/trigger-statements/${id}?version=true&type=${version}`,
      );
    } else {
      router.push(`/projects/aa/${projectId}/trigger-statements/${triggerId}`);
    }
  };

  const sourceSubTypeLabel =
    SOURCE_CONFIG[tgSt?.source as keyof typeof SOURCE_CONFIG]?.sourceSubType;
  const unit = sourceSubTypeLabel?.match(/\((.*?)\)/)?.[1] || '';
  const formattedSourceSubType = toLabel(tgSt?.sourceSubType);

  return (
    <div
      className="p-4 rounded border shadow cursor-pointer hover:shadow-md"
      onClick={handleRoute}
    >
      <div className="flex justify-between items-center space-x-4 mb-2">
        <div className="flex items-center space-x-4">
          <Badge
            className={`font-medium ${phase && renderPhaseBadgeColor(phase)}`}
          >
            {phase ? phase : triggerType}
          </Badge>
          <Badge className="font-medium">{capitalizeFirstLetter(type)}</Badge>
          {!!version && <Badge className="font-medium">V{version}</Badge>}
        </div>
        <Badge
          className={`font-medium ${
            isTriggered ? 'bg-red-50 text-red-500' : ''
          }`}
        >
          {isTriggered ? 'Triggered' : 'Not Triggered'}
        </Badge>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className=" text-sm/6 font-medium mb-2 truncate w-52 hover:cursor-pointer">
              {title}
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            className="w-80 rounded-sm text-justify "
          >
            <p className="text-sm/6 font-medium mb-2">{title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <p className="text-muted-foreground text-sm/4 mb-1">
        {capitalizeFirstLetter(riverBasin)}{' '}
        {dataSource &&
          `. ${dataSource} ${
            dataSource !== 'GLOFAS'
              ? sourceSubTypeLabel?.split(' ').slice(0, -1)
              : sourceSubTypeLabel
          } (${formattedSourceSubType} ${tgSt?.operator} ${tgSt?.value} ${
            unit || '%'
          })`}
      </p>
      {createdAt && (
        <p className="text-muted-foreground text-sm/4 mb-1">
          Created at : {dateFormat(createdAt)}
        </p>
      )}
      {triggeredAt && (
        <p className="text-muted-foreground text-sm/4">
          Triggered at : {dateFormat(triggeredAt)}
        </p>
      )}
    </div>
  );
}
