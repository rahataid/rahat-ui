import { getTranslations } from 'next-intl/server';
import UserView from '../../sections/users/user.view';

export async function generateMetadata() {
  const t = await getTranslations('Users – List');
  return { title: t('SYSTEM_USERS') };
}

export default function BeneficiaryPage() {
  return <UserView />;
}
