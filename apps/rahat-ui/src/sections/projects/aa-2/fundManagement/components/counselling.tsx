import React from 'react';
import { useTranslations } from 'next-intl';

const Counselling = () => {
  const t = useTranslations('AA Project');
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center text-xl">{t('COUNSELLING')}</div>
    </div>
  );
};

export default Counselling;
