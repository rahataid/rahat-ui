import { getTranslations } from 'next-intl/server';
import TreasuryView from '../../sections/treasury/treasury.view';
export async function generateMetadata() {
  const t = await getTranslations('Treasury');
  return { title: t('TREASURY') };
}

export default function TreasuryPage() {
  return (
    <div className="bg-secondary p-2 h-[calc(100vh-80px)]">
      <TreasuryView />
    </div>
  );
}
