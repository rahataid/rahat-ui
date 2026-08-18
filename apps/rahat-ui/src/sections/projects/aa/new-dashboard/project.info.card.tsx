import { PROJECT_SETTINGS_KEYS, useProjectSettingsStore } from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';

type IProps = {
  project: any;
};

export default function ProjectInfoCard({ project }: IProps) {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const { id } = useParams();
  const projectId = id as UUID;

  // const hazardType = useProjectSettingsStore((s) => s?.settings?.[projectId as string]?.[PROJECT_SETTINGS_KEYS.HAZARD_TYPE])

  return (
    <div className="bg-card p-4 rounded-sm shadow-md">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h1 className="text-muted-foreground text-sm">{t('PROJECT_STATUS')}</h1>
          <Badge className="bg-green-100 text-green-500">
            {translateValue(tg, project?.status)}
          </Badge>
        </div>
        <div className="text-right">
          <h1 className="text-muted-foreground text-sm">{t('TYPE')}</h1>
          <p className="text-sm">{project?.type?.toUpperCase()}</p>
        </div>
        <div>
          <h1 className="text-muted-foreground text-sm">{tg('LOCATION')}</h1>
          <p className="text-sm">{project?.extras?.location || '-'}</p>
        </div>
        {/* <div className='text-right'>
          <h1 className="text-muted-foreground text-sm">Hazard Type</h1>
          <p className="text-sm">{hazardType || '-'}</p>
        </div> */}
        <div className="">
          <h1 className="text-muted-foreground text-sm">{t('RIVER_BASIN')}</h1>
          <p className="text-sm">{project?.extras?.basin || '-'}</p>
        </div>
        <div className="col-span-2">
          <h1 className="text-muted-foreground text-sm">{t('PROJECT_DESCRIPTION')}</h1>
          <p className="text-sm">{project?.description}</p>
        </div>
      </div>
    </div>
  );
}
