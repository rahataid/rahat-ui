import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import DocumentCard from '../../../components/document.card';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';
import { useTranslations } from 'next-intl';

export default function ActivityDetailCard({ activityDetail }: any) {
  const t = useTranslations('AA Project');
  const tg = useTranslations('GLOBAL');
  const formatDate = useDateFormat();
  const detailData = [
    {
      title: t('CATEGORY'),
      content: <p>{activityDetail?.category?.name}</p>,
    },
    {
      title: t('RESPONSIBILITY'),
      content: <p>{activityDetail?.responsibility}</p>,
    },
    {
      title: t('DESCRIPTION'),
      content: <p>{activityDetail?.description || tg('NA')} </p>,
    },
    {
      title: t('LEAD_TIME'),
      content: <p>{activityDetail?.leadTime || tg('NA')} </p>,
    },
    {
      title: t('COMPLETED_BY'),
      content: <p>{activityDetail?.completedBy || tg('NA')}</p>,
    },
    {
      title: t('COMPLETED_AT'),
      content: (
        <p>{activityDetail?.completedAt ? formatDate(activityDetail?.completedAt) : tg('NA')}</p>
      ),
    },
  ];

  return (
    <div className="bg-card p-4 rounded">
      <h1 className="font-semibold text-lg">{t('ACTIVITY_DETAILS')}</h1>
      <ScrollArea className="h-[calc(100vh-310px)]">
        <div>
          {detailData.map((item) => (
            <div key={item.title} className="mt-4">
              <h1 className="text-muted-foreground text-sm">{item.title}</h1>
              {item.content}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <h1 className="text-muted-foreground text-sm">{t('DOCUMENTS')}</h1>
          {activityDetail?.activityDocuments?.length ? (
            <div className="grid gap-2 mt-2">
              {activityDetail?.activityDocuments?.map(
                (d: any, index: number) => (
                  <DocumentCard
                    key={index}
                    name={d.fileName}
                    path={d.mediaURL}
                  />
                ),
              )}
            </div>
          ) : (
            '-'
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
