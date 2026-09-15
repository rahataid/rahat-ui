import { getTranslations } from 'next-intl/server';
import VendorsView from "../../sections/vendors/vendors.view";

export async function generateMetadata() {
  const t = await getTranslations('VENDORS_LIST');
  return { title: t('VENDORS') };
}

export default function VendorsPage() {
  return <VendorsView />
}