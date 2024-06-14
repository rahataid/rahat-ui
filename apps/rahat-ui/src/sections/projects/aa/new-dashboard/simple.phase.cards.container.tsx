import { Progress } from '@rahat-ui/shadcn/src/components/ui/progress';

export default function SimplePhaseCardContainer() {
  return (
    <div className="p-4 bg-card rounded-sm">
      <div className="grid gap-2">
        <div className="p-4 border rounded-sm">
          <h1 className="font-medium">Preparedness</h1>
          <p className="text-muted-foreground text-sm mb-4">
            45% of preparations completed
          </p>
          <Progress
            value={45}
            className="bg-yellow-100 h-2"
            indicatorColor="bg-yellow-500"
          />
        </div>
        <div className="p-4 border rounded-sm">
          <h1 className="font-medium">Activation</h1>
          <p className="text-muted-foreground text-sm mb-4">
            30% of preparations completed
          </p>
          <Progress
            value={30}
            className="bg-green-100 h-2"
            indicatorColor="bg-green-500"
          />
        </div>
        <div className="p-4 border rounded-sm">
          <h1 className="font-medium">Readiness</h1>
          <p className="text-muted-foreground text-sm mb-4">
            25% of preparations completed
          </p>
          <Progress
            value={25}
            className="bg-red-100 h-2"
            indicatorColor="bg-red-500"
          />
        </div>
      </div>
    </div>
  );
}
