import { getTranslations } from 'next-intl/server';
import NotificationsView from '../../sections/notifications/notification.view';

export async function generateMetadata() {
  const t = await getTranslations('NOTIFICATIONS');
  return { title: t('NOTIFICATIONS') };
}

export default function ProfilePage() {
  return <NotificationsView />;
}
