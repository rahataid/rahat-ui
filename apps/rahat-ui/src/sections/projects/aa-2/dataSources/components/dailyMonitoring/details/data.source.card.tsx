import { useTranslations } from 'next-intl';
import { Calendar } from 'lucide-react';
import { ReactNode } from 'react';

type IProps = {
  source: string;
  day: string;
  date: string;
  dataEntryBy: string;
  component: ReactNode;
};

export default function DataSourceCard({
  source,
  day,
  date,
  dataEntryBy,
  component,
}: IProps) {
  const t = useTranslations('AA Project');
  return (
    <div className="p-4 bg-secondary rounded-sm">
      <div className="mb-2 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <h1 className="text-primary font-semibold">{t('DATA_SOURCE')} : {source}</h1>
          <h1 className="text-muted-foreground text-xs font-medium">
            {t('CREATED_BY')} : {dataEntryBy}
          </h1>
        </div>
        <div className="flex gap-2 items-center">
          <div>
            <h1 className="text-muted-foreground text-xs text-right">{day}</h1>
            <p className="text-sm">{date}</p>
          </div>
          <div className="p-2 rounded-full bg-primary text-white">
            <Calendar size={20} />
          </div>
        </div>
      </div>
      {component}
    </div>
  );
}
