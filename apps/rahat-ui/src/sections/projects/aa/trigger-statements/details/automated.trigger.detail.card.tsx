import { useTranslations } from 'next-intl';

export default function AutomatedTriggerDetailCard({ triggerDetail }: any) {
  const t = useTranslations('AA_PROJECT');
  const triggerDetailData = [
    {
      title: t('RIVER_BASIN'),
      content: <p>{triggerDetail?.location}</p>,
    },
    {
      title: t('MINIMUM_LEAD_TIME'),
      content: (
        <p>{`${triggerDetail?.triggerStatement?.minLeadTimeDays} days`}</p>
      ),
    },
    {
      title: t('MAXIMUM_LEAD_TIME'),
      content: (
        <p>{`${triggerDetail?.triggerStatement?.maxLeadTimeDays} days`}</p>
      ),
    },
    {
      title: t('TRIGGER_TYPE'),
      content: (
        <p>
          {triggerDetail?.dataSource === 'MANUAL'
            ? t('MANUAL_TRIGGER')
            : t('AUTOMATED_TRIGGER')}
        </p>
      ),
    },
  ];

  return (
    <div className="bg-card p-4 rounded">
      <h1 className="font-semibold text-lg">{t('TRIGGER_DETAILS')}</h1>
      <div>
        {triggerDetailData.map((item) => (
          <div key={item.title} className="mt-4">
            <h1 className="text-muted-foreground text-sm">{item.title}</h1>
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
