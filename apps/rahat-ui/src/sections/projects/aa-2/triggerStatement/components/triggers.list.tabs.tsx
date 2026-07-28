import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import DynamicTriggersList from './dynamic.triggers.list';
import { usePhaseHistory } from '@rahat-ui/query';
import React from 'react';
import { UUID } from 'crypto';
import { useTranslations } from 'next-intl';

type IProps = {
  projectId: string;
  phaseId: string;
  triggers: Record<string, unknown>[];
  riverBasin?: string;
};

export default function TriggersListTabs({
  projectId,
  phaseId,
  triggers,
  riverBasin,
}: IProps) {
  const t = useTranslations('AA Project');
  const { data: phaseHistory } = usePhaseHistory(projectId as UUID, {
    phaseUuid: phaseId as UUID,
    phase: true,
  });

  const triggered = React.useMemo(
    () => triggers?.filter((t) => t?.isTriggered === true),
    [triggers],
  );
  const notTriggered = React.useMemo(
    () => triggers?.filter((t) => t?.isTriggered === false),
    [triggers],
  );

  return (
    <Tabs defaultValue="All">
      <TabsList className="border bg-secondary rounded mb-2">
        <TabsTrigger
          className="w-full data-[state=active]:bg-white"
          value="All"
        >
          {t('ALL')}
        </TabsTrigger>
        <TabsTrigger
          className="w-full data-[state=active]:bg-white"
          value="Not Triggered"
        >
          {t('NOT_TRIGGERED')}
        </TabsTrigger>
        <TabsTrigger
          className="w-full data-[state=active]:bg-white"
          value="Triggered"
        >
          {t('TRIGGERED')}
        </TabsTrigger>
        <TabsTrigger
          className="w-full data-[state=active]:bg-white"
          value="History"
        >
          {t('HISTORY')}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="All">
        <DynamicTriggersList
          projectId={projectId}
          triggers={triggers}
          riverBasin={riverBasin}
        />
      </TabsContent>
      <TabsContent value="Not Triggered">
        <DynamicTriggersList
          projectId={projectId}
          triggers={notTriggered}
          riverBasin={riverBasin}
        />
      </TabsContent>
      <TabsContent value="Triggered">
        <DynamicTriggersList
          projectId={projectId}
          triggers={triggered}
          riverBasin={riverBasin}
        />
      </TabsContent>
      <TabsContent value="History">
        <DynamicTriggersList projectId={projectId} history={phaseHistory} />
      </TabsContent>
    </Tabs>
  );
}
