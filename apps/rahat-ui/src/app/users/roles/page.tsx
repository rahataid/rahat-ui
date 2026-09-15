import { getTranslations } from 'next-intl/server';
import RoleView from 'apps/rahat-ui/src/sections/users/rolesandPermission/viewRoles';

export async function generateMetadata() {
  const t = await getTranslations('USERS_LIST');
  return { title: t('SYSTEM_USERS') };
}

export default function BeneficiaryPage() {
  return <RoleView />;
}
