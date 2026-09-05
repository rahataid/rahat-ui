import { getTranslations } from 'next-intl/server';
import UserView from '../../sections/users/user.view';

export async function generateMetadata() {
  const t = await getTranslations('USERS_LIST');
  return { title: t('SYSTEM_USERS') };
}

export default function BeneficiaryPage() {
  return <UserView />;
}
