import { getTranslations } from 'next-intl/server';
import TextDetailView from '../../../../sections/communications/text/textDetailView';

export async function generateMetadata() {
  const t = await getTranslations('COMMUNICATIONS_NAVIGATION');
  return { title: t('TEXT_DETAIL') };
}

export default function TextCampaignDetail() {
  return <TextDetailView />;
}
