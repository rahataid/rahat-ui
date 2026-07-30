import { getTranslations } from 'next-intl/server';
import VoiceView from '../../../sections/communications/voice/voiceView';

export async function generateMetadata() {
  const t = await getTranslations('COMMS_PROJECT_OVERVIEW');
  return { title: t('VOICE') };
}

export default function VoicePage() {
  return <VoiceView />;
}
