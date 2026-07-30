import { getTranslations } from 'next-intl/server';
import NOTIFICATIONSView from '../../sections/notifications/notification.view';

export async function generateMetadata() {
  const t = await getTranslations('NOTIFICATIONS');
  return { title: t('NOTIFICATIONS') };
}

export default function PROFILEPage() {
  return <NOTIFICATIONSView />;
}
