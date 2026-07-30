import { getTranslations } from 'next-intl/server';
import TREASURYView from '../../sections/treasury/treasury.view';
export async function generateMetadata() {
  const t = await getTranslations('TREASURY');
  return { title: t('TREASURY') };
}

export default function TREASURYPage() {
  return (
    <div className="bg-secondary p-2 h-[calc(100vh-80px)]">
      <TREASURYView />
    </div>
  );
}
