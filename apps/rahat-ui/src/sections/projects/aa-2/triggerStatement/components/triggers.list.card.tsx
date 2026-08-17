import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Heading, NoResult } from 'apps/rahat-ui/src/common';
import TriggerCard from './trigger.card';
import { useTranslations } from 'next-intl';

type IProps = {
  projectId: string;
  triggers: any;
};

export default function TriggersListCard({ projectId, triggers }: IProps) {
  const t = useTranslations('AA_PROJECT');
  return (
    <div className="p-4 rounded-xl border shadow-md">
      <Heading
        title={t('RECENT_TRIGGERS')}
        titleStyle="text-xl/6"
        description={t('LIST_OF_ALL_RECENTLY_ACTIVATED_TRIGGERS')}
      />
      <ScrollArea className="h-[calc(100vh-260px)] min-h-[440px]">
        <div className="flex flex-col space-y-3 pr-2.5">
          {triggers?.length ? (
            triggers?.map((trigger: any) => (
              <TriggerCard
                key={projectId}
                projectId={projectId}
                triggerId={trigger?.uuid}
                phase={trigger?.phase?.name || t('N_A')}
                type={trigger?.source === 'MANUAL' ? t('MANUAL') : t('AUTOMATED')}
                isTriggered={trigger?.isTriggered}
                title={trigger?.title || t('N_A')}
                dataSource={trigger?.source === 'MANUAL' ? '' : trigger?.source}
                riverBasin={trigger?.phase?.source?.riverBasin || t('N_A')}
                createdAt={trigger?.createdAt}
                triggeredAt={trigger?.triggeredAt}
                triggerStatement={trigger?.triggerStatement}
                leadTime={t?.leadTime}
              />
            ))
          ) : (
            <NoResult message={t('NO_RECENT_TRIGGERS')} />
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
