import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Heading } from 'apps/rahat-ui/src/common';
import TriggerCard from './trigger.card';

type IProps = {
  projectId: string;
  triggers: any;
};

export default function TriggersListCard({ projectId, triggers }: IProps) {
  return (
    <div className="p-4 rounded border shadow-md">
      <Heading
        title="Recent Triggers"
        titleStyle="text-xl/6"
        description="List of all recently activated triggers"
      />
      <ScrollArea className="h-[calc(100vh-500px)] min-h-[440px]">
        <div className="flex flex-col space-y-3 pr-2.5">
          {triggers?.length ? (
            triggers?.map((t: any) => (
              <TriggerCard
                projectId={projectId}
                triggerId={t?.repeatKey}
                phase={t?.phase?.name || 'N/A'}
                type={t?.source === 'MANUAL' ? 'Manual' : 'Automated'}
                isTriggered={t?.isTriggered}
                title={t?.title || 'N/A'}
                dataSource={t?.source || 'N/A'}
                riverBasin={t?.phase?.source?.riverBasin || 'N/A'}
                time={new Date(t?.createdAt)?.toLocaleString()}
              />
            ))
          ) : (
            <p className="text-sm font-medium text-muted-foreground">
              No triggers found
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
