import { useTranslations } from 'next-intl';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { UUID } from 'crypto';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
import { useParams } from 'next/navigation';

type IProps = {
  project: any;
};

export default function ProjectInfoCard({ project }: IProps) {
  const { id } = useParams();
  const projectId = id as UUID;
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');

  // const hazardType = useProjectSettingsStore(
  //   (s) =>
  //     s?.settings?.[projectId as string]?.[PROJECT_SETTINGS_KEYS.HAZARD_TYPE],
  // );

  return (
    <div className="bg-card p-4 rounded-sm shadow-sm border">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h1 className="text-muted-foreground text-sm">{t('PROJECT_STATUS')}</h1>
          <Badge className="bg-green-100 text-green-500">
            {project?.status
              ? translateValue(t, project.status, {
                  silent: true,
                  fallback: translateValue(tg, project.status, {
                    fallbackStyle: 'raw',
                  }),
                })
              : tg('N_A')}
          </Badge>
        </div>
        <div className="text-right">
          <h1 className="text-muted-foreground text-sm">{tg('TYPE')}</h1>
          <p className="text-sm">{project?.type?.toUpperCase()}</p>
        </div>
        <div>
          <h1 className="text-muted-foreground text-sm">{tg('LOCATION')}</h1>
          <p className="text-sm">{project?.extras?.location || '-'}</p>
        </div>
        {/* <div className="text-right">
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
