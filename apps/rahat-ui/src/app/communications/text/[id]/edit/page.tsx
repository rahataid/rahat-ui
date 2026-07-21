import { getTranslations } from 'next-intl/server';
import { TextEditView } from '../../../../../sections/communications/text';

export async function generateMetadata() {
  const t = await getTranslations('Communications – Navigation');
  return { title: t('TEXT_EDIT') };
}

export default function TextCampaignEdit() {
  return <TextEditView />;
}
