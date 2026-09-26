'use client';

import { useTranslations } from 'next-intl';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import AACategoriesView from './categories/categories.view';
import AAProjectPhasesView from './aa.phases';
import ProjectHealthView from './project-health/project-health.view';
import BeneficiaryQrConfigView from './beneficiary-qr/beneficiary-qr.view';
import { useSearchParams } from 'next/navigation';

export default function AAProjectSettingsView() {
  const t = useTranslations('AA_PROJECT');
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'categories';

  return (
    <div className="p-4">
      <Tabs defaultValue={tab || 'categories'}>
        <TabsList className="border bg-secondary rounded">
          <TabsTrigger
            className="w-full data-[state=active]:bg-white"
            value="categories"
          >
            {t('CATEGORIES')}
          </TabsTrigger>
          <TabsTrigger
            className="w-full data-[state=active]:bg-white"
            value="phases"
          >
            {t('PHASES')}
          </TabsTrigger>
          <TabsTrigger
            className="w-full data-[state=active]:bg-white"
            value="health"
          >
            {t('HEALTH')}
          </TabsTrigger>
          <TabsTrigger
            className="w-full data-[state=active]:bg-white"
            value="beneficiaryQr"
          >
            {t('BENEFICIARY_QR')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="categories">
          <AACategoriesView />
        </TabsContent>
        <TabsContent value="phases">
          <AAProjectPhasesView />
        </TabsContent>
        <TabsContent value="health">
          <ProjectHealthView />
        </TabsContent>
        <TabsContent value="beneficiaryQr">
          <BeneficiaryQrConfigView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
