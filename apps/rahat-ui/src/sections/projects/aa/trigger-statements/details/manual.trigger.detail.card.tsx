import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { useTranslations } from 'next-intl';

type IProps = {
  status: boolean;
  notes: string;
  phase: string;
  triggeredAt: string;
  triggeredBy: string;
};

export default function ManualTriggerDetailCard({
  status,
  notes,
  phase,
  triggeredAt,
  triggeredBy
}: IProps) {
  const t = useTranslations('AA_PROJECT');

  const formatDate = useDateFormat();

  return (
    <div className="bg-card rounded p-4">
      <h1 className="font-medium mb-4">{t('TRIGGER_DETAILS')}</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{t('STATUS')}</p>
          <Badge
            className={
              status ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
            }
          >
            {status ? t('TRIGGERED') : t('NOT_TRIGGERED')}
          </Badge>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{t('TRIGGER_TYPE')}</p>
          <p>{t('MANUAL')}</p>
        </div>
        <div className="col-span-2 mt-1">
          <p className="text-sm text-muted-foreground">{t('TRIGGERED_AT')}</p>
          {
            status ? (
              <p>{formatDate(triggeredAt)}</p>
            ) : (
              <p>{'N/A'}</p>
            )
          }
        </div>
        <div className="col-span-2 mt-1">
          <p className="text-sm text-muted-foreground">{t('TRIGGERED_BY')}</p>
          {
            status ? (
              <p>
                {
                 triggeredBy
                }
              </p>
            ) : (
              <p>{'N/A'}</p>
            )
          }
        </div>
        <div className="col-span-2">
          <p className="text-sm text-muted-foreground">Phase</p>
          <p>{phase}</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-muted-foreground">Notes</p>
          <p>{notes ? notes : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}
