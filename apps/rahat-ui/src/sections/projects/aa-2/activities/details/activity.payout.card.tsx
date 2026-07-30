import { useTranslations } from 'next-intl';

export default function ActivityPayoutCard() {
  const t = useTranslations('AA_PROJECT');
    return (
        <div className="bg-card p-4 rounded">
            <h1 className="font-semibold text-lg">{t('PAYOUT2')}</h1>
        </div>
    )
}