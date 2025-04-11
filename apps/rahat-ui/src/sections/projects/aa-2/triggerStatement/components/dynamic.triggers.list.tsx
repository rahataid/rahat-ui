import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import TriggerCard from './trigger.card';

type IProps = {
  projectId: string;
  triggers: any;
};

export default function DynamicTriggersList({ projectId, triggers }: IProps) {
  return (
    <ScrollArea className="h-[calc(100vh-550px)]">
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
  );
}
