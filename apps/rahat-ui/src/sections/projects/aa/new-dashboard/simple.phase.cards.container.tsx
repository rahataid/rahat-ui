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
  return (
    <div className="p-4 bg-card rounded-sm shadow-md">
      <div className="grid gap-2">
        {phasesStats?.map((phase: any) => (
          <div key={phase?.id} className="p-4 border rounded-sm">
            <h1 className="font-medium">{phase?.phase?.name} <span><Badge>{phase?.phase?.isActive ? 'Active' : 'Inactive'}</Badge></span></h1>
            <p className="text-muted-foreground text-sm mb-4">
              {phase?.completedPercentage}% of preparations completed
            </p>
            <Progress
              value={phase?.totalCompletedActivities}
              className={`h-2 ${renderProgressBgColor(phase?.phase?.name)}`}
              indicatorColor={renderProgressBarColor(phase?.phase?.name)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
