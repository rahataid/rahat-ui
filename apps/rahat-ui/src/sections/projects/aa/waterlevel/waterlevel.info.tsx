import { FC } from 'react';
import { useTranslations } from 'next-intl';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/i18n/number';

type WaterLevelInfoProps = {
  data: any;
};

const renderStatus = (
  { warningLevel, dangerLevel, waterLevel }: any,
  t: (key: string) => string,
) => {
  let status;
  if (waterLevel >= dangerLevel) {
    status = 'danger';
  } else if (waterLevel >= warningLevel) {
    status = 'warning';
  } else {
    status = 'safe';
  }

  return (
    <div>
      <p
        className={`mt-4 sm:mt-8 sm:w-2/3 ${
          status === 'danger'
            ? 'text-red-500'
            : status === 'warning'
            ? 'text-yellow-500'
            : 'text-green-500'
        }`}
      >
        {status === 'danger'
          ? t('WATER_IS_IN_DANGER_LEVEL')
          : status === 'warning'
          ? t('WATER_IS_IN_WARNING_LEVEL')
          : t('WATER_IS_IN_SAFE_LEVEL')}
      </p>
      <p className="font-light">{t('STATUS')}</p>
    </div>
  );
};

const WaterLevelInfo: FC<WaterLevelInfoProps> = ({ data }) => {
  const formatNum = useNumberFormat();
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  if (!data) {
    return (
      <div className="grid grid-cols-1 rounded-sm bg-card p-4 mb-2 shadow">
        <div className="flex items-center flex-wrap mt-4 sm:mt-6 gap-10 md:gap-32">
          <div>
            <p className="font-light">{t('WATER_LEVEL_DATA_NOT_FOUND')}</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 rounded-sm bg-card p-4 mb-2 shadow">
      <div className="flex items-center flex-wrap mt-4 sm:mt-6 gap-10 md:gap-32">
        <div>
          <p className="font-medium text-primary">
            {data?.Schedule?.dataSource}
          </p>
          <p className="font-light">{t('DATA_SOURCE')}</p>
        </div>
        <div>
          <p className="font-medium text-primary">{data?.Schedule?.location}</p>
          <p className="font-light">{tg('LOCATION')}</p>
        </div>
        <div>
            <p className="font-medium text-primary">{formatNum(data?.data?.waterLevel)}</p>
          <p className="font-light">{t('WATER_LEVEL')}</p>
        </div>
      </div>
      <div className="flex items-center flex-wrap mt-4 sm:mt-6 gap-10 md:gap-32">
        <div>
          <p className="font-medium text-primary">
            {formatNum(data?.Schedule?.warningLevel)}
          </p>
          <p className="font-light">{t('WARNING_LEVEL')}</p>
        </div>
        <div>
          <p className="font-medium text-primary">
            {formatNum(data?.Schedule?.dangerLevel)}
          </p>
          <p className="font-light">{t('DANGER_LEVEL')}</p>
        </div>
      </div>
      {renderStatus(
        {
          warningLevel: data?.Schedule?.warningLevel,
          dangerLevel: data?.Schedule?.dangerLevel,
          waterLevel: data?.data?.waterLevel,
        },
        t,
      )}
    </div>
  );
};

export default WaterLevelInfo;