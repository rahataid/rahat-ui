import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Heading, NoResult } from 'apps/rahat-ui/src/common';
import TriggerCard from './trigger.card';
import { useTranslations } from 'next-intl';

type IProps = {
  projectId: string;
  triggers: any;
};

export default function TriggersListCard({ projectId, triggers }: IProps) {
  const t = useTranslations('AA Project');
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
            triggers?.map((t: any) => (
              <TriggerCard
                key={projectId}
                projectId={projectId}
                triggerId={t?.uuid}
                phase={t?.phase?.name || 'N/A'}
                type={t?.source === 'MANUAL' ? 'Manual' : 'Automated'}
                isTriggered={t?.isTriggered}
                title={t?.title || 'N/A'}
                dataSource={t?.source === 'MANUAL' ? '' : t?.source}
                riverBasin={t?.phase?.source?.riverBasin || 'N/A'}
                createdAt={t?.createdAt}
                triggeredAt={t?.triggeredAt}
                triggerStatement={t?.triggerStatement}
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
