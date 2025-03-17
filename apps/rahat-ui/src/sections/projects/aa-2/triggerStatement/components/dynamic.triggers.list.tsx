import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import TriggerCard from './trigger.card';

export default function DynamicTriggersList() {
  return (
    <ScrollArea className="h-[calc(100vh-550px)]">
      <div className="flex flex-col space-y-3 pr-2.5">
        <TriggerCard
          phase="Activation"
          type="Automatic"
          isTriggered={true}
          title="Ensure the Distribution of Emergency Response Kits to All Identified High-Risk and Vulnerable Households in the Affected Areas"
          dataSource="GLOFAS"
          riverBasin="Karnali at Chisapani"
          time={new Date().toLocaleString()}
        />
        <TriggerCard
          phase="Readiness"
          type="Manual"
          isTriggered={false}
          title="Ensure the Distribution of Emergency Response Kits to All Identified High-Risk and Vulnerable Households in the Affected Areas"
          dataSource="GLOFAS"
          riverBasin="Karnali at Chisapani"
          time={new Date().toLocaleString()}
        />
        <TriggerCard
          phase="Activation"
          type="Automatic"
          isTriggered={true}
          title="Ensure the Distribution of Emergency Response Kits to All Identified High-Risk and Vulnerable Households in the Affected Areas"
          dataSource="GLOFAS"
          riverBasin="Karnali at Chisapani"
          time={new Date().toLocaleString()}
        />
      </div>
    </ScrollArea>
  );
}
