import { getTranslations } from 'next-intl/server';
import ProfileView from '../../sections/profile/profileView';

export async function generateMetadata() {
  const t = await getTranslations('Top Navigation / Header');
  return { title: t('PROFILE') };
}

export default function ProfilePage() {
  return <ProfileView />;
}
