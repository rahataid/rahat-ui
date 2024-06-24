import { Progress } from '@rahat-ui/shadcn/src/components/ui/progress';

type IProps = {
  phasesStats: any;
};

export default function SimplePhaseCardContainer({ phasesStats }: IProps) {
  return (
    <div className="p-4 bg-card rounded-sm shadow-md">
      <div className="grid gap-2">
        {phasesStats?.map((phase: any) => (
          <div key={phase?.id} className="p-4 border rounded-sm">
            <h1 className="font-medium">{phase?.phase?.name}</h1>
            <p className="text-muted-foreground text-sm mb-4">
              {phase?.completedPercentage}% of preparations completed
            </p>
            <Progress
              value={phase?.totalCompletedActivities}
              className="bg-yellow-100 h-2"
              indicatorColor="bg-yellow-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
