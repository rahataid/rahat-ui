import { getTranslations } from 'next-intl/server';
import ProfileView from '../../sections/profile/profileView';

export async function generateMetadata() {
  const t = await getTranslations('TOP_NAVIGATION_HEADER');
  return { title: t('PROFILE') };
}

export default function ProfilePage() {
  return <ProfileView />;
}
