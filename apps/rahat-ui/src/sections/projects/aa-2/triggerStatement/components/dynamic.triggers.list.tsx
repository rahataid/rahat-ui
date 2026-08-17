import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import TriggerCard from './trigger.card';
import { NoResult } from 'apps/rahat-ui/src/common';
import { useTranslations } from 'next-intl';

type IProps = {
  projectId: string;
  triggers?: Array<any>;
  history?: Array<any>;
  riverBasin?: string;
};

export default function DynamicTriggersList({
  projectId,
  triggers,
  history,
  riverBasin,
}: IProps) {
  const t = useTranslations('AA_PROJECT');
  // `t` is shadowed by the map item below, so keep a stable alias.
  const tr = t;
  const allTriggers = triggers?.length
    ? triggers
    : history?.flatMap((group) =>
        group.triggers.map((trigger: any) => ({
          ...trigger,
          version: group.version,
        })),
      ) || [];

  return (
    <ScrollArea className="h-[calc(100vh-360px)] min-h-[300px]">
      <div className="flex flex-col space-y-3 pr-2.5">
        {allTriggers?.length ? (
          allTriggers?.map((t: any) => (
            <TriggerCard
              id={t?.id}
              key={t?.uuid}
              projectId={projectId}
              triggerId={t?.uuid}
              type={t?.source === 'MANUAL' ? tr('MANUAL') : tr('AUTOMATED')}
              isTriggered={t?.isTriggered}
              title={t?.title || 'N/A'}
              dataSource={t?.source === 'MANUAL' ? '' : t?.source}
              riverBasin={riverBasin || t?.phase.riverBasin}
              createdAt={t?.createdAt}
              triggeredAt={t?.triggeredAt}
              triggerType={t?.isMandatory ? tr('MANDATORY') : tr('OPTIONAL')}
              version={t?.version}
              triggerStatement={t?.triggerStatement}
              leadTime={t?.leadTime}
            />
          ))
        ) : (
          <NoResult message={t('NO_TRIGGER_AVAILABLE')} />
        )}
      </div>
    </ScrollArea>
  );
}
