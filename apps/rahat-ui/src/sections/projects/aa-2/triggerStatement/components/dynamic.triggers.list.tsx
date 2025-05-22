import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import TriggerCard from './trigger.card';

type IProps = {
  projectId: string;
  triggers?: Array<any>;
  history?: Array<any>;
};

export default function DynamicTriggersList({
  projectId,
  triggers,
  history,
}: IProps) {
  const allTriggers = triggers?.length
    ? triggers
    : history?.flatMap((group) =>
        group.triggers.map((trigger: any) => ({
          ...trigger,
          version: group.version,
        })),
      ) || [];

  return (
    <ScrollArea className="h-[calc(100vh-550px)] min-h-[300px]">
      <div className="flex flex-col space-y-3 pr-2.5">
        {allTriggers?.length ? (
          allTriggers?.map((t: any) => (
            <TriggerCard
              key={t?.uuid}
              projectId={projectId}
              triggerId={t?.repeatKey}
              type={t?.source === 'MANUAL' ? 'Manual' : 'Automated'}
              isTriggered={t?.isTriggered}
              title={t?.title || 'N/A'}
              dataSource={t?.source || 'N/A'}
              riverBasin={t?.phase?.source?.riverBasin || 'N/A'}
              time={new Date(t?.createdAt)?.toLocaleString()}
              triggerType={t?.isMandatory ? 'Mandatory' : 'Optional'}
              version={t?.version}
            />
          ))
        ) : (
          <p className="text-sm font-medium text-muted-foreground">
            No triggers found
          </p>
        )}
      </div>
    </ScrollArea>
  );
}
