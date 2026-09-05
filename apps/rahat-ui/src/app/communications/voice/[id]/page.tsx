import { getTranslations } from 'next-intl/server';
import VoiceDetailView from '../../../../sections/communications/voice/voiceDetailView';

export async function generateMetadata() {
  const t = await getTranslations('COMMUNICATIONS_NAVIGATION');
  return { title: t('VOICE_DETAIL') };
}

export default function VoiceCampaignDetail() {
  return <VoiceDetailView />;
}
