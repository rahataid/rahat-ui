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
      <ScrollArea className="h-[calc(100vh-500px)]">
        <div className="flex flex-col space-y-3 pr-2.5">
          {triggers?.map((t: any) => (
            <TriggerCard
              projectId={projectId}
              triggerId={t?.repeatKey}
              phase={t?.phase?.name || 'N/A'}
              type={t?.triggerStatement?.type || 'N/A'}
              isTriggered={t?.isTriggered}
              title={t?.title || 'N/A'}
              dataSource={t?.phase?.source?.source || 'N/A'}
              riverBasin={t?.phase?.source?.riverBasin || 'N/A'}
              time={new Date(t?.createdAt)?.toLocaleString()}
            />
          ))}
          {/* <TriggerCard
            projectId={projectId}
            triggerId="111"
            phase="Readiness"
            type="Manual"
            isTriggered={false}
            title="Ensure the Distribution of Emergency Response Kits to All Identified High-Risk and Vulnerable Households in the Affected Areas"
            dataSource="GLOFAS"
            riverBasin="Karnali at Chisapani"
            time={new Date().toLocaleString()}
          />
          <TriggerCard
            projectId={projectId}
            triggerId="111"
            phase="Activation"
            type="Automatic"
            isTriggered={true}
            title="Ensure the Distribution of Emergency Response Kits to All Identified High-Risk and Vulnerable Households in the Affected Areas"
            dataSource="GLOFAS"
            riverBasin="Karnali at Chisapani"
            time={new Date().toLocaleString()}
          /> */}
        </div>
      </ScrollArea>
    </div>
  );
}
