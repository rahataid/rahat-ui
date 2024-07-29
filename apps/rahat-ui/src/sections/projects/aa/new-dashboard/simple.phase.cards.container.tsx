import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Progress } from '@rahat-ui/shadcn/src/components/ui/progress';

type IProps = {
  phasesStats: any;
};

const renderProgressBgColor = (phase: string) => {
  if (phase === 'PREPAREDNESS') return 'bg-yellow-100';
  if (phase === 'ACTIVATION') return 'bg-red-100';
  if (phase === 'READINESS') return 'bg-green-100';
  return '';
};

const renderProgressBarColor = (phase: string) => {
  if (phase === 'PREPAREDNESS') return 'bg-yellow-500';
  if (phase === 'ACTIVATION') return 'bg-red-500';
  if (phase === 'READINESS') return 'bg-green-500';
  return '';
};

export default function SimplePhaseCardContainer({ phasesStats }: IProps) {
  const sortedPhaseStats = phasesStats?.sort((d1: any, d2: any) => {
    var c = new Date(d1?.phase?.createdAt).getTime();
    var d = new Date(d2?.phase?.createdAt).getTime();
    return c - d;
  });

  return (
    <div className="p-4 bg-card rounded-sm shadow-md">
      <div className="grid gap-2">
        {sortedPhaseStats?.map((phase: any) => {
          return (
            <div key={phase?.id} className="p-4 border rounded-sm">
              <div className="flex items-center space-x-2">
                <h1 className="font-medium">{phase?.phase?.name}</h1>
                {phase?.phase?.name !== 'PREPAREDNESS' && (
                  <Badge
                    className={
                      phase?.phase?.isActive ? 'bg-red-300' : 'bg-green-300'
                    }
                  >
                    {phase?.phase?.isActive ? 'Triggered' : 'Not Triggered'}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                {phase?.completedPercentage}% of activities completed
              </p>

              <Progress
                value={Math.floor(Number(phase?.completedPercentage))}
                className={`h-2 ${renderProgressBgColor(phase?.phase?.name)}`}
                indicatorColor={renderProgressBarColor(phase?.phase?.name)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
