import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { DataItem } from 'apps/rahat-ui/src/common';
import { User } from 'lucide-react';
import { useTranslations } from 'next-intl';
// import DataCard from '../../common/dataCard';

type IProps = {
  stakeholder: any;
};

const StakeHolderInfo = ({ stakeholder }: IProps) => {
  const t = useTranslations('AA Project');
  return (
    <>
      <div className="flex items-center">
        <div className="h-[clamp(40px,6vw,64px)] w-[clamp(40px,6vw,64px)] rounded-sm bg-gray-700 flex justify-center items-center">
          <User className="size-[clamp(18px,2.2vw,24px)]" color="white" />
        </div>

        <div className="flex flex-col ml-[clamp(8px,1.5vw,24px)]">
          <h1 className="text-[clamp(14px,1.6vw,20px)]">
            {stakeholder?.name}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-[clamp(8px,1.5vw,24px)] px-[clamp(8px,1.5vw,24px)] py-[clamp(4px,1vw,16px)]">
        <DataItem label={t('PHONE_NUMBER')} value={stakeholder?.phone} />
        <DataItem label={t('EMAIL')} value={stakeholder?.email} />
        <DataItem label={t('DESIGNATION')} value={stakeholder?.designation} />
        <DataItem label={t('ORGANIZATION')} value={stakeholder?.organization} />
        <DataItem label={t('DISTRICT')} value={stakeholder?.district} />
        <DataItem label={t('MUNICIPALITY')} value={stakeholder?.municipality} />

        <div>
          <h1 className="text-[clamp(12px,1.2vw,18px)] text-black">
            {t('SUPPORT_AREA')}
          </h1>
          {stakeholder?.supportArea?.map((a) => {
            return (
              <Badge
                className="text-[clamp(11px,1vw,14px)] text-muted-foreground font-medium w-auto mr-2"
                key={a}
              >
                {a}
              </Badge>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default StakeHolderInfo;
