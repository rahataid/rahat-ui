import { useTranslations } from 'next-intl';
import getIcon from 'apps/rahat-ui/src/utils/getIcon';
import CommsActivitiesTable from './comms.activities.table';
import { useNumberFormat } from 'apps/rahat-ui/src/utils/useNumberFormat';

export default function CommunicationLogsView() {
  const t = useTranslations('AA Project');
  const formatNum = useNumberFormat();
  const commStats = [
    {
      componentType: 'DATACARD',
      title: t('SMS_RECIPIENTS'),
      value: 0,
      icon: 'MessageSquare',
    },
    {
      componentType: 'DATACARD',
      title: t('IVR_RECIPIENTS'),
      value: 0,
      icon: 'AudioLines',
    },
    {
      componentType: 'DATACARD',
      title: t('TOTAL_SMS_SENT'),
      value: 0,
      icon: 'MessageSquare',
    },
    {
      componentType: 'DATACARD',
      title: t('TOTAL_IVR_SENT'),
      value: 0,
      icon: 'AudioLines',
    },
    {
      componentType: 'DATACARD',
      title: t('TOTAL_EMAIL_SENT'),
      value: 0,
      icon: 'AudioLines',
    },
    {
      componentType: 'DATACARD',
      title: t('IVR_SUCCESS_RATE'),
      value: 0,
      icon: 'AudioLines',
    },
    {
      componentType: 'DATACARD',
      title: t('AVERAGE_IVR_ATTEMPTS'),
      value: 0,
      icon: 'AudioLines',
    },
    {
      componentType: 'DATACARD',
      title: t('AVERAGE_DURATION_OF_IVR'),
      value: 0,
      icon: 'AudioLines',
    },
  ];

  return (
    <div className="p-4 bg-secondary h-[calc(100vh-65px)]">
      <h1 className="text-md font-semibold">{t('COMMUNICATION_SUMMARY')}</h1>

      <div className="grid md:grid-cols-4 gap-2 mt-2">
        {commStats.map((d) => {
          if (d.componentType === 'DATACARD') {
            const Icon = getIcon(d.icon);
            return (
              <div className="rounded-sm bg-card px-3 pt-2 pb-1 shadow-md">
                <div className="flex justify-between items-center">
                  <h1 className="text-sm">{d.title}</h1>
                  <div className="p-1 rounded-full bg-secondary text-primary">
                    <Icon size={16} strokeWidth={2.5} />
                  </div>
                </div>
                <p className="text-primary font-semibold text-xl">{formatNum(d.value)}</p>
              </div>
            );
          }
        })}
      </div>
      <div className=" mt-4">
        <CommsActivitiesTable />
      </div>
    </div>
  );
}
