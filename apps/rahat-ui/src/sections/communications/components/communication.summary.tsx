import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { HeartHandshake, Home, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

const CommunicationSummary = (statsData: any, isLoading: boolean) => {
  const t = useTranslations('Communications – Overview');
  const tg = useTranslations('GLOBAL');
  return (
    <div className=" grid md:grid-cols-3 gap-2 mb-2">
      <DataCard
        className=""
        title={t('TOTAL_CAMPAIGN_SENT')}
        number={statsData?.statsData?.total || tg('N_A')}
        Icon={Users}
      />
      <DataCard
        className=""
        title={t('SUCCESSFUL_CAMPAIGN')}
        number={statsData?.statsData?.success || tg('N_A')}
        Icon={Home}
      />
      <DataCard
        className=""
        title={t('FAILED_CAMPAIGN')}
        number={statsData?.statsData?.failed || tg('N_A')}
        Icon={HeartHandshake}
      />
    </div>
  );
};

export default CommunicationSummary;
