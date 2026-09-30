import { getTranslations } from 'next-intl/server';
import GlobalPermissionGuard from 'apps/rahat-ui/src/components/global-can';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import VendorsView from '../../sections/vendors/vendors.view';

export async function generateMetadata() {
  const t = await getTranslations('VENDORS_LIST');
  return { title: t('VENDORS') };
}

export default function VendorsPage() {
  return (
    <GlobalPermissionGuard action={ACTIONS.READ} subject={SUBJECTS.VENDOR}>
      <VendorsView />
    </GlobalPermissionGuard>
  );
}
